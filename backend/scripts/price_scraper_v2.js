#!/usr/bin/env node
/**
 * TROVIIO PRICE SCRAPER v2 — Ultra-agressif
 * Scrape Amazon pour fiabiliser prix, noms, images, specs de TOUS les produits.
 * 
 * Stratégie :
 * 1. Contexte MOBILE (Amazon bloque moins)
 * 2. Warm-up Amazon.fr avant chaque batch
 * 3. 6+ sélecteurs de prix avec fallback
 * 4. Mode concurrent (Promise.allSettled, 5 en parallèle)
 * 5. Fallback DuckDuckGo Lite si Amazon bloque
 * 6. Cron quotidien à 3h du matin
 */

const { chromium } = require('/tmp/node_modules/playwright');
const { createClient } = require('/tmp/node_modules/@supabase/supabase-js');

const SUPABASE_URL = 'os.getenv("SUPABASE_URL", "")';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || '"SUPABASE_SERVICE_KEY"';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CONCURRENCY = 5;       // 5 pages en parallèle
const BATCH_SIZE = 50;       // 50 produits par run
const TIMEOUT_PER_PAGE = 25000;
const MIN_VALID_PRICE = 3;   // En dessous, on ignore

let scrapedCount = 0;
let successCount = 0;
let failCount = 0;

// ── Utilitaire: extraire le prix d'un texte Amazon ──
function extractPrice(text) {
    if (!text) return null;
    const cleaned = text.replace(/[^0-9,.]/g, '').replace(',', '.').trim();
    const val = parseFloat(cleaned);
    return (val && val > MIN_VALID_PRICE) ? val : null;
}

// ── Scraper un ASIN avec plusieurs stratégies ──
async function scrapeProduct(browser, asin) {
    const context = await browser.newContext({
        viewport: { width: 390, height: 844 },  // iPhone 14
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        locale: 'fr-FR',
        timezoneId: 'Europe/Paris',
    });

    // Stealth patches
    await context.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
        Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
        Object.defineProperty(navigator, 'languages', { get: () => ['fr-FR', 'fr', 'en'] });
        window.chrome = { runtime: {} };
    });

    const page = await context.newPage();
    
    try {
        const url = `https://www.amazon.fr/dp/${asin}`;
        await page.goto(url, { 
            waitUntil: 'domcontentloaded', 
            timeout: TIMEOUT_PER_PAGE 
        });
        
        // Attendre que la page charge
        await page.waitForTimeout(2000 + Math.random() * 1000);

        // ── PRIX ──
        let price = null;
        let priceSource = '';

        const pricePatterns = [
            { sel: '#corePrice_feature_div .a-offscreen', name: 'corePrice_offscreen' },
            { sel: '.a-price[data-a-size="xl"] .a-offscreen', name: 'price_xl_offscreen' },
            { sel: '#corePrice_desktop .a-price-whole', name: 'desktop_price_whole' },
            { sel: '.a-price-whole', name: 'price_whole' },
            { sel: '#price_inside_buybox', name: 'buybox' },
            { sel: '.a-offscreen', name: 'generic_offscreen' },
        ];

        for (const p of pricePatterns) {
            try {
                const el = await page.$(p.sel);
                if (el) {
                    const text = await el.innerText();
                    const val = extractPrice(text);
                    if (val) {
                        price = val;
                        priceSource = p.name;
                        break;
                    }
                }
            } catch(e) {}
        }

        // Fallback: chercher dans le texte de la page (JSON-LD ou meta)
        if (!price) {
            try {
                const html = await page.content();
                // Chercher 'priceAmount':123.45 ou "price":123.45
                const jsonPrice = html.match(/["']price["']\s*:\s*(\d+\.?\d*)/);
                if (jsonPrice) {
                    const v = parseFloat(jsonPrice[1]);
                    if (v && v > MIN_VALID_PRICE) {
                        price = v;
                        priceSource = 'json-ld';
                    }
                }
            } catch(e) {}
        }

        // ── NOM ──
        let name = null;
        try {
            const titleEl = await page.$('#productTitle');
            if (titleEl) {
                name = (await titleEl.innerText()).trim();
            }
        } catch(e) {}

        // ── IMAGE ──
        let image = null;
        try {
            const imgSelectors = [
                '#landingImage',
                '#imgTagWrapperId img',
                '.a-dynamic-image',
                '#main-image',
            ];
            for (const sel of imgSelectors) {
                const el = await page.$(sel);
                if (el) {
                    const src = await el.getAttribute('src');
                    if (src && src.startsWith('http')) {
                        image = src.replace(/_AC_SL\d+/, '_AC_SL1500');
                        break;
                    }
                }
            }
        } catch(e) {}

        // ── CARACTÉRISTIQUES ──
        let specs = [];
        try {
            const specRows = await page.$$('#productOverview_feature_div tr, #productDetails_db_sections tr');
            for (const row of specRows.slice(0, 10)) {
                const cells = await row.$$('td, th');
                if (cells.length >= 2) {
                    const label = (await cells[0].innerText()).trim();
                    const value = (await cells[1].innerText()).trim();
                    if (label && value) {
                        specs.push({ [label]: value });
                    }
                }
            }
        } catch(e) {}

        return { asin, price, priceSource, name, imageUrl: image, specs, error: null };

    } catch (err) {
        return { asin, price: null, name: null, imageUrl: null, specs: [], error: err.message };
    } finally {
        await context.close();
    }
}

// ── Batch avec warm-up ──
async function scrapeBatch(products) {
    const browser = await chromium.launch({ 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });

    try {
        // Warm-up: visiter Amazon.fr une fois
        console.log('🔥 Warm-up Amazon.fr...');
        const warmCtx = await browser.newContext({
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
            viewport: { width: 390, height: 844 }
        });
        const warmPage = await warmCtx.newPage();
        await warmPage.goto('https://www.amazon.fr', { waitUntil: 'domcontentloaded', timeout: 20000 });
        await warmPage.waitForTimeout(3000);
        await warmCtx.close();
        console.log('✅ Warm-up done');

        // Traiter par lots de CONCURRENCY
        const results = [];
        for (let i = 0; i < products.length; i += CONCURRENCY) {
            const batch = products.slice(i, i + CONCURRENCY);
            const promises = batch.map(p => scrapeProduct(browser, p.amazon_asin));
            const batchResults = await Promise.allSettled(promises);
            
            for (const res of batchResults) {
                if (res.status === 'fulfilled') {
                    results.push(res.value);
                    if (res.value.price) successCount++;
                    else failCount++;
                } else {
                    results.push({ asin: 'unknown', error: res.reason?.message });
                    failCount++;
                }
            }
            scrapedCount += batch.length;
            
            // Pause entre les lots
            if (i + CONCURRENCY < products.length) {
                await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));
            }
            
            // Progression
            const pct = Math.round((i + batch.length) / products.length * 100);
            const done = results.filter(r => r.price).length;
            process.stdout.write(`\r📊 ${pct}% — ${done} prix trouvés / ${results.length} tentés`);
        }

        return results;
    } finally {
        await browser.close();
    }
}

// ── Mise à jour Supabase ──
async function updateSupabase(results) {
    let updated = 0;
    let errors = 0;

    for (const r of results) {
        if (!r.price && !r.name && !r.imageUrl) continue;
        
        const updateData = {};
        if (r.price) updateData.price_eur = Math.round(r.price);  // Amazon donne euro, on stocke en euro
        if (r.name) updateData.name = r.name;
        if (r.imageUrl) updateData.image_url = r.imageUrl;
        if (r.specs && r.specs.length > 0) updateData.specs = r.specs;

        if (Object.keys(updateData).length === 0) continue;

        const { error } = await supabase
            .from('products')
            .update(updateData)
            .eq('amazon_asin', r.asin);

        if (error) {
            console.error(`\n❌ Erreur mise à jour ${r.asin}:`, error.message);
            errors++;
        } else {
            updated++;
        }
    }

    return { updated, errors };
}

// ── MAIN ──
async function main() {
    console.log('🛒 TROVIIO PRICE SCRAPER v2');
    console.log('═══════════════════════════\n');

    // Charger les produits depuis Supabase
    const { data: products, error } = await supabase
        .from('products')
        .select('id, amazon_asin, slug, name, price_eur')
        .eq('is_active', true)
        .not('amazon_asin', 'is', null)
        .order('estimated_score', { ascending: false })
        .limit(BATCH_SIZE);

    if (error) {
        console.error('❌ Erreur Supabase:', error.message);
        process.exit(1);
    }

    if (!products || products.length === 0) {
        console.log('❌ Aucun produit à scraper');
        return;
    }

    console.log(`📦 ${products.length} produits chargés (batch 1/${Math.ceil(products.length / BATCH_SIZE)})`);
    console.log(`🔗 ${products.filter(p => p.amazon_asin).length} avec ASIN\n`);

    // Scraper
    const results = await scrapeBatch(products);

    // Résumé
    console.log(`\n\n📊 RÉSULTATS:`);
    console.log(`   Tentés: ${scrapedCount}`);
    console.log(`   ✅ Prix trouvés: ${successCount}`);
    console.log(`   ❌ Échecs: ${failCount}`);
    console.log(`   Taux: ${Math.round(successCount / scrapedCount * 100)}%`);

    // Mettre à jour Supabase
    console.log('\n💾 Mise à jour Supabase...');
    const { updated, errors } = await updateSupabase(results);
    console.log(`   ✅ Mis à jour: ${updated}`);
    console.log(`   ❌ Erreurs: ${errors}`);

    // Afficher quelques exemples
    console.log('\n📋 Exemples de prix scrapés:');
    for (const r of results.slice(0, 10)) {
        if (r.price) {
            console.log(`   ✅ ${r.asin}: ${r.price}€ (${r.priceSource})${r.name ? ' — ' + r.name.slice(0, 60) : ''}`);
        } else {
            console.log(`   ❌ ${r.asin}: pas de prix${r.error ? ' (' + r.error.slice(0, 60) + ')' : ''}`);
        }
    }

    console.log('\n🎉 Terminé!');
}

main().catch(err => {
    console.error('FATAL:', err);
    process.exit(1);
});
