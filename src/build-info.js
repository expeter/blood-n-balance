// Vite replaces these identifiers during builds. Guarded fallbacks also keep
// the source entry point from crashing if served without Vite's transforms.
export const APP_VERSION = typeof __APP_VERSION__ === 'undefined' ? '3.0.0' : __APP_VERSION__;
export const GIT_HASH = typeof __GIT_HASH__ === 'undefined' ? 'nogit' : __GIT_HASH__;
export const UPDATE_MANIFEST_URL = typeof __UPDATE_MANIFEST_URL__ === 'undefined' ? '/version.json' : __UPDATE_MANIFEST_URL__;
