const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

async function createBrowser() {
  return await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
}

async function createPage(browser) {
  const context = await browser.newContext({
    userAgent: UA,
    locale: 'fr-FR',
    viewport: { width: 1920, height: 1080 },
    extraHTTPHeaders: {
      'Accept-Language': 'fr-FR,fr;q=0.9',
    },
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    window.chrome = { runtime: {} };
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
  });
  return page;
}

app.get('/search-asin', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing query param q' });

  let browser;
  try {
    browser = await createBrowser();
    const page = await createPage(browser);
    
    // Go to homepage first
    await page.goto('https://www.amazon.fr', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // Search
    await page.goto(`https://www.amazon.fr/s?k=${encodeURIComponent(q)}`, {
      waitUntil: 'domcontentloaded', timeout: 30000
    });
    await page.waitForTimeout(3000);

    const body = await page.textContent('body').catch(() => '');
    if (body.includes('Toutes nos excuses')) {
      return res.json({ asin: null, blocked: true });
    }

    const asins = await page.$$eval('[data-asin]', els =>
      els.map(el => el.getAttribute('data-asin')).filter(a => a && a.length === 10)
    ).catch(() => []);

    res.json({ asin: asins[0] || null, blocked: false, count: asins.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.get('/scrape-product', async (req, res) => {
  const { asin } = req.query;
  if (!asin) return res.status(400).json({ error: 'Missing asin param' });

  let browser;
  try {
    browser = await createBrowser();
    const page = await createPage(browser);
    
    await page.goto('https://www.amazon.fr', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
    
    await page.goto(`https://www.amazon.fr/dp/${asin}`, {
      waitUntil: 'domcontentloaded', timeout: 30000
    });
    await page.waitForTimeout(3000);

    const price = await page.$eval('.a-price .a-offscreen', el => el.textContent.trim()).catch(() => null);
    const image = await page.$eval('#landingImage', el => el.getAttribute('src')).catch(() => null);
    const title = await page.$eval('#productTitle', el => el.textContent.trim()).catch(() => null);

    res.json({ asin, price, image, title });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(3002, () => {
  console.log('Troviio Scraper on port 3002');
});
