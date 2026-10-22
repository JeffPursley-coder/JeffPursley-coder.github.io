// Regression checks for Jeff's Garage terminal loading intro.
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const html=readFileSync('index.html','utf8');
const js=readFileSync('intro/intro.js','utf8');
const css=readFileSync('intro/intro.css','utf8');
assert.match(html,/intro\/intro\.css\?v=20261021-garage-v8/);
assert.match(html,/intro\/intro\.js\?v=20261021-garage-v8/);
assert.ok(existsSync('assets/img/garage-monitor-off.webp'));
const asset=readFileSync('assets/img/garage-monitor-off.webp');
assert.equal(asset.toString('ascii',0,4),'RIFF');
assert.equal(asset.toString('ascii',8,12),'WEBP');
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
assert.equal((js.match(/\{ role: '/g)||[]).length,9);
for(const [role,software,file] of workspaces){
 assert.ok(js.includes("role: '"+role+"'"));
 assert.ok(js.includes("software: '"+software+"'"));
 assert.ok(js.includes("file: '"+file+"'"));
 assert.ok(existsSync('assets/workspaces/'+file));
}
assert.doesNotMatch(js,/role: '(?:Leadership|Scrum|Business Systems)'/);
assert.equal((js.match(/\{ name: '/g)||[]).length,6,'Six qualifications');
for(const label of ['PMP','Certified Scrum Product Owner','Certified ScrumMaster','Google Project Management','BSBA, Operations Management','B.S., Computer Information Systems']){
 assert.ok(js.includes("name: '"+label+"'"),'Missing '+label);
}
for(const part of ["Running: <strong>JeffPursley.exe</strong>","gm-progress-track","gm-progress-fill","gm-verify-name","gm-verify-state","Release Status","updateProgress(i+1)","updateProgress(0)","Math.round(count/windows.length*100)","gm-shutting","showName(true)","gm-skip","gm-role-callout","location.hash","localStorage","prefers-reduced-motion"]){
 assert.ok(js.includes(part),'Missing intro behavior: '+part);
}
for(const part of ['.gm-load-panel','.gm-progress-fill','.gm-load-details','.gm-progress-number','.gm-monitor','.gm-copy-name.gm-copy-on','gm-monitor-flick-out','-webkit-text-stroke','max-width:760px','transition:width .55s']){
 assert.ok(css.includes(part),'Missing CSS: '+part);
}
assert.doesNotMatch(js,/showCinema|MANY WORKSPACES|AND ONLY ONE MANAGER|gm-cinematic/);
assert.doesNotMatch(css,/\.gm-cinematic|\.gm-cinema-/);
assert.ok(js.indexOf('updateProgress(i+1)')<js.indexOf("overlay.classList.add('gm-shutting')"));
assert.ok(js.indexOf('showName(true)')>js.indexOf('await wait(TIMING.powerOff)'));
assert.match(js,/overlay\.classList\.add\('gm-vanish'\)/);
let depth=0;
for(const c of css.replace(/\/\*[\s\S]*?\*\//g,'')){if(c==='{')depth++;if(c==='}')depth--;assert.ok(depth>=0)}
assert.equal(depth,0);
console.log('Garage loader integrity PASS: nine windows, six qualifications, synchronized progress and final reveal.');
