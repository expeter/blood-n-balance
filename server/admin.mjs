import {dirname,join,basename} from 'node:path';
import {backup} from 'node:sqlite';
import {openStore} from './store.mjs';import {createInvite} from './auth.mjs';import {writeFileSync,existsSync,chmodSync,readdirSync,unlinkSync} from 'node:fs';
const db=openStore(process.env.BNB_DB||'var/bnb.sqlite');const command=process.argv[2];
if(command==='invite'){const path=process.argv[3]||'var/invite.txt',role=process.argv[4]==='admin'?'admin':'member';const invite=createInvite(db,role);writeFileSync(path,invite+'\n',{mode:0o600,flag:'wx'});console.log(`Invitation saved to ${path}; valid 7 days, one use.`);}
else if(command==='backup'){const path=process.argv[3];if(!path||existsSync(path))throw Error('Choose a new backup path.');await backup(db,path);chmodSync(path,0o600);if(/^bnb-\d{8}T\d{6}Z\.sqlite$/.test(basename(path))){const files=readdirSync(dirname(path)).filter(name=>/^bnb-\d{8}T\d{6}Z\.sqlite$/.test(name)).sort().reverse();for(const name of files.slice(14))unlinkSync(join(dirname(path),name));}console.log('Database backup completed.');}
else if(command==='disable-user'){db.prepare('UPDATE users SET disabled=1 WHERE name=?').run(process.argv[3]);console.log('Account disabled.');}
else if(command==='enable-ai'){db.prepare("DELETE FROM settings WHERE key='ai_disabled'").run();console.log('AI circuit breaker reset.');}
else throw Error('Commands: invite [output-file] [admin|member], backup PATH, disable-user NAME, enable-ai');db.close();
