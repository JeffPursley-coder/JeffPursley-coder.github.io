// Regression checks for Jeff's Garage monitor intro (no dependencies).
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const html=readFileSync('index.html','utf8');
const js=readFileSync('intro/intro.js','utf8');
const css=readFileSync('intro/intro.css','utf8');
assert.match(html,/intro\/intro\.css\?v=20261021-garage-v7/);
assert.match(html,/intro\/intro\.js\?v=20261021-garage-v7/);
assert.ok(existsSync('assets/img/garage-monitor-off.webp'),'Monitor asset must exist');
const asset=readFileSync('assets/img/garage-monitor-off.webp');
assert.equal(asset.toString('ascii',0,4),'RIFF','Monitor asset must be WebP RIFF');
assert.equal(asset.toString('ascii',8,12),'WEBP','Monitor asset must be WebP');
const workspaces=[
 ['Project Management','Microsoft Planner','02_project_manager_microsoft_planner.webp'],
 ['Program Management','Planview Program Portfolio','03_program_manager_planview.webp'],
 ['Revenue Management','Microsoft Power BI','05_revenue_management_power_bi.webp'],
 ['Supply Chain','SAP Integrated Business Planning','06_supply_chain_sap_ibp.webp'],
 ['Operations Management','Dynamics 365 Field Service','01_operations_manager_dynamics_365_field_service.webp'],
 ['Budgeting','Microsoft Excel + Power BI','07_budgeting_excel_power_bi.webp'],
 ['Implementation','ServiceNow + Jira','04_implementation_specialist_servicenow_jira.webp'],
 ['Process Automation','Microsoft Power Automate','09_process_automation_power_automate.webp'],
 ['AI Implementation','Microsoft Copilot Studio','11_ai_implementation_copilot_studio.webp']
];
for(const [role,software,file] of workspaces){
 assert.ok(js.includes("role: '"+role+"'"),'Role missing: '+role);
 assert.ok(js.includes("software: '"+software+"'"),'Software missing: '+software);
 assert.ok(js.includes("file: '"+file+"'"),'Image missing: '+file);
 assert.ok(existsSync('assets/workspaces/'+file),'Screenshot missing: '+file);
}
assert.equal((js.match(/\{ role: '/g)||[]).length,9,'Exactly 9 screens');
for(const phrase of ['gm-role-callout','gm-min','gm-minimizing','gm-minimized','gm-cinematic',
  'gm-powering','gm-skip','Watch the intro','prefers-reduced-motion',
  'location.hash','document.referrer','localStorage','forced','gm-screen-reader']){
 assert.ok(js.includes(phrase),'Missing behavior: '+phrase);
}
for(const phrase of ['garage-monitor-off.webp','gm-window-head','gm-role-callout',
  'gm-crt-shut','gm-power-off','gm-replay','gm-cinematic','max-width:760px']){
 assert.ok(css.includes(phrase),'Missing CSS: '+phrase);
}
assert.match(js,/overlay\.classList\.add\('gm-vanish'\)/);
assert.doesNotMatch(js,/gm-pointer|placePointerOn|move: 155/);
assert.match(js,/\[8,9,86\]/);
assert.match(css,/gm-click-ring/);
assert.match(css,/gm-cinematic-visible/);
assert.match(js,/gm-cinema-arrow/);
assert.match(css,/gm-cinema-arrow/);
assert.match(js,/gm-cinema-arrow/);
assert.ok(js.includes('↓'),'Use a down arrow instead of right arrow');
assert.match(css,/@keyframes gm-many-bounce-up/);
assert.match(css,/gm-monitor-flick-out/);
assert.match(css,/gm-screen-flash/);
assert.match(js,/overlay.classList.add\('gm-shutting'\)/);
assert.match(js,/AND ONLY ONE MANAGER/);
assert.match(css,/-webkit-text-stroke/);
assert.doesNotMatch(js,/role: '(?:Leadership|Scrum|Business Systems)'/);
assert.match(js,/showCinema\('many'\)/);
assert.match(js,/showCinema\('one'\)/);
assert.match(js,/showCinema\(null\)/);
assert.ok(js.lastIndexOf("showCinema(null);") < js.indexOf("showName(true);"),"The caption must exit before the standalone name appears");
assert.equal((js.match(/showCinema\(null\)/g)||[]).length,2,"Caption stays throughout installs");
assert.match(css,/ellipse 37% 15% at 50% 77%/);
assert.match(css,/\.gm-role-callout\{[^}]*right:1\.7%/);
assert.match(css,/\.gm-role-text\{[^}]*white-space:nowrap/);
assert.match(css,/\.gm-role-link path\{/);
assert.match(js,/gm-role-link/);
assert.match(js,/const startX=/);
assert.match(js,/const endX=/);
assert.match(js,/hold: 700, click: 100, shrink: 300, gap: 65/);
assert.doesNotMatch(js,/callout\.style\.top=/);
for(const phrase of ['MANY WORKSPACES','AND ONLY ONE MANAGER','JEFF PURSLEY','gm-copy-overlay',"showCinema('many')","showCinema('one')","showName(true)",'nameHold: 1400','await wait(TIMING.powerOff)']){
 assert.ok(js.includes(phrase),'Missing title beat or timing: '+phrase);
}
for(const selector of ['.gm-cinematic.gm-cinematic-many .gm-cinema-many','.gm-cinematic.gm-cinematic-one .gm-cinema-one','.gm-copy-name.gm-copy-on','.gm-copy-overlay']){
 assert.ok(css.includes(selector),'Missing style: '+selector);
}
assert.ok(js.indexOf('showName(true)')>js.indexOf("await wait(TIMING.powerOff)"),'Name must follow power-off');
assert.ok(js.indexOf("overlay.classList.add('gm-shutting')")<js.indexOf("showName(true)"),'Monitor must flick away before final name');
assert.ok(js.indexOf('gm-copy-overlay') > js.indexOf('gm-screen-reader'), 'Name title must live outside the monitor');
assert.ok(js.indexOf("showCinema('one')")>js.indexOf("showCinema('many')"),'Manager title must follow many workspaces');
assert.doesNotMatch(js,/jp-person-fill|jp-brain-intro|ws-track|ws-row-top|li-laptop/);
let braces=0;
for(const c of css.replace(/\/\*[\s\S]*?\*\//g,'')){if(c==='{')braces++;if(c==='}')braces--;assert.ok(braces>=0,'Extra CSS brace')}
assert.equal(braces,0,'CSS braces balanced');
console.log('Garage monitor intro PASS: 9 workspaces, upper-right unbroken callouts, slightly slower minimize-icon clicks, power off and accessibility.');
