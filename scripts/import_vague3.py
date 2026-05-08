#!/usr/bin/env python3
"""
Import Troviio Vague 3 products (40 products, 4 categories) into Supabase
Reads from the two PART files and inserts via REST API
"""
import httpx, json, re, sys, uuid, os

SUPABASE_URL = "https://uukshxztoztkwxuuvqzc.supabase.co"
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
headers = {"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}", "Content-Type": "application/json", "Prefer": "return=representation"}

CAT_IDS = {
    'ventilateur-colonne': '7861b111-0916-4516-b66b-f8678f80aff8',
    'climatiseur-portable': '254b7530-ed4a-4b0c-9d17-636bd0c06433',
    'station-charge-usb-c': 'd7c31a17-23ab-4a35-a126-8fd38ad2ea7d',
    'onduleur-ups': '9ca7da8c-9946-4bb5-8d80-9630f0cabdbf',
}

def parse_pros_cons(text):
    """Parse ARRAY[...] text into a list"""
    # Remove ARRAY[ and trailing ]
    inner = text.strip()
    if inner.startswith("ARRAY["):
        inner = inner[6:-1]
    elif inner.startswith("["):
        inner = inner[1:-1]
    
    # Handle empty
    if not inner.strip():
        return []
    
    # Split by commas not inside quotes
    result = []
    current = ""
    in_quote = False
    for ch in inner:
        if ch == "'":
            in_quote = not in_quote
            if not in_quote:
                result.append(current.strip().strip("'").replace("''", "'"))
                current = ""
            continue
        if ch == ',' and not in_quote:
            if current.strip():
                result.append(current.strip().strip("'").replace("''", "'"))
            current = ""
            continue
        if in_quote:
            current += ch
    
    if current.strip():
        result.append(current.strip().strip("'").replace("''", "'"))
    
    return result

def parse_verdict(text):
    """Extract the verdict text between single quotes"""
    m = re.search(r"'([^']*(?:''[^']*)*)'", text.strip(), re.DOTALL)
    if m:
        return m.group(1).replace("''", "'")
    return ""

def parse_specs(text):
    """Parse jsonb specs from SQL"""
    # Remove leading/trailing whitespace and find JSON object
    t = text.strip()
    # Find first { and matching }
    start = t.find('{')
    if start == -1:
        return {}
    
    depth = 0
    end = start
    for i in range(start, len(t)):
        if t[i] == '{':
            depth += 1
        elif t[i] == '}':
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    
    json_str = t[start:end]
    # Fix JSON: replace '' with '
    json_str = json_str.replace("''", "'")
    # Ensure keys and string values are properly quoted
    # The SQL format uses double quotes for JSON which should be valid
    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"    ⚠️ JSON parse error: {e}")
        return {}

def slugify(name):
    """Create a URL-safe slug from product name"""
    s = name.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = s.strip('-')
    return s

# Products data structured from the SQL files
# Format: (category_slug, rank, name, brand, model_ref, price_eur, score, amazon_asin, amazon_url, pros_ARRAY, cons_ARRAY, verdict, specs_jsonb, badge, available_france, created_at, updated_at)

# I'll parse the raw SQL lines
with open("/root/.hermes/cache/documents/doc_0226d3704533_TROVIIO_Vague3_Hermes_PART1_2026-05-05.txt") as f:
    part1 = f.read()
with open("/root/.hermes/cache/documents/doc_6062ac759fb7_TROVIIO_Vague3_Hermes_PART2_2026-05-05.txt") as f:
    part2 = f.read()

full_text = part1 + "\n\n" + part2

# Extract product blocks: each starts with ('category',rank,'name',...
lines = full_text.split('\n')
product_blocks = []
in_section = False
current_block = None

for line in lines:
    s = line.strip()
    
    # Detect start of a product block
    if s.startswith("('ventilateur-colonne'") or s.startswith("('climatiseur-portable'") or s.startswith("('station-charge-usb-c'") or s.startswith("('onduleur-ups'"):
        if current_block:
            product_blocks.append(current_block)
        current_block = s
        continue
    
    if current_block is not None:
        # Continue adding to current block until we hit the end marker
        if s == ");" or s.startswith("ON CONFLICT"):
            if current_block:
                # The actual end is the line before
                pass
            continue
        if s.startswith("('"):
            # New product started but we have a previous one
            if current_block:
                product_blocks.append(current_block)
            current_block = s
        else:
            current_block += " " + s
    
    # Detect end of section
    if s == ");":
        if current_block:
            product_blocks.append(current_block)
            current_block = None

if current_block:
    product_blocks.append(current_block)

print(f"Product blocks: {len(product_blocks)}")

for i, block in enumerate(product_blocks[:3]):
    print(f"\nBlock {i+1}: {block[:120]}...")
