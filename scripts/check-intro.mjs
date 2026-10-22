// Regression checks for the final Jeff's Garage intro (v9).
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const html=readFileSync('index.html','utf8');
const js=readFileSync('intro/intro.js','utf8');
const css=readFileSync('intro/intro.css','utf8');
const photo=readFileSync('assets/img/garage-monitor-frame-photo-v10.webp');
assert.match(html,/intro\/intro\.css\?v=20261022-garage-v10/);
assert.match(html,/intro\/intro\.js\?v=20261022-garage-v10/);
assert.ok(existsSync('assets/img/garage-monitor-off.webp'));
assert.equal(readFileSync('assets/img/garage-monitor-off.webp').toString('ascii',0,4),'RIFF');
assert.equal(readFileSync('assets/img/garage-monitor-off.webp').toString('ascii',8,12),'WEBP');
assert.equal(photo.toString('ascii',0,4),'RIFF');
assert.equal(photo.toString('ascii',8,12),'WEBP');
assert.ok(photo.length>20000,'Photo must be higher quality than old placeholder');
assert.equal((js.match(/\{ role: '/g)||[]).length,9);
assert.equal((js.match(/\{ name: '/g)||[]).length,6);
for(const file of ['02_project_manager_microsoft_planner.webp','03_program_manager_planview.webp','05_revenue_management_power_bi.webp','06_supply_chain_sap_ibp.webp','01_operations_manager_dynamics_365_field_service.webp','07_budgeting_excel_power_bi.webp','04_implementation_specialist_servicenow_jira.webp','09_process_automation_power_automate.webp','11_ai_implementation_copilot_studio.webp']){
 assert.ok(existsSync('assets/workspaces/'+file));assert.ok(js.includes(file));
}
assert.doesNotMatch(js,/role: '(?:Leadership|Scrum|Business Systems)'/);
const titles=['Certified Scrum Product Owner','Certified ScrumMaster','Google Project Management','PMP (Project Management Professional)','BSBA, Operations Management','B.S., Computer Information Systems'];
for(const x of titles)assert.ok(js.includes("name: '"+x+"'"),'Credential '+x);
for(const x of ["hold: 350, click: 100, shrink: 250, gap: 50","setLed('boot')","setLed('on')","setLed('off')","CREDENTIAL_STAGES","showReady()","updateProgress(i+1)","gm-monitor-led","gm-booting","gm-powered","gm-shutting","gm-skip","localStorage"])assert.ok(js.includes(x),x);
for(const x of ['garage-monitor-frame-photo-v10.webp','.gm-monitor-led[data-state="boot"]','.gm-monitor-led[data-state="on"]','.gm-monitor-led[data-state="off"]','@keyframes gm-screen-startup','gm-monitor-flick-out','gm-progress-fill'])assert.ok(css.includes(x),x);
assert.ok(js.indexOf('updateProgress(i+1)') < js.indexOf("overlay.classList.add('gm-shutting')"));
assert.ok(js.indexOf("setLed('off')")>js.indexOf("setLed('on')"));
assert.ok(js.indexOf('showName(true)')>js.indexOf('await wait(TIMING.powerOff)'));
assert.doesNotMatch(js,/showCinema|MANY WORKSPACES|AND ONLY ONE MANAGER|cycleCredentials/);
assert.ok(js.includes('if(count===windows.length)showReady()'));
assert.ok(js.indexOf("PMP (Project Management Professional)") < js.indexOf("BSBA, Operations Management"));
let depth=0;for(const c of css.replace(/\/\*[\s\S]*?\*\//g,'')){if(c==='{')depth++;if(c==='}')depth--;assert.ok(depth>=0)}assert.equal(depth,0);
console.log('Garage intro PASS: actual monitor photo, nine synchronized windows, six credentials before 100%, LED and final reveal.');
