// Structural regression checks for the 12-screen Many Workspaces homepage intro.
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const html = readFileSync('index.html', 'utf8');
const js = readFileSync('intro/intro.js', 'utf8');
const css = readFileSync('intro/intro.css', 'utf8');
const version = '20261020-workspaces';
assert.ok(html.includes('intro/intro.css?v=' + version), 'The new stylesheet must bypass the old cache');
assert.ok(html.includes('intro/intro.js?v=' + version), 'The new script must bypass the old cache');
const imageNames = [...js.matchAll(/'([\w-]+\.webp)'/g)].map(match => match[1]);
assert.equal(imageNames.length, 12, 'Exactly twelve workspace screenshots must be featured');
assert.equal(new Set(imageNames).size, 12, 'Workspace screenshots must be unique');
for (const name of imageNames) {
  assert.ok(existsSync('assets/workspaces/' + name), 'Missing workspace image: ' + name);
}
for (const label of ['Operations Manager','Project Manager','Program Manager','Implementation Specialist',
  'Revenue Management','Supply Chain','Budgeting','Business Systems','Process Automation',
  'Leadership','AI Implementation','Scrum']) {
  assert.ok(js.includes("'" + label + "'"), 'Missing workspace: ' + label);
}
for (const marker of ['MANY<br>WORKSPACES', 'ONE MANAGER', 'JEFF PURSLEY',
  'Skip intro', 'Watch the intro', 'prefers-reduced-motion',
  'localStorage','ws-row-1','ws-row-2','ws-row-3','layoutTracks','finish(true)',
  'location.hash','document.referrer']) {
  assert.ok(js.includes(marker) || css.includes(marker), 'Missing intro feature: ' + marker);
}
assert.ok(css.includes('ws-scroll-left') && css.includes('ws-scroll-right'), 'Missing alternating row motions');
assert.ok(css.includes('@media(max-width:700px)'), 'Missing responsive layout');
assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'), 'Missing reduced-motion support');
assert.ok(/travel:\s*4550/.test(js) && /manager:\s*1200/.test(js) && /name:\s*1650/.test(js), 'Unexpected intro timing');
assert.ok(!/NexaPlan|NexaField|Jeff's Brain/.test(js + css), 'Found old or invented branding');
let depth = 0;
for (const ch of css.replace(/\/\*[\s\S]*?\*\//g,'')) {
  if (ch === '{') ++depth;
  if (ch === '}') --depth;
  assert.ok(depth >= 0, 'Extra closing CSS brace');
}
assert.equal(depth, 0, 'Unbalanced CSS braces');
console.log('Many Workspaces intro PASS: 12 image assets, 3 motion rows, 3 title phases, cache version, mobile and accessibility.');
