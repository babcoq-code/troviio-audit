const { chromium } = require('playwright');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'os.getenv("SUPABASE_URL", "")';
const SUPABASE_KEY = 'SUPABASE_SERVICE_KEY_PLACEHOLDER';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

async function createBrowser() {
  return await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
}

async function execSearch(browser, query) {
  const ctx = await browser.newContext({
    userAgent: UA,
    locale: 'fr-FR',
    viewport: { width: 1920, height: 1080 },
  });
  const page = await ctx.newPage();
  
  // Stealth patches
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    Object.defineProperty(navigator, 'plugins', { get: () => [1,2,3,4,5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['fr-FR', 'fr', 'en'] });
    window.chrome = { runtime: {} };
  });
  
  // Homepage first (get cookies)
  await page.goto('https://www.amazon.fr', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);
  
  // Search
  await page.goto(`https://www.amazon.fr/s?k=${encodeURIComponent(query)}`, {
    waitUntil: 'domcontentloaded', timeout: 30000
  });
  await page.waitForTimeout(3000);
  
  const body = await page.textContent('body').catch(() => '');
  if (body.includes('Toutes nos excuses')) {
    await ctx.close();
    return null;
  }
  
  const asins = await page.$$eval('[data-asin]', els =>
    els.map(el => el.getAttribute('data-asin')).filter(a => a && a.length === 10)
  ).catch(() => []);
  
  await ctx.close();
  return asins[0] || null;
}

async function main() {
  const start = parseInt(process.argv[2]) || 0;
  const batchSize = parseInt(process.argv[3]) || 20;
  
  // Load existing
  const fs = require('fs');
  let existing = {};
  try {
    existing = JSON.parse(fs.readFileSync('/tmp/asins_final.json', 'utf8'));
  } catch {}
  
  // Get products without ASIN
  const { data: products } = await supabase
    .from('products')
    .select('slug,name,brand,model')
    .is('amazon_asin', null)
    .order('slug');
  
  // Filter to P1 (brand+model, not unreleased)
  const priority = products.filter(p => {
    if (existing[p.slug]) return false;
    const brand = (p.brand || '').trim();
    const model = (p.model || '').trim();
    const name = p.name || '';
    if (name.match(/iPhone.*1[7]|SE 4|Galaxy S26/)) return false;
    return brand && brand !== 'None' && model && model !== 'None';
  });
  
  const batch = priority.slice(start, start + batchSize);
  console.log(`Products: ${products.length}, Priority: ${priority.length}, Batch: ${batch.length}`);
  
  const browser = await createBrowser();
  const newFound = {};
  
  for (let i = 0; i < batch.length; i++) {
    const p = batch[i];
    const name = p.name.replace(/[⭐🌟★]/g, '').split('(')[0].split('—')[0].trim();
    const brand = (p.brand || '').trim();
    const model = (p.model || '').trim();
    
    process.stdout.write(`[${start+i+1}/${priority.length}] ${p.slug.slice(0,35).padEnd(35)} `);
    
    // Try brand + model first
    let asin = null;
    for (const q of [`${brand} ${model}`, name.slice(0, 70)]) {
      asin = await execSearch(browser, q);
      if (asin) break;
    }
    
    if (asin) {
      newFound[p.slug] = asin;
      process.stdout.write(`✓ ${asin}\n`);
    } else {
      process.stdout.write(`✗\n`);
    }
  }
  
  await browser.close();
  
  // Save + update
  Object.assign(existing, newFound);
  fs.writeFileSync('/tmp/asins_final.json', JSON.stringify(existing, null, 2));
  
  for (const [slug, asin] of Object.entries(newFound)) {
    await supabase.from('products').update({ amazon_asin: asin }).eq('slug', slug);
  }
  
  console.log(`\n✅ This batch: ${Object.keys(newFound).length}/${batch.length}`);
  console.log(`📊 Total: ${Object.keys(existing).length}/${products.length}`);
}

main().catch(console.error);
