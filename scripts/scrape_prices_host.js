const { chromium } = require('/tmp/node_modules/playwright');
const supabaseUrl = 'os.getenv("SUPABASE_URL", "")';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'SUPABASE_SERVICE_KEY_PLACEHOLDER';

async function scrapePrice(asin) {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
    // Stealth
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
    const url = `https://www.amazon.fr/dp/${asin}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2000);
    
    // Try multiple price selectors
    let price = null;
    const selectors = [
      '#corePrice_feature_div .a-offscreen',
      '.a-price .a-offscreen',
      '#corePrice_desktop .a-price-whole',
      '.a-price-whole',
      '#price_inside_buybox',
      '.a-price[data-a-size="xl"] .a-offscreen'
    ];
    for (const sel of selectors) {
      try {
        const el = await page.$(sel);
        if (el) {
          const txt = await el.innerText();
          if (txt) {
            price = parseFloat(txt.replace(/[^\d,.]/g, '').replace(',', '.'));
            if (price && price > 2) break;
          }
        }
      } catch(e) {}
    }
    
    // Get image
    let image = null;
    try {
      const img = await page.$('#landingImage, #imgTagWrapperId img, .a-dynamic-image');
      if (img) {
        image = await img.getAttribute('src');
        if (image) image = image.replace('_AC_SL', '_AC_SL1500');
      }
    } catch(e) {}
    
    return { price, image };
  } finally {
    await browser.close();
  }
}

async function main() {
  // Fetch products avec ASIN mais sans prix
  const url = `${supabaseUrl}/rest/v1/products?select=slug,amazon_asin&amazon_asin=is.not.null&amazon_price=is.null&limit=50`;
  const res = await fetch(url, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  });
  const products = await res.json();
  console.log(`Produits à traiter: ${products.length}`);
  
  const results = [];
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    try {
      const data = await scrapePrice(p.amazon_asin);
      console.log(`[${i+1}/${products.length}] ${p.slug} -> ${p.amazon_asin}: ${data.price ? data.price + '€' : 'N/A'} ${data.image ? '📷' : '❌'}`);
      results.push({ slug: p.slug, asin: p.amazon_asin, ...data });
      
      // Update Supabase
      if (data.price || data.image) {
        const update = {};
        if (data.price) update.amazon_price = Math.round(data.price * 100) / 100;
        if (data.image) update.amazon_image_url = data.image;
        
        await fetch(`${supabaseUrl}/rest/v1/products?slug=eq.${encodeURIComponent(p.slug)}`, {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(update)
        });
      }
    } catch(e) {
      console.log(`[${i+1}/${products.length}] ${p.slug}: ERROR ${e.message}`);
    }
  }
  
  console.log(`\n✅ Traités: ${results.length}`);
  console.log(`📊 Avec prix: ${results.filter(r => r.price).length}`);
  console.log(`📷 Avec image: ${results.filter(r => r.image).length}`);
  require('fs').writeFileSync('/tmp/prices_result.json', JSON.stringify(results, null, 2));
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
