#!/usr/bin/env python3
"""Debug: test what Amazon FR returns for an ASIN page."""

import subprocess, re

asin = "B09P8B4CVP"  # Dreo Cruiser Pro T1
url = f"https://www.amazon.fr/dp/{asin}"

cmd = [
    'curl', '-s', '-L', url,
    '-H', 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    '-H', 'Accept-Language: fr-FR,fr;q=0.9',
    '--compressed',
    '--max-time', '30'
]
result = subprocess.run(cmd, capture_output=True, timeout=35)
raw = result.stdout
try:
    html = raw.decode('utf-8')
except:
    html = raw.decode('utf-8', errors='replace')

print(f"Length: {len(html)}")
print(f"First 2000 chars:")
print(html[:2000])
print(f"\n\nLast 500 chars:")
print(html[-500:])

# Check for image URLs
img_urls = re.findall(r'https?://m\.media-amazon\.com/images/I/[^\s"\'<>]+', html)
print(f"\n\nImages found ({len(img_urls)}):")
for u in img_urls:
    print(f"  {u[:120]}")
