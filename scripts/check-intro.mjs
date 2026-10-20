// Structural checks for Jeff's full-bleed two-row cinematic introduction.
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
const html=readFileSync('index.html','utf8');
const js=readFileSync('intro/intro.js','utf8');
const css=readFileSync('intro/intro.css','utf8');
const version='20261020-continuous-v3';
assert.ok(html.includes('intro/intro.css?v='+version),'New CSS cache token missing');
assert.ok(html.includes('intro/intro.js?v='+version),'New JS cache token missing');
const images=[...js.matchAll(/'([\w-]+\.webp)'/g)].map(m=>m[1]);
assert.equal(images.length,12,'Exactly 12 images must appear');
assert.equal(new Set(images).size,12,'All 12 screenshots must be unique');
for (const name of images) assert.ok(existsSync('assets/workspaces/'+name),'Missing: '+name);
for (const role of ['Operations Manager','Project Manager','Program Manager',
 'Implementation Specialist','Revenue Management','Supply Chain',
 'Budgeting','Business Systems','Process Automation','Leadership',
 'AI Implementation','Scrum'])
 assert.ok(js.includes("'"+role+"'"),'Missing role '+role);
for(const marker of ['MANY WORKSPACES','ONE LEADER','JEFF PURSLEY',
 'ws-row-top','ws-row-bottom','data-dir="right"','data-dir="left"',
 'Skip intro','Watch the intro','layoutTracks','finish(true)',
 'location.hash','document.referrer','prefers-reduced-motion'])
 assert.ok(js.includes(marker)||css.includes(marker),'Missing '+marker);
assert.match(js,/track\.scrollWidth\s*-\s*row\.clientWidth/);
assert.match(js,/travel:\s*6000/);
assert.match(js,/title:\s*2000/);
assert.equal((js.match(/await wait\(TIMING\.title\)/g)||[]).length,3,'Exactly three two-second title phases required');
assert.match(css,/\.ws-track\{transition:transform 6000ms linear\}/);
assert.match(css,/\.ws-prepare \.ws-track,\.ws-off \.ws-track\{transition:none\}/);
assert.ok(css.includes('.ws-leader .ws-row[data-dir="left"]'),'Motion continues through ONE LEADER');
assert.ok(css.includes('.ws-name .ws-row[data-dir="right"]'),'Motion continues through JEFF PURSLEY');
assert.match(css,/\.ws-row\{height:42%/);
assert.match(css,/@media\(max-width:700px\)/);
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
assert.doesNotMatch(js+css,/NexaPlan|NexaField/);
let depth=0;
for(const char of css.replace(/\/\*[\s\S]*?\*\//g,'')){
 if(char==='{')++depth; else if(char==='}')--depth;
 assert.ok(depth>=0,'Unexpected CSS closing brace');
}
assert.equal(depth,0,'Unbalanced CSS');
console.log('PASS: Two six-screen filmstrips, complete traverse, stationary title, 12 original assets, accessible controls.');
