import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';

const css=readFileSync(new URL('../src/style.css',import.meta.url),'utf8');
const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');

test('visible HTML and canvas typography declarations enforce a 12px minimum',()=>{
 const declarations=[...css.matchAll(/font-size:([^;{}]+)/g)].map(match=>match[1]);
 for(const value of declarations){for(const px of value.matchAll(/(?<![\w.])(\d+(?:\.\d+)?)px/g)){if(Number(px[1])>0&&Number(px[1])<12)assert.match(value,/^max\(12px,/,`font-size:${value}`);}}
 const sourceDir=new URL('../src/',import.meta.url),modules=readdirSync(sourceDir).filter(file=>file.endsWith('.js'));
 for(const file of modules){const source=readFileSync(new URL(file,sourceDir),'utf8');for(const font of source.matchAll(/font\s*=\s*['"](?:bold\s+)?(\d+(?:\.\d+)?)px/g))assert.ok(Number(font[1])>=12,`${file} draws ${font[1]}px canvas text`);}
});

test('the app keeps campaign, achievements, personal bests, and options separately reachable',()=>{
 for(const selector of ['data-nav="play"','data-nav="records"','data-nav="bests"','data-action="options"','id="records-view"','id="bests-view"','data-theme-choice="dark"','data-theme-choice="light"'])assert.ok(main.includes(selector),`missing ${selector}`);
 assert.match(css,/\.campaign-heading h1\{font-size:(?:max\(12px,)?30px/);
});

test('desktop editor docks tools/settings beside a larger canvas and stacks for narrow screens',()=>{
 const rule=[...css.matchAll(/\.editor-panel\{([^}]*)\}/g)].map(match=>match[1]).find(body=>body.includes('grid-template-areas:"heading heading" "tools canvas"'));
 assert.ok(rule,'desktop editor grid rule should exist');
 assert.match(rule,/grid-template-columns:minmax\(280px,\.8fr\) minmax\(0,1\.35fr\)/);
 assert.match(rule,/grid-template-areas:"heading heading" "tools canvas" "inspector canvas" "footer footer"/);
 assert.match(css,/\.editor-inspector[^}]*scrollbar-width:none/);
 assert.match(css,/@media\(max-width:900px\)\{\.editor-panel[^}]*grid-template-areas:"heading" "tools" "inspector" "canvas" "footer"/);
});

test('the item shop uses responsive cards and retains prices, counts, and purchase controls',()=>{
 assert.match(css,/\.shop-list\{display:grid;grid-template-columns:repeat\(auto-fit,minmax\(260px,1fr\)\)/);
 assert.match(main,/data-buy="\$\{i\.id\}"/);
 assert.match(main,/\$\{state\.inventory\[i\.id\]\} in your loadout/);
 assert.match(main,/◆ \$\{i\.price\}/);
});
