#!/usr/bin/env python3
import subprocess, json, sys

CF_TOKEN = "REDACTED_SECRETc4"
HEADERS = {"Authorization": f"Bearer {CF_TOKEN}", "Content-Type": "application/json"}
BASE = "https://api.cloudflare.com/client/v4"
TUNNEL_ID = "001fc37c-3de5-497a-9922-0ae4771af06b"

def api(method, path, data=None):
    cmd = ["curl", "-s", "-X", method, f"{BASE}{path}"]
    for k, v in HEADERS.items():
        cmd += ["-H", f"{k}: {v}"]
    if data:
        cmd += ["-d", json.dumps(data)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    return json.loads(r.stdout)

# 1. Get account ID
print("=== ACCOUNTS ===")
r = api("GET", "/accounts")
if r["success"] and r["result"]:
    account_id = r["result"][0]["id"]
    account_name = r["result"][0]["name"]
    print(f"Account: {account_id} - {account_name}")
else:
    print(f"ERROR: {json.dumps(r['errors'], indent=2)}")
    sys.exit(1)

# 2. Get zone ID for troviio.com
print("\n=== ZONE troviio.com ===")
r = api("GET", "/zones?name=troviio.com")
if r["success"] and r["result"]:
    zone = r["result"][0]
    zone_id = zone["id"]
    print(f"Zone ID: {zone_id}")
    print(f"Name: {zone['name']}")
    print(f"Status: {zone['status']}")
    print(f"Name servers: {zone['name_servers']}")
else:
    print("Zone not found")
    print(f"Response: {json.dumps(r, indent=2)}")
    sys.exit(1)

# 3. Check existing tunnel
print(f"\n=== TUNNEL {TUNNEL_ID} ===")
r = api("GET", f"/accounts/{account_id}/cfd_tunnel/{TUNNEL_ID}")
if r["success"]:
    t = r["result"]
    print(f"Name: {t.get('name','unnamed')}")
    print(f"Status: {t.get('status','unknown')}")
    print(f"Created: {t.get('created_at','unknown')}")
else:
    print(f"Tunnel not found or error: {json.dumps(r, indent=2)[:200]}")

# 4. List tunnel's public hostnames (via config)
print("\n=== EXISTING PUBLIC HOSTNAMES ===")
r = api("GET", f"/accounts/{account_id}/cfd_tunnel/{TUNNEL_ID}/configurations")
if r["success"]:
    config = r["result"]
    print(f"Config: {json.dumps(config, indent=2)[:1000]}")
else:
    print(f"Can't read config: {json.dumps(r, indent=2)[:200]}")

# 5. Set new config with troviio.com + picksy.babcoq.tech
print("\n=== SETTING NEW CONFIG ===")
new_config = {
    "config": {
        "ingress": [
            {
                "hostname": "troviio.com",
                "service": "http://localhost:3000",
                "originRequest": {}
            },
            {
                "hostname": "www.troviio.com",
                "service": "http://localhost:3000",
                "originRequest": {}
            },
            {
                "hostname": "picksy.babcoq.tech",
                "service": "http://localhost:3000",
                "originRequest": {}
            },
            {
                "hostname": "troviio.com",
                "path": "/api/*",
                "service": "http://localhost:8000",
                "originRequest": {}
            },
            {
                "hostname": "www.troviio.com",
                "path": "/api/*",
                "service": "http://localhost:8000",
                "originRequest": {}
            },
            {
                "hostname": "picksy.babcoq.tech",
                "path": "/api/*",
                "service": "http://localhost:8000",
                "originRequest": {}
            },
            {
                "service": "http_status:404"
            }
        ]
    }
}

r = api("PUT", f"/accounts/{account_id}/cfd_tunnel/{TUNNEL_ID}/configurations", new_config)
if r["success"]:
    print("✅ Config updated successfully!")
    print(json.dumps(r["result"], indent=2)[:500])
else:
    print(f"❌ ERROR: {json.dumps(r, indent=2)[:500]}")
    errors = r.get("errors", [])
    for e in errors:
        print(f"  - {e.get('message','?')} ({e.get('code','?')})")
