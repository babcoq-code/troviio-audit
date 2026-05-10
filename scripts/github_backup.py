#!/usr/bin/env python3
"""Script de sauvegarde automatique Troviio -> GitHub audit"""
import os, subprocess, sys, tempfile, shutil
from datetime import datetime

REPO_DIR = "/root/troviio-ciceron"
REMOTE_NAME = "audit"
REMOTE_URL = "https://github.com/babcoq-code/troviio-audit.git"
BRANCH = "main"

# Fichiers/dossiers à GARDER à la racine (tout le reste va dans old/)
KEEP_AT_ROOT = [
    "backend/", "frontend/", "supabase/", "docker-compose.yml",
    "nginx/", "Dockerfile", "README.md",
]

# Scripts à garder dans scripts/
KEEP_SCRIPTS = [
    "scripts/post-deploy.sh", "scripts/import_datasets.py",
    "scripts/cf-setup.py", "scripts/configure-tunnel.py",
    "scripts/scraper_v2.py",
]

def is_text_file(path):
    """Check if file is text/binary"""
    try:
        with open(path, 'r', errors='strict') as f:
            f.read(1024)
        return True
    except:
        return False

def has_secrets(content):
    """Check for secret patterns"""
    patterns = [
        'SUPABASE_SERVICE_KEY=', 'DEEPSEEK_API_KEY=',
        'OPENAI_API_KEY=', 'AMAZON_PAAPI_',
    ]
    for p in patterns:
        if p in content:
            return True
    return False

def scrub_text(content):
    """Replace secrets with placeholders"""
    import re
    content = re.sub(r'SUPABASE_SERVICE_KEY=[^\n]+', 'SUPABASE_SERVICE_KEY=REMOVED', content)
    content = re.sub(r'DEEPSEEK_API_KEY=[^\n]+', 'DEEPSEEK_API_KEY=REMOVED', content)
    content = re.sub(r'OPENAI_API_KEY=[^\n]+', 'OPENAI_API_KEY=REMOVED', content)
    content = re.sub(r'AMAZON_PAAPI_[A-Za-z0-9]+', 'PAAPI_REMOVED', content)
    return content

def build_clean_snapshot():
    """Build a clean snapshot of troviio.com sources"""
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Créer un temp dir pour le snapshot
    snapshot = tempfile.mkdtemp(prefix="troviio_snapshot_")
    
    os.chdir(REPO_DIR)
    
    # Copier les fichiers (en évitant node_modules, .git, __pycache__)
    exclude_dirs = {'node_modules', '__pycache__', '.git', '.next', 'out', '.venv'}
    
    for item in KEEP_AT_ROOT:
        src = os.path.join(REPO_DIR, item)
        dst = os.path.join(snapshot, item)
        if os.path.isdir(src):
            shutil.copytree(src, dst, ignore=shutil.ignore_patterns(*exclude_dirs), dirs_exist_ok=True)
        elif os.path.isfile(src):
            shutil.copy2(src, dst)
    
    # Copier les scripts sélectionnés
    for script in KEEP_SCRIPTS:
        src = os.path.join(REPO_DIR, script)
        dst = os.path.join(snapshot, script)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        if os.path.isfile(src):
            shutil.copy2(src, dst)
    
    # Archiver le reste dans old/
    old_dir = os.path.join(snapshot, "old")
    os.makedirs(old_dir, exist_ok=True)
    
    # Lister tout ce qui est à la racine du repo original
    for item in os.listdir(REPO_DIR):
        if item.startswith('.') or item == 'old':
            continue
        item_path = os.path.join(REPO_DIR, item)
        # Si c'est pas dans KEEP_AT_ROOT, on le met dans old/
        rel_path = item + ('/' if os.path.isdir(item_path) else '')
        if rel_path not in KEEP_AT_ROOT and not rel_path.startswith('scripts/'):
            dst = os.path.join(old_dir, item)
            if os.path.isdir(item_path):
                shutil.copytree(item_path, dst, ignore=shutil.ignore_patterns(*exclude_dirs), dirs_exist_ok=True)
            elif os.path.isfile(item_path):
                shutil.copy2(item_path, dst)
    
    # Les scripts non gardés
    scripts_dir = os.path.join(REPO_DIR, "scripts")
    if os.path.isdir(scripts_dir):
        old_scripts_dir = os.path.join(old_dir, "scripts")
        for script_file in os.listdir(scripts_dir):
            script_path = os.path.join("scripts", script_file)
            if script_path not in KEEP_SCRIPTS:
                os.makedirs(old_scripts_dir, exist_ok=True)
                src = os.path.join(scripts_dir, script_file)
                if os.path.isfile(src):
                    shutil.copy2(src, old_scripts_dir)
    
    # Scrubber les secrets du snapshot
    for root, dirs, files in os.walk(snapshot):
        for f in files:
            fpath = os.path.join(root, f)
            if is_text_file(fpath):
                try:
                    with open(fpath, 'r') as fh:
                        content = fh.read()
                    if has_secrets(content):
                        content = scrub_text(content)
                        with open(fpath, 'w') as fh:
                            fh.write(content)
                except:
                    pass
    
    return snapshot, now

def push_to_github(snapshot_dir, timestamp):
    """Init git in snapshot dir and push to GitHub"""
    os.chdir(snapshot_dir)
    
    # Init git
    subprocess.run(["git", "init", "-b", "main"], capture_output=True)
    
    # Config
    subprocess.run(["git", "config", "user.name", "Troviio Bot"], capture_output=True)
    subprocess.run(["git", "config", "user.email", "bot@troviio.com"], capture_output=True)
    
    # .gitignore
    with open(os.path.join(snapshot_dir, ".gitignore"), 'w') as f:
        f.write("node_modules/\n.next/\nout/\n__pycache__/\n*.pyc\n.venv/\n.env\n.env.*\n")
    
    # Add all
    subprocess.run(["git", "add", "-A"], capture_output=True)
    
    # Commit
    msg = f"Troviio.com snapshot - {timestamp}"
    result = subprocess.run(["git", "commit", "-m", msg], capture_output=True, text=True)
    print(result.stdout)
    if result.returncode != 0:
        print("Rien a commiter, snapshot a jour")
        return True
    
    # Push force (on remplace tout)
    remote_url = "https://github.com/babcoq-code/troviio-audit.git"
    subprocess.run(["git", "remote", "add", "origin", remote_url], capture_output=True)
    result = subprocess.run(["git", "push", "--force", "origin", "main"], capture_output=True, text=True)
    print(result.stdout)
    if result.returncode != 0:
        print(f"ERREUR push: {result.stderr}")
        return False
    
    print(f"✅ Push OK: {msg}")
    return True

if __name__ == "__main__":
    print(f"=== Sauvegarde Troviio -> GitHub ===")
    snapshot, timestamp = build_clean_snapshot()
    print(f"Snapshot: {snapshot}")
    ok = push_to_github(snapshot, timestamp)
    
    # Nettoyage
    shutil.rmtree(snapshot, ignore_errors=True)
    
    if ok:
        print("✅ Sauvegarde complete")
    else:
        print("❌ Echec sauvegarde")
        sys.exit(1)
