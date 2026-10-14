import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const required=['OS.html','app.js','styles.css','movies.html','games.html','apps.html','index.html','settings.html','browser.html','chat.html','more.html','library-data.js'];for(const p of required)assert.ok(fs.existsSync(new URL('../'+p,import.meta.url)),`Missing required file: ${p}`);
const os=read('OS.html'),app=read('app.js'),css=read('styles.css'),catalog=read('library-data.js');
assert.match(os,/library-data\.js/);assert.doesNotMatch([os,app,css,read('movies.html'),catalog].join('\n'),/api\.themoviedb\.org|TMDB|tmdb-config\.js/i);
assert.match(os,/@media\s*\(max-width:\s*640px\)/);assert.match(os,/prefers-reduced-motion:\s*reduce/);assert.match(css,/@media\s*\(max-width:\s*760px\)/);assert.match(css,/backdrop-filter:\s*blur\(/);
assert.match(app,/renderSharedCatalogPage\(\)/);assert.match(app,/function setupDetailsModal\(\)/);
for(const p of ['movies.html','games.html','apps.html','settings.html']){const h=read(p);assert.match(h,/name="viewport"/);assert.ok(h.indexOf('library-data.js')<h.indexOf('app.js'),`${p}: wrong catalog load order`);}
for(const p of ['OS.html','app.js','library-data.js']){const s=read(p);for(const m of s.matchAll(/<script\b(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi))if(m[1].trim())new vm.Script(m[1],{filename:p+':inline-script'});}
new vm.Script(app,{filename:'app.js'});new vm.Script(catalog,{filename:'library-data.js'});
const sandbox={window:{}};vm.runInNewContext(catalog,sandbox);const lib=sandbox.window.McCrackLibrary;assert.ok(lib&&lib.games.length&&lib.movies.length&&lib.apps.length);
const movies=lib.movies.filter(m=>m.title&&!/^movie\s+\d+$/i.test(m.title));assert.ok(movies.length>=100);assert.ok(movies.every(m=>m.description&&m.description.length>35));
for(const id of ['theme-grid','font-select','language-select','profile-modal'])assert.ok(os.includes(id),`Missing settings hook: ${id}`);assert.match(os,/set-theme/);assert.match(read('settings.html'),/resetAllSettings/);
console.log(`McCrack checks passed: ${lib.games.length} games, ${movies.length} named movies, ${lib.apps.length} apps; responsive CSS, syntax, shared libraries, and settings hooks verified.`);
