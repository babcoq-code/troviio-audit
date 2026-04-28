#!/usr/bin/env python3
"""
Configure cloudflared tunnel with troviio.com hostnames.
Uses the tunnel token for authentication and creates ingress rules.
"""
import json, os, subprocess, sys

TUNNEL_ID = "001fc37c-3de5-497a-9922-0ae4771af06b"
TOKEN = "CF_TUNNEL_TOKEN_REMOVED"

# Create credentials file (needed by cloudflared)
CRED_FILE = "/opt/picksy/cloudflared/credentials.json"
credentials = {
    "AccountTag": "",
    "TunnelID": TUNNEL_ID,
    "TunnelName": "picksy-tunnel",
    "TunnelSecret": ""
}

# The tunnel token is a base64-encoded JSON blob
# Format: CF_TUNNEL_TOKEN_REMOVED + base64(json({account_tag, tunnel_secret, tunnel_id, tunnel_name}))
import base64
token_data = TOKEN[len("CF_TUNNEL_TOKEN_REMOVED"):]  # Remove prefix
# Add padding
padding = 4 - len(token_data) % 4
if padding != 4:
    token_data += "=" * padding

try:
    decoded = base64.urlsafe_b64decode(token_data)
    # Try to parse as JSON
    token_json = json.loads(decoded)
    print(f"✅ Tunnel token decoded successfully")
    print(f"   AccountTag: {token_json.get('AccountTag', 'N/A')[:10]}...")
    print(f"   TunnelID: {token_json.get('TunnelID', 'N/A')}")
    print(f"   TunnelName: {token_json.get('TunnelName', 'N/A')}")
    
    # Write credentials file
    with open(CRED_FILE, "w") as f:
        json.dump(token_json, f, indent=2)
    os.chmod(CRED_FILE, 0o600)
    print(f"\n✅ Credentials written to {CRED_FILE}")
    
    # Now create the config file with ingress rules
    config = {
        "tunnel": TUNNEL_ID,
        "credentials-file": CRED_FILE,
        "ingress": [
            # troviio.com frontend (default)
            {
                "hostname": "troviio.com",
                "service": "http://localhost:3000"
            },
            # troviio.com API
            {
                "hostname": "troviio.com",
                "path": "/api/*",
                "service": "http://localhost:8000"
            },
            # www.troviio.com frontend
            {
                "hostname": "www.troviio.com",
                "service": "http://localhost:3000"
            },
            # www.troviio.com API
            {
                "hostname": "www.troviio.com",
                "path": "/api/*",
                "service": "http://localhost:8000"
            },
            # Existing picksy.babcoq.tech frontend
            {
                "hostname": "picksy.babcoq.tech",
                "service": "http://localhost:3000"
            },
            # picksy.babcoq.tech API
            {
                "hostname": "picksy.babcoq.tech",
                "path": "/api/*",
                "service": "http://localhost:8000"
            },
            # Fallback - 404 for anything else
            {
                "service": "http_status:404"
            }
        ]
    }
    
    config_path = "/opt/picksy/cloudflared/config.yml"
    # Write as YAML manually (avoid pyyaml dependency)
    yaml_lines = [
        f"tunnel: {config['tunnel']}",
        f"credentials-file: {config['credentials-file']}",
        "",
        "ingress:"
    ]
    for rule in config['ingress']:
        if 'hostname' in rule:
            yaml_lines.append(f"  - hostname: {rule['hostname']}")
        if 'path' in rule:
            yaml_lines.append(f"    path: {rule['path']}")
        yaml_lines.append(f"    service: {rule['service']}")
    if not config['ingress']:
        yaml_lines.append("  - service: http_status:404")
    
    with open(config_path, "w") as f:
        f.write("\n".join(yaml_lines) + "\n")
    print(f"✅ Config written to {config_path}")
    print()
    print("=== CONFIG ===")
    print("\n".join(yaml_lines))
    
except Exception as e:
    print(f"❌ Failed to decode tunnel token: {e}")
    print(f"   Raw decoded bytes (first 50): {decoded[:50] if 'decoded' in dir() else 'N/A'}")
    sys.exit(1)
