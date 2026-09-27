import {createServer} from 'node:http';
import {HttpError,fail,register,login,identity,session,requireUser,hash,createInvite} from './auth.mjs';
import {generate,budget,jobView} from './ai.mjs';
export async function body(req,max=100000){if(!(req.headers['content-type']||'').startsWith('application/json'))fail(415,'Send application/json.');let value='',bytes=0;for await(const chunk of req){bytes+=chunk.length;if(bytes>max)fail(413,'Request is too large.');value+=chunk;}try{const parsed=JSON.parse(value);if(!parsed||Array.isArray(parsed)||typeof parsed!=='object')throw Error();return parsed;}catch{fail(400,'Invalid JSON object.');}}
export function createApp(db,config={}){
 const allowed=new Set(config.origins||['https://bnb.minizap.online','https://kids-bnb.minizap.online']);const counts=new Map();
 function rate(key,limit,period=60000){const now=Date.now();if(counts.size>10000){for(const [k,v] of counts)if(v.until<=now)counts.delete(k);if(counts.size>10000)fail(503,'Please try again later.');}let entry=counts.get(key);if(!entry||entry.until<=now){entry={n:0,until:now+period};counts.set(key,entry);}if(++entry.n>limit)fail(429,'Too many requests. Please try again later.');}
 const cookie=value=>`bnb_session=${value}; Path=/; HttpOnly; SameSite=Strict; ${config.secure===false?'':'Secure; '}Max-Age=${value?604800:0}`;
 const server=createServer(async(req,res)=>{
 const send=(status,data)=>{if(res.writableEnded)return;res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
 try{
 if(Number(req.headers['content-length']||0)>1600000)fail(413,'Request is too large.');
 const origin=req.headers.origin;if(origin&&!allowed.has(origin))fail(403,'Origin is not allowed.');if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Access-Control-Allow-Credentials','true');res.setHeader('Vary','Origin');}
 if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Methods','GET, POST, DELETE, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, X-BNB-Client');res.writeHead(204);res.end();return;}
 const path=new URL(req.url,'http://local').pathname,ip=config.trustProxy?String(req.headers['x-bnb-client-ip']||req.socket.remoteAddress):req.socket.remoteAddress;
 rate(ip,180);
 if(req.method==='GET'&&path==='/health'){send(200,{service:'blood-and-balance',status:'ok',version:config.version||'development',gitHash:config.gitHash||'nogit'});return;}
 const kids=origin==='https://kids-bnb.minizap.online';
 if(req.method!=='GET'&&(!origin||req.headers['x-bnb-client']!=='1'))fail(403,'A trusted origin and client header are required.');
 const user=identity(db,req);
 if(config.scoreRoute&&await config.scoreRoute({db,config,req,res,path,user,send,rate,ip}))return;
 if(kids)fail(403,'Kids edition supports highscores only.');
 if(path==='/v1/me'&&req.method==='GET'){send(200,{user});return;}
 if(['/v1/register','/v1/login'].includes(path)&&req.method==='POST'){rate(`auth:${ip}`,10,900000);const input=await body(req,5000),account=path.endsWith('register')?await register(db,input):await login(db,input);res.setHeader('Set-Cookie',cookie(session(db,account)));send(200,{user:account});return;}
 if(path==='/v1/logout'&&req.method==='POST'){const value=(req.headers.cookie||'').split(';').map(v=>v.trim()).find(v=>v.startsWith('bnb_session='))?.slice(12);if(value)db.prepare('DELETE FROM sessions WHERE hash=?').run(hash(value));res.setHeader('Set-Cookie',cookie(''));send(200,{ok:true});return;}
 if(path==='/v1/invites'&&req.method==='POST'){requireUser(user);if(user.role!=='admin')fail(403,'Owner access required.');rate(`invites:${user.id}`,10,86400000);send(201,{invite:createInvite(db)});return;}
 if(path==='/v1/ai/config'&&req.method==='GET'){requireUser(user);send(200,{enabled:!!config.key&&!db.prepare("SELECT value FROM settings WHERE key='ai_disabled'").get(),...budget(db,config,user)});return;}
 if(path==='/v1/ai/generate'&&req.method==='POST'){requireUser(user);rate(`ai:${user.id}`,3,60000);if(db.prepare("SELECT value FROM settings WHERE key='ai_disabled'").get())fail(503,'AI generation is disabled pending owner review.');send(200,await generate(db,config,user,await body(req,100000),config.fetcher));return;}
 if(path.startsWith('/v1/ai/jobs/')&&req.method==='GET'){requireUser(user);const job=db.prepare('SELECT * FROM generation WHERE id=? AND user_id=?').get(path.slice(12),user.id);if(!job)fail(404,'Draft not found.');send(200,jobView(job));return;}
 if(config.extraRoute&&await config.extraRoute({db,config,req,res,path,user,send,rate,ip}))return;
 fail(404,'Endpoint not found.');
 }catch(error){send(error instanceof HttpError?error.status:500,{error:error instanceof HttpError?error.message:'The request could not be completed.'});}
 });server.requestTimeout=80000;server.headersTimeout=10000;server.keepAliveTimeout=5000;return server;
}
