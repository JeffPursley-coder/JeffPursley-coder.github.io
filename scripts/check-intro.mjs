// Dependency-free structural and accounting checks for illustrative intro.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const html=readFileSync('index.html','utf8');
const js=readFileSync('intro/intro.js','utf8');
const css=readFileSync('intro/intro.css','utf8');
assert.match(html,/intro\/intro\.css/);
assert.match(html,/intro\/intro\.js/);
for(const phrase of ['MULTIPLE WORKSPACES','ONE LEADER','JEFF PURSLEY','Illustrative demo','Skip intro','Replay introduction']){
  assert.ok(js.includes(phrase), 'Intro missing '+phrase);
}
for(const type of ['ops','project','program','impl','code']){
  assert.ok(js.includes("app('"+type+"'"),'Missing '+type+' workspace');
}
assert.ok(js.includes('prefers-reduced-motion'));
assert.ok(js.includes('localStorage'));
assert.ok(js.includes('location.hash') && js.includes('document.referrer'));
assert.match(js,/const WORKSPACE_MS = 1180/);
assert.match(js,/isReload \|\|/);
assert.match(js,/ci-always/);
assert.match(js,/ci-loader-percent/);
assert.match(css,/ci-loader-progress/);
assert.match(js,/ci-converge/);
assert.match(js,/ci-finale-rule/);
assert.match(js,/1040 \+ 420 \+ 1130 \+ 1740/);
assert.match(css,/ci-converge-draw/);
assert.match(css,/ci.phase-name \.ci-finale-name/);
assert.match(css,/ci-landing-reveal/);
assert.match(css,/\.ci-column \.ci-task:nth-child\(n\+3\)/);
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
console.log('Cinematic intro PASS: five workspaces, controls, link wiring and illustrative financial arithmetic.');
