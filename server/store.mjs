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
 CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT NOT NULL);
 `);return db;
}
export function transaction(db,fn){db.exec('BEGIN IMMEDIATE');try{const result=fn();db.exec('COMMIT');return result;}catch(error){db.exec('ROLLBACK');throw error;}}
export const uid=()=>crypto.randomUUID();
