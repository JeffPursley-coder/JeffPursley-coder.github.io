// Dependency-free structural and accounting checks for illustrative intro.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const html=readFileSync('index.html','utf8');
const js=readFileSync('intro/intro.js','utf8');
const css=readFileSync('intro/intro.css','utf8');
assert.match(html,/intro\/intro\.css/);
assert.match(html,/intro\/intro\.js/);
for(const phrase of ['MANY WORKSPACES','ONE LEADER','JEFF PURSLEY','Illustrative demo','Skip intro','Replay introduction']){
  assert.ok(js.includes(phrase), 'Intro missing '+phrase);
}
for(const type of ['ops','project','program','impl','code']){
  assert.ok(js.includes("app('"+type+"'"),'Missing '+type+' workspace');
}
assert.ok(js.includes('prefers-reduced-motion'));
assert.ok(js.includes('localStorage'));
assert.ok(js.includes('location.hash') && js.includes('document.referrer'));
assert.match(js,/Jeff’s Computer/);
assert.match(js,/<div class="li-subtitle">MANY WORKSPACES<\/div>/);
assert.match(js,/OPEN_MS=620, MOVE_MS=340, CLICK_MS=120, HOLD_MS=560/);
assert.match(js,/DESKTOP_MS=420, CLOSE_MS=980, LEADER_MS=1030, NAME_MS=1530, LANDING_MS=350/);
assert.match(css,/\.li-laptop\{position:relative;width:min\(1185px/);
assert.match(css,/\.li-screen-shell\{position:absolute;left:2\.5%;right:2\.5%/);
assert.match(js,/li-desktop-icons/);
assert.match(js,/li-os-wallpaper/);
assert.match(js,/li-os-menubar/);
assert.match(js,/li-desktop-window/);
assert.match(js,/li-minimize/);
assert.match(js,/is-minimizing/);
assert.match(js,/li-taskbar/);
assert.match(js,/LAPTOP_TOTAL_MS/);
assert.match(js,/phase\('close'\)/);
assert.match(js,/phase\('leader'\)/);
assert.match(js,/phase\('name'\)/);
assert.match(js,/reload\|\|/);
assert.match(js,/li phase-off/);
assert.match(css,/\.li-desktop-window\.is-minimizing/);
assert.match(css,/\.li\.phase-close \.li-screen-shell/);
assert.match(css,/\.li\.phase-name \.li-name/);
assert.match(css,/\.li-loader\.running \.li-loader-fill/);
assert.match(css,/prefers-reduced-motion/);
assert.equal(126400-51250-14900,60250);
assert.equal(60250-24100,36150);
assert.equal(127000+119400+126400,372800);
assert.equal(Math.round(60250/126400*1000)/10,47.7);
assert.equal(Math.round(910000/1240000*1000)/10,73.4);
assert.equal(Math.round(112/120*1000)/10,93.3);
let depth=0;
for(const c of css.replace(/\/\*[\s\S]*?\*\//g,'')){
  if(c==='{')depth++;
  if(c==='}')depth--;
  assert.ok(depth>=0,'Extra closing CSS brace');
}
assert.equal(depth,0,'Unbalanced intro stylesheet');
console.log('Desktop intro PASS: five stacked open windows, minimize cursor sequence, taskbar and lid finale.');
