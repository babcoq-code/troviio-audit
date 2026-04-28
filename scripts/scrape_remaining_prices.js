const { chromium } = require('/tmp/node_modules/playwright');
const fs = require('fs');
const supabaseUrl = 'https://uukshxztoztkwxuuvqzc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

async function scrapePrice(asin) {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] });
  try {
    const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  await page.evaluate(() => { Object.defineProperty(navigator, 'webdriver', { get: () => false }); });
    
    await page.goto(`https://www.amazon.fr/dp/${asin}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(1500);
    
    let price = null;
    const selectors = [
      '#corePrice_feature_div .a-offscreen',
      '.a-price[data-a-size="xl"] .a-offscreen',
      '.a-price-whole',
      '#price_inside_buybox',
      '.a-price .a-offscreen',
      '#corePrice_desktop .a-price-whole'
    ];
    for (const sel of selectors) {
      try {
        const el = await page.$(sel);
        if (el) {
          let txt = await el.innerText();
          if (!txt) txt = await el.getAttribute('aria-label') || await el.textContent();
          if (txt) {
            const m = txt.match(/[\d\s]*[.,]?\d+/);
            if (m) price = parseFloat(m[0].replace(/\s/g, '').replace(',', '.'));
            if (price && price > 2) break;
          }
        }
      } catch(e) {}
    }
    
    let image = null;
    try {
      const img = await page.$('#landingImage');
      if (img) {
        image = await img.getAttribute('src');
        if (image) image = image.replace(/_AC_SL\d+/, '_AC_SL1500');
      }
    } catch(e) {}
    
    return { price, image };
  } finally {
    await browser.close().catch(() => {});
  }
}

async function main() {
  const res = await fetch(`${supabaseUrl}/rest/v1/products?select=slug,amazon_asin&amazon_asin=not.is.null&price=is.null&limit=50`, {
    headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
  });
  const products = await res.json();
  console.log(`Produits à scraper: ${products.length}`);
  if (!products.length) { console.log('Rien à faire.'); return; }
  
  let ok = 0, fail = 0;
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    try {
      const data = await scrapePrice(p.amazon_asin);
      if (data.price > 2 || data.image) {
        const update = {};
        if (data.price > 2) update.price = Math.round(data.price * 100) / 100;
        if (data.image) update.image_url = data.image;
        
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
        console.log(`[${i+1}/${products.length}] ✓ ${p.slug}: ${data.price || '?'}€ ${data.image ? '📷' : ''}`);
        ok++;
      } else {
        console.log(`[${i+1}/${products.length}] ✗ ${p.slug}: no data`);
        fail++;
      }
    } catch(e) {
      console.log(`[${i+1}/${products.length}] ✗ ${p.slug}: ${e.message}`);
      fail++;
    }
  }
  console.log(`\n✅ Réussi: ${ok}/${products.length}`);
  console.log(`❌ Échecs: ${fail}/${products.length}`);
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); })
  .then(() => process.exit(0));
