// Structural regression checks for Jeff's Brain homepage intro.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const html=readFileSync('index.html','utf8');
const js=readFileSync('intro/intro.js','utf8');
const css=readFileSync('intro/intro.css','utf8');
assert.match(html,/intro\/intro\.css\?v=20261020a/);
assert.match(html,/intro\/intro\.js\?v=20261020a/);
const expected=[
  'how to make the best steak','Project Management','Program Management',
  'Implementation','Revenue Management','how to make an omelette','Bottlenecks',
  'Supply Chain Logistics','Business Systems','Accountability','Leadership',
  'Budgeting','Dad Jokes','Process Automation','1 Magic Trick',
  'SCRUM','Operational Knowledge'
];
for(const term of expected) assert.ok(js.includes("name:'"+term+"'"),'Missing: '+term);
assert.equal((js.match(/done:'/g)||[]).length,17,'Expected exactly seventeen installs');
for(const marker of ['PMP','PASSED','ABOVE TARGET','JEFF PURSLEY','Many functions. One manager.',
  'Skip intro','Watch the intro','prefers-reduced-motion','localStorage','jp-person-clip',
  'jp-person-fill','setFigure','setProgress','jp-cable-pulse','jp-joke-dad',
  'jp-joke-magic','location.hash','document.referrer']) {
    assert.ok(js.includes(marker),'Missing feature: '+marker);
}
assert.match(js,/get\('intro'\)==='1'/);
assert.match(js,/setProgress\(100\)/);
assert.match(js,/setFigure\(\(i\+1\)\/INSTALLS\.length\)/);
assert.match(js,/finish\(true\)/);
assert.match(css,/\.jp-person-fill\{/);
assert.match(css,/\.jp-intro\.jp-finale \.jp-final/);
assert.match(css,/@media\(max-width:760px\)/);
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
assert.doesNotMatch(js,/MANY WORKSPACES|li-laptop|li-desktop-window/);
let depth=0;
for(const ch of css.replace(/\/\*[\s\S]*?\*\//g,'')){
  if(ch==='{')depth++;
  if(ch==='}')depth--;
  assert.ok(depth>=0,'Extra closing CSS brace');
}
assert.equal(depth,0,'Unbalanced CSS braces');
console.log("Jeff's Brain PASS: 17 installs, silhouette fill, PMP, humor, responsive and accessible controls.");
