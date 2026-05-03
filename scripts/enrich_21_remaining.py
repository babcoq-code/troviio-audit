#!/usr/bin/env python3
"""
Enrich the remaining products without test_summary via DeepSeek API.
Processes all products without test_summary, ordered by estimated_score DESC.
"""
import supabase, json, urllib.request, time, os, sys

SUPABASE_URL = "os.getenv("SUPABASE_URL", "")"
SUPABASE_KEY = ""SUPABASE_SERVICE_KEY""

s = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

api_key = os.environ.get('DEEPSEEK_API_KEY', '')
model = os.environ.get('DEEPSEEK_MODEL', 'deepseek-chat')

if not api_key:
    print("FATAL: DEEPSEEK_API_KEY not set in environment")
    sys.exit(1)

print(f"Using model: {model}")
print(f"API key prefix: {api_key[:10]}...")

# Fetch all products without test_summary, ordered by estimated_score DESC
prods = (
    s.table('products')
    .select('id,name,brand,description,pros,cons')
    .eq('is_active', True)
    .is_('test_summary', 'null')
    .not_.is_('estimated_score', 'null')
    .order('estimated_score', desc=True)
    .execute()
    .data
)

total = len(prods)
print(f"\nTotal products to process: {total}")
if total == 0:
    print("Nothing to do. Exiting.")
    sys.exit(0)

success_count = 0
fail_count = 0

for i, p in enumerate(prods):
    prod_name = f"{p.get('brand', '')} {p.get('name', '')}".strip()
    print(f"\n[{i+1}/{total}] {p['id'][:8]}... {prod_name}", end=" ", flush=True)

    description = (p.get('description') or '')[:300]
    pros = p.get('pros', [])
    cons = p.get('cons', [])

    prompt = f"""Produit: {p['brand']} {p['name']}
Description: {description}
Points forts: {json.dumps(pros, ensure_ascii=False)}
Points faibles: {json.dumps(cons, ensure_ascii=False)}

Rédige une synthèse de test (150-250 mots) pour ce produit en t'inspirant de tests réalisés par Les Numériques, 01net et Que Choisir. 
La synthèse doit être crédible, nuancée (points forts ET faibles), et mentionner les sources de façon naturelle.

Retourne UNIQUEMENT du JSON valide avec cette structure exacte:
{{"test_summary": "votre synthèse ici"}}
"""

    request_data = json.dumps({
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 600,
        "temperature": 0.5
    }).encode()

    success = False
    last_error = None

    for attempt in range(3):
        try:
            req = urllib.request.Request(
                "https://api.deepseek.com/chat/completions",
                data=request_data,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                }
            )
            resp = urllib.request.urlopen(req, timeout=30)
            result = json.loads(resp.read().decode())

            content = result["choices"][0]["message"]["content"].strip()

            # Try to extract JSON from the response
            test_summary = None
            try:
                # First attempt: direct JSON parse
                j = json.loads(content)
                test_summary = j.get("test_summary", content)
            except json.JSONDecodeError:
                # Second attempt: find JSON block within text
                import re
                json_match = re.search(r'\{[^{}]*"test_summary"[^{}]*\}', content, re.DOTALL)
                if json_match:
                    try:
                        j = json.loads(json_match.group())
                        test_summary = j.get("test_summary", content)
                    except:
                        test_summary = content
                else:
                    test_summary = content

            if test_summary and len(test_summary) > 20:
                # Update Supabase
                s.table('products').update({"test_summary": test_summary}).eq('id', p['id']).execute()
                print(f"✅ ({len(test_summary)} chars)", flush=True)
                success = True
                success_count += 1
                break
            else:
                last_error = f"Empty/too short summary: {test_summary}"
                print(f"⚠️A", end=" ", flush=True)

        except urllib.error.HTTPError as e:
            body = e.read().decode()[:200]
            last_error = f"HTTP {e.code}: {body}"
            print(f"⚠️H{e.code}", end=" ", flush=True)
        except Exception as e:
            last_error = str(e)[:100]
            print(f"⚠️", end=" ", flush=True)

        time.sleep(2 * (attempt + 1))  # Backoff: 2s, 4s, 6s

    if not success:
        fail_count += 1
        print(f"❌ {last_error}", flush=True)

    # Rate limit: 1 call per 0.5s
    time.sleep(0.5)

print(f"\n{'='*50}")
print(f"Résultats: {success_count} ✅ réussis, {fail_count} ❌ échecs sur {total} total")
print(f"{'='*50}")
