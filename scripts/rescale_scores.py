"""Rescale all product scores in Supabase to a realistic 30-85 range."""
import os
import random
import sys
from supabase import create_client

url = os.environ['SUPABASE_URL']
key = os.environ['SUPABASE_SERVICE_KEY']
supa = create_client(url, key)

# Fetch all products with scores
r = supa.table('products').select('id, estimated_score').gte('estimated_score', 0.1).execute()
products = r.data
print(f'Total products with scores: {len(products)}')

random.seed(42)

# Score mapping: old range -> new base range
def map_score(old_score):
    if old_score >= 95:
        base = random.randint(80, 85)
    elif old_score >= 90:
        base = random.randint(70, 79)
    elif old_score >= 85:
        base = random.randint(60, 69)
    elif old_score >= 80:
        base = random.randint(50, 59)
    elif old_score >= 70:
        base = random.randint(40, 49)
    else:
        base = random.randint(30, 39)
    
    variance = random.randint(-2, 2)
    return max(30, min(85, base + variance))

# Build all updates
updates = []
for p in products:
    new_score = float(map_score(p['estimated_score']))
    updates.append({'id': p['id'], 'new_score': new_score})

print(f'Prepared {len(updates)} updates')

# Update in batches
batch_size = 50
total = len(updates)
for i in range(0, total, batch_size):
    batch = updates[i:i+batch_size]
    for item in batch:
        supa.table('products').update({'estimated_score': item['new_score']}).eq('id', item['id']).execute()
    print(f'  Updated {min(i+batch_size, total)}/{total}')
    sys.stdout.flush()

print('\nAll updates complete!')

# Verify
r2 = supa.table('products').select('id, name, estimated_score, slug').gte('estimated_score', 0.1).order('estimated_score', desc=True).execute()
print('\nNew Top 15:')
for p in r2.data[:15]:
    print(f"  {p['estimated_score']:5.1f}  {p['slug'][:60]}")

print('\nNew Bottom 5:')
for p in r2.data[-5:]:
    print(f"  {p['estimated_score']:5.1f}  {p['slug'][:60]}")

# Distribution stats
scores = [p['estimated_score'] for p in r2.data]
print(f'\nDistribution stats:')
print(f'  Max: {max(scores):.0f}')
print(f'  Min: {min(scores):.0f}')
print(f'  Mean: {sum(scores)/len(scores):.1f}')
# Buckets
buckets = {'30-39': 0, '40-49': 0, '50-59': 0, '60-69': 0, '70-79': 0, '80-85': 0}
for s in scores:
    if s < 40: buckets['30-39'] += 1
    elif s < 50: buckets['40-49'] += 1
    elif s < 60: buckets['50-59'] += 1
    elif s < 70: buckets['60-69'] += 1
    elif s < 80: buckets['70-79'] += 1
    else: buckets['80-85'] += 1
for k, v in buckets.items():
    print(f'  {k}: {v}')
