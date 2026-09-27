import {randomBytes,createHash,scrypt as derive,timingSafeEqual} from 'node:crypto';import {promisify} from 'node:util';import {transaction,uid} from './store.mjs';
const scrypt=promisify(derive);export const token=()=>randomBytes(32).toString('base64url');export const hash=value=>createHash('sha256').update(value).digest('hex');
export class HttpError extends Error{constructor(status,message){super(message);this.status=status;}}
export const fail=(status,message)=>{throw new HttpError(status,message);};
export async function passwordHash(password,salt=token()){const key=await scrypt(password,salt,64);return `${salt}:${key.toString('hex')}`;}
export async function matches(password,stored){const salt=stored.split(':')[0],candidate=await passwordHash(password,salt);return candidate.length===stored.length&&timingSafeEqual(Buffer.from(candidate),Buffer.from(stored));}
export function createInvite(db,role='member',days=7){const value=token();db.prepare('INSERT INTO invites(hash,role,expires) VALUES(?,?,?)').run(hash(value),role,Date.now()+days*86400000);return value;}
export async function register(db,{name,password,invite}){
 if(typeof name!=='string'||!/^[a-zA-Z0-9][a-zA-Z0-9 _-]{2,23}$/.test(name)||typeof password!=='string'||password.length<12||password.length>128||typeof invite!=='string'||invite.length>100)fail(400,'Use a 3–24 character account name, a 12–128 character password, and an invitation.');
 const inviteHash=hash(invite);if(!db.prepare('SELECT hash FROM invites WHERE hash=? AND used_by IS NULL AND expires>?').get(inviteHash,Date.now()))fail(403,'Invitation is invalid or expired.');
 const passwordValue=await passwordHash(password);return transaction(db,()=>{
 const row=db.prepare('SELECT * FROM invites WHERE hash=? AND used_by IS NULL AND expires>?').get(inviteHash,Date.now());if(!row)fail(403,'Invitation is invalid or expired.');if(db.prepare('SELECT id FROM users WHERE name=?').get(name))fail(409,'Account name is already in use.');
 const id=uid();db.prepare('INSERT INTO users(id,name,password,role,created) VALUES(?,?,?,?,?)').run(id,name,passwordValue,row.role,Date.now());db.prepare('UPDATE invites SET used_by=? WHERE hash=?').run(id,inviteHash);return {id,name,role:row.role};});
}
export async function login(db,{name,password}){if(typeof name!=='string'||name.length>24||typeof password!=='string'||password.length>128)fail(401,'Account name or password is incorrect.');const row=db.prepare('SELECT * FROM users WHERE name=? AND disabled=0').get(name);if(!row){await passwordHash(password,'invalid-account-timing');fail(401,'Account name or password is incorrect.');}if(!await matches(password,row.password))fail(401,'Account name or password is incorrect.');return {id:row.id,name:row.name,role:row.role};}
export function session(db,user){const value=token();db.prepare('DELETE FROM sessions WHERE expires<?').run(Date.now());db.prepare('INSERT INTO sessions(hash,user_id,expires) VALUES(?,?,?)').run(hash(value),user.id,Date.now()+7*86400000);return value;}
export function identity(db,req){const cookie=(req.headers.cookie||'').split(';').map(v=>v.trim()).find(v=>v.startsWith('bnb_session='))?.slice(12);if(!cookie||cookie.length>100)return null;return db.prepare('SELECT u.id,u.name,u.role FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.hash=? AND s.expires>? AND u.disabled=0').get(hash(cookie),Date.now())||null;}
export function requireUser(user){if(!user)fail(401,'Sign in with an invited account first.');return user;}
