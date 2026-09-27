import {openStore} from './store.mjs';import {createInvite} from './auth.mjs';import {writeFileSync} from 'node:fs';
const db=openStore(process.env.BNB_DB||'var/bnb.sqlite');const command=process.argv[2];
if(command==='invite'){const path=process.argv[3]||'var/invite.txt',role=process.argv[4]==='admin'?'admin':'member';const invite=createInvite(db,role);writeFileSync(path,invite+'\n',{mode:0o600,flag:'wx'});console.log(`Invitation saved to ${path}; valid 7 days, one use.`);}
else if(command==='disable-user'){db.prepare('UPDATE users SET disabled=1 WHERE name=?').run(process.argv[3]);console.log('Account disabled.');}
else if(command==='enable-ai'){db.prepare("DELETE FROM settings WHERE key='ai_disabled'").run();console.log('AI circuit breaker reset.');}
else throw Error('Commands: invite [output-file] [admin|member], disable-user NAME, enable-ai');db.close();
