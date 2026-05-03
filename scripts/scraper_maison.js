const { chromium } = require('playwright');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

async function searchAmazon(query) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  
  try {
    const context = await browser.newContext({
      userAgent: UA,
      viewport: { width: 1920, height: 1080 },
      locale: 'fr-FR',
      timezoneId: 'Europe/Paris',
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', { get: () => [1,2,3,4,5] });
      Object.defineProperty(navigator, 'languages', { get: () => ['fr-FR', 'fr', 'en'] });
      window.chrome = { runtime: {} };
    });

    // Warmup
    await page.goto('https://www.amazon.fr', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Search
    await page.goto(
      'https://www.amazon.fr/s?k=' + encodeURIComponent(query),
      { waitUntil: 'domcontentloaded', timeout: 30000 }
    );
    await page.waitForTimeout(3000);

    // Check block
    const bodyText = await page.textContent('body').catch(() => '');
    if (bodyText.includes('Toutes nos excuses') || bodyText.includes('désolé')) {
      console.log(JSON.stringify({ blocked: true, error: 'Amazon block page' }));
      return;
    }

    // Extract results
    const results = [];
    const items = await page.$$('[data-asin]');
    for (const item of items) {
      const asin = await item.getAttribute('data-asin');
      if (!asin || asin.length !== 10) continue;
      
      let title = '';
      let price = '';
      let image = '';
      
      const h2 = await item.$('h2');
      if (h2) title = (await h2.textContent()).trim();
      
      const priceEl = await item.$('.a-price-whole');
      if (priceEl) price = (await priceEl.textContent()).trim();
      if (!price) {
        const offscreen = await item.$('.a-offscreen');
        if (offscreen) price = (await offscreen.textContent()).trim();
      }
      
      const img = await item.$('img.s-image');
      if (img) image = await img.getAttribute('src') || '';
      
      results.push({ asin, title: title.substring(0, 200), price, image: image.substring(0, 300) });
    }

    console.log(JSON.stringify({ mode: 'search', query, results: results.slice(0, 10) }));

  } catch(e) {
    console.log(JSON.stringify({ error: e.message }));
  } finally {
    await browser.close().catch(() => {});
  }
}

async function getProduct(asin) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  
  try {
    const context = await browser.newContext({
      userAgent: UA,
      viewport: { width: 1920, height: 1080 },
      locale: 'fr-FR',
      timezoneId: 'Europe/Paris',
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', { get: () => [1,2,3,4,5] });
      Object.defineProperty(navigator, 'languages', { get: () => ['fr-FR', 'fr', 'en'] });
      window.chrome = { runtime: {} };
    });

    // Warmup
    await page.goto('https://www.amazon.fr', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Product page
    await page.goto('https://www.amazon.fr/dp/' + asin, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);

    const bodyText = await page.textContent('body').catch(() => '');
    if (bodyText.includes('Toutes nos excuses')) {
      console.log(JSON.stringify({ blocked: true, error: 'Blocked', asin }));
      return;
    }

    let title = '';
    try { title = (await page.textContent('#productTitle') || '').trim(); } catch(e) {}
    
    let price = '';
    const selectors = [
      '#corePrice_feature_div .a-offscreen',
      '.a-price[data-a-size="xl"] .a-offscreen',
      '.a-price-whole',
      '#price_inside_buybox',
      '.a-price .a-offscreen',
    ];
    for (const sel of selectors) {
      try {
        const el = await page.$(sel);
        if (el) {
          const txt = (await el.textContent()) || '';
          const m = txt.match(/[\d\s]*[.,]?\d+/);
          if (m && m[0].trim()) { price = m[0].trim(); break; }
        }
      } catch(e) {}
    }

    let image = '';
    try {
      const img = await page.$('#landingImage');
      if (img) {
        image = await img.getAttribute('src') || await img.getAttribute('data-old-hires') || '';
        if (image) image = image.replace(/_AC_SL\d+/, '_AC_SL1500');
      }
    } catch(e) {}

    let brand = '';
    try {
      const byline = (await page.textContent('#bylineInfo') || '').trim();
      brand = byline.replace(/^Visitez la boutique /, '').replace(/^Brand: /, '').trim();
    } catch(e) {}

    console.log(JSON.stringify({
      mode: 'product', asin,
      title: title.substring(0, 300),
      price, image, brand: brand.substring(0, 100)
    }));

  } catch(e) {
    console.log(JSON.stringify({ error: e.message }));
  } finally {
    await browser.close().catch(() => {});
  }
}

// CLI
const mode = process.argv[2];
if (mode === 'search') {
  const query = process.argv.slice(3).join(' ');
  searchAmazon(query);
} else if (mode === 'product') {
  const asin = process.argv[3];
  getProduct(asin);
} else {
  console.log(JSON.stringify({ error: 'Usage: node scraper.js search|product <query|asin>' }));
}
