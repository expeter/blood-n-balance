import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';import {dirname} from 'node:path';
export function openStore(path=':memory:'){
 if(path!==':memory:')mkdirSync(dirname(path),{recursive:true,mode:0o700});
 const db=new DatabaseSync(path);db.exec(`PRAGMA journal_mode=WAL;PRAGMA foreign_keys=ON;PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,name TEXT UNIQUE COLLATE NOCASE NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'member',created INTEGER NOT NULL,disabled INTEGER NOT NULL DEFAULT 0);
 CREATE TABLE IF NOT EXISTS invites(hash TEXT PRIMARY KEY,role TEXT NOT NULL,expires INTEGER NOT NULL,used_by TEXT REFERENCES users(id));
 CREATE TABLE IF NOT EXISTS sessions(hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),expires INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS generation(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),request_key TEXT NOT NULL,day TEXT NOT NULL,model TEXT NOT NULL,status TEXT NOT NULL,reserved INTEGER NOT NULL,spent INTEGER NOT NULL DEFAULT 0,tokens INTEGER NOT NULL DEFAULT 0,result TEXT,error TEXT,created INTEGER NOT NULL,UNIQUE(user_id,request_key));
 CREATE TABLE IF NOT EXISTS levels(id TEXT PRIMARY KEY,author_id TEXT REFERENCES users(id),parent_id TEXT REFERENCES levels(id),name TEXT NOT NULL,description TEXT NOT NULL,tags TEXT NOT NULL,difficulty TEXT NOT NULL,content TEXT NOT NULL,content_hash TEXT NOT NULL,analysis TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'published',created INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS level_sets(id TEXT PRIMARY KEY,author_id TEXT REFERENCES users(id),parent_id TEXT REFERENCES level_sets(id),name TEXT NOT NULL,description TEXT NOT NULL,level_ids TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'published',created INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS votes(user_id TEXT NOT NULL REFERENCES users(id),kind TEXT NOT NULL,item_id TEXT NOT NULL,value INTEGER NOT NULL CHECK(value IN(-1,1)),PRIMARY KEY(user_id,kind,item_id));
 CREATE TABLE IF NOT EXISTS bookmarks(user_id TEXT NOT NULL REFERENCES users(id),kind TEXT NOT NULL,item_id TEXT NOT NULL,PRIMARY KEY(user_id,kind,item_id));
 CREATE TABLE IF NOT EXISTS reports(id TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),kind TEXT NOT NULL,item_id TEXT NOT NULL,reason TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'open',created INTEGER NOT NULL,UNIQUE(user_id,kind,item_id));
 CREATE TABLE IF NOT EXISTS plays(id TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),level_id TEXT NOT NULL REFERENCES levels(id),created INTEGER NOT NULL,finished INTEGER,outcome TEXT);
 CREATE INDEX IF NOT EXISTS levels_created ON levels(status,created);
 CREATE INDEX IF NOT EXISTS plays_level ON plays(level_id);
 CREATE TABLE IF NOT EXISTS competitions(id TEXT PRIMARY KEY,author_id TEXT REFERENCES users(id),set_id TEXT NOT NULL,name TEXT NOT NULL,snapshot TEXT NOT NULL,rules TEXT NOT NULL,opens INTEGER NOT NULL,closes INTEGER NOT NULL,duration INTEGER NOT NULL,created INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS attempts(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),competition_id TEXT NOT NULL REFERENCES competitions(id),started INTEGER NOT NULL,deadline INTEGER NOT NULL,progress INTEGER NOT NULL DEFAULT 0,checking INTEGER NOT NULL DEFAULT 0,status TEXT NOT NULL DEFAULT 'active',finished INTEGER,total_ms INTEGER);
 CREATE TABLE IF NOT EXISTS attempt_runs(attempt_id TEXT NOT NULL REFERENCES attempts(id),position INTEGER NOT NULL,level_hash TEXT NOT NULL,replay TEXT NOT NULL,ticks INTEGER NOT NULL,submitted INTEGER NOT NULL,PRIMARY KEY(attempt_id,position));
 CREATE TABLE IF NOT EXISTS score_guests(id TEXT PRIMARY KEY,token_hash TEXT UNIQUE NOT NULL,label TEXT NOT NULL,expires INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS scores(id TEXT PRIMARY KEY,player_id TEXT NOT NULL,label TEXT NOT NULL,edition TEXT NOT NULL,stage INTEGER NOT NULL,revision INTEGER NOT NULL,ruleset TEXT NOT NULL,difficulty TEXT NOT NULL,assistance TEXT NOT NULL,ticks INTEGER NOT NULL,replays TEXT NOT NULL,created INTEGER NOT NULL,UNIQUE(player_id,edition,stage,revision,ruleset,difficulty,assistance));
 CREATE TABLE IF NOT EXISTS lobbies(id TEXT PRIMARY KEY,host_id TEXT NOT NULL REFERENCES users(id),event_id TEXT NOT NULL REFERENCES competitions(id),name TEXT NOT NULL,state TEXT NOT NULL DEFAULT 'waiting',countdown INTEGER,created INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS lobby_members(lobby_id TEXT NOT NULL REFERENCES lobbies(id),user_id TEXT NOT NULL REFERENCES users(id),ready INTEGER NOT NULL DEFAULT 0,joined INTEGER NOT NULL,last_seen INTEGER NOT NULL,attempt_id TEXT REFERENCES attempts(id),forfeit INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(lobby_id,user_id));
 CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT NOT NULL);
 `);return db;
}
export function transaction(db,fn){db.exec('BEGIN IMMEDIATE');try{const result=fn();db.exec('COMMIT');return result;}catch(error){db.exec('ROLLBACK');throw error;}}
export const uid=()=>crypto.randomUUID();
