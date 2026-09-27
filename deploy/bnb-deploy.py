#!/usr/bin/python3
"""Restricted SSH deployment command. Runs as bnb-deploy, never as root."""
import fcntl,io,json,os,pathlib,re,subprocess,sys,tarfile,time,urllib.request
root=pathlib.Path('/srv/blood-and-balance')
command=os.environ.get('SSH_ORIGINAL_COMMAND','')
match=re.fullmatch(r'deploy ([a-f0-9]{40})',command)
if not match: sys.exit('Only a versioned BNB deployment is allowed.')
sha=match.group(1)
with open(root/'api'/'deploy.lock','w') as lock:
 fcntl.flock(lock,fcntl.LOCK_EX)
 data=sys.stdin.buffer.read(20_000_001)
 if len(data)>20_000_000: sys.exit('Artifact too large.')
 with tarfile.open(fileobj=io.BytesIO(data),mode='r:gz') as archive:
  members=archive.getmembers()
  if len(members)>1000 or sum(m.size for m in members)>40_000_000: sys.exit('Artifact too large.')
  for m in members:
   path=pathlib.PurePosixPath(m.name)
   if path.is_absolute() or '..' in path.parts or not path.parts or path.parts[0] not in ('src','server','dist-kids','package.json','LICENSE') or not (m.isfile() or m.isdir()): sys.exit('Invalid artifact entry.')
  api=root/'api'/'releases'/sha;kids=root/'kids'/'releases'/sha
  if api.exists() or kids.exists(): sys.exit('Revision already deployed; use a new commit.')
  api.mkdir(parents=True);kids.mkdir(parents=True)
  for m in members:
   path=pathlib.PurePosixPath(m.name)
   target=kids.joinpath(*path.parts[1:]) if path.parts[0]=='dist-kids' else api.joinpath(*path.parts)
   if m.isdir(): target.mkdir(parents=True,exist_ok=True)
   else:
    target.parent.mkdir(parents=True,exist_ok=True)
    with archive.extractfile(m) as source: target.write_bytes(source.read())
    target.chmod(0o644)
  manifest=json.loads((kids/'version.json').read_text());package=json.loads((api/'package.json').read_text())
  if manifest.get('gitHash')!=sha[:12] or manifest.get('version')!=package.get('version') or manifest.get('edition')!='kids': sys.exit('Artifact identity mismatch.')
  previous={}
  for kind,target in [('api',api),('kids',kids)]:
   current=root/kind/'current';previous[kind]=os.readlink(current) if current.is_symlink() else None
   temp=root/kind/'next';temp.unlink(missing_ok=True);temp.symlink_to(target);temp.replace(current)
  subprocess.run(['sudo','/bin/systemctl','restart','bnb-api.service'],check=True)
  healthy=False
  for attempt in range(20):
   try:
    with urllib.request.urlopen('http://127.0.0.1:3002/health',timeout=2) as response:
     health=json.load(response);healthy=health.get('version')==package['version'] and health.get('gitHash')==sha[:12]
    if healthy: break
   except Exception: pass
   time.sleep(1)
  if not healthy:
   for kind,target in previous.items():
    if target:
     temp=root/kind/'next';temp.unlink(missing_ok=True);temp.symlink_to(target);temp.replace(root/kind/'current')
   subprocess.run(['sudo','/bin/systemctl','restart','bnb-api.service'],check=True)
   sys.exit('Health check failed; restored previous release links.')
  print('Published API and kids edition',package['version'],sha[:12])
