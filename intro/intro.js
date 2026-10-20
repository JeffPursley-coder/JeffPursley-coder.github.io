/**
 * Cinematic multi-workspace portfolio intro (no dependencies).
 * All app screens and numerical scenarios are illustrative concept interfaces.
 * The actual professional accomplishments remain on the underlying portfolio.
 */
(() => {
  'use strict';
  const SEEN_KEY = 'jp-desktop-minimize-intro-v4';
  // Fast seven-second reel: five connected enterprise workspaces and one leadership story.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const path = location.pathname.replace(/\/+$/, '/') || '/';
  const isHome = path === '/' || path === '/index.html';
  // A shareable direct preview bypasses first-visit storage and referrer rules.
  // All other query strings and page anchors continue to bypass the intro.
  const forcePreview = new URLSearchParams(location.search).get('intro') === '1';
  if (!isHome || location.hash || (location.search && !forcePreview)) return;

  const titles = [
    ['01 / REVENUE & OPERATIONS', 'Revenue & Operations', 'Margin · Service profitability · Workforce capacity'],
    ['02 / PROJECT DELIVERY', 'Project Delivery', 'Global execution · Sprints · Ownership'],
    ['03 / STRATEGIC PROGRAMS', 'Strategic Program Office', 'PMO · Supply chain · Governance'],
    ['04 / ENTERPRISE IMPLEMENTATION', 'Enterprise Implementation', 'ERP/WMS concepts · Testing · Adoption'],
    ['05 / TECHNICAL AUTOMATION', 'Technical Operations', 'Automation · Business logic · Validation']
  ];
  const chrome = (title, section) => `<div class="ci-appbar"><div class="ci-lights" aria-hidden="true"><i></i><i></i><i></i></div><span class="ci-appname">${title}</span><span class="ci-appmeta">${section}</span><span class="ci-demo">Illustrative demo</span></div>`;
  const sidebar = (items, selected, foot = 'Illustrative workspace') => `<aside class="ci-sidebar" aria-hidden="true"><span class="ci-sidelabel">WORKSPACE</span>${items.map((i) => `<div class="ci-navitem${i === selected ? ' sel' : ''}">${i}</div>`).join('')}<div class="ci-sidefoot">${foot}</div></aside>`;
  const panel = (content, extra = '') => `<div class="ci-panel ${extra}">${content}</div>`;
  const bar = (text, value, percent) => `<div class="ci-barrows"><div class="ci-barlabel"><span>${text}</span><b>${value}</b></div><div class="ci-track"><span style="--fill:${percent}%"></span></div></div>`;
  const spark = `<svg class="ci-spark" viewBox="0 0 490 100" role="presentation" aria-hidden="true" preserveAspectRatio="none"><defs><linearGradient id="ci-revenue-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#43c8d5" stop-opacity=".3"/><stop offset="100%" stop-color="#43c8d5" stop-opacity="0"/></linearGradient></defs><path d="M0 89 L0 70 L98 63 L196 56 L294 23 L392 49 L490 24 L490 89Z" fill="url(#ci-revenue-area)"/><path d="M0 70 L98 63 L196 56 L294 23 L392 49 L490 24" fill="none" stroke="#68dcd8" stroke-width="3" class="ci-draw"/><path d="M0 89 H490" stroke="#31556a" stroke-width="1"/></svg>`;
  const app = (kind, name, area, content) => `<section class="ci-window ci-${kind}" aria-label="${name} illustrative software interface">${chrome(name, area)}<div class="ci-appbody">${content}</div></section>`;

  const operations = app('ops', 'Revenue & Operations / Control Room', 'Overview  /  Service profitability',
    sidebar(['◫ Overview', '▥ Revenue & Margin', '⌁ Supply Chain Capacity', '◷ Scheduling', '◇ Quality & CX'], '◫ Overview', 'Demo dataset · Not employer records') +
    `<div class="ci-work"><div class="ci-sectionline"><strong>Revenue & Operations</strong><small>Q3 illustrative scenario · USD</small></div><div class="ci-ops-kpis">
      ${[['MONTHLY REVENUE','$126,400','Q3 total $372,800'],['GROSS MARGIN','47.7%','Gross profit $60,250'],['OPERATING PROFIT','$36,150','After $24,100 overhead'],['ROUTE UTILIZATION','82%','18 / 22 planned slots']].map(x=>panel(`<div class="ci-pname">${x[0]}</div><b class="ci-big">${x[1]}</b><small>${x[2]}</small>`,'ci-kpi')).join('')}</div>
      <div class="ci-ops-main">${panel(`<div class="ci-sectionline"><span class="ci-pname">Revenue trend</span><span class="ci-tag">+5.9% vs prior month</span></div>${spark}<div class="ci-barlabel"><small>APR</small><small>MAY</small><small>JUN</small><small>JUL</small><small>AUG</small><small>SEP</small></div>`)}
      ${panel(`<div class="ci-pname">Cost allocation / September</div><div class="ci-barrows">${bar('Service labor','$51,250',57)}${bar('Materials & supplies','$14,900',17)}${bar('Operating overhead','$24,100',27)}</div><p class="ci-micro" style="margin:8px 0 0">Monthly cost base: $90,250</p>`)}</div>
      <div class="ci-ops-bottom">${panel(`<div class="ci-pname">September P&L snapshot</div><table class="ci-ptable"><tr><td>Revenue</td><td>$126,400</td></tr><tr><td>Direct labor + materials</td><td>($66,150)</td></tr><tr><td>Gross profit</td><td>$60,250</td></tr><tr><td>Operating expenses</td><td>($24,100)</td></tr><tr><td>Operating profit</td><td>$36,150</td></tr></table>`)}
      ${panel(`<div class="ci-pname">Field service performance</div>${bar('On-time service','96%',96)}<div style="height:11px"></div>${bar('First-time completion','92%',92)}<div class="ci-micro" style="margin-top:9px">Customer follow-up: 1.8 days avg.</div>`)}
      ${panel(`<div class="ci-pname">Tomorrow / workforce</div><div class="ci-miniwork"><span class="ci-avatar">JS</span><div><b>Northwest zone</b><small>6 scheduled visits</small></div></div><div class="ci-miniwork"><span class="ci-avatar">AK</span><div><b>Central zone</b><small>7 scheduled visits</small></div></div><span class="ci-tag">12 / 14 technicians assigned</span>`)}</div>
    </div>`);

  const task = (id, title, priority, initials, state = '') => `<div class="ci-task ${state}"><div class="ci-taskbottom"><span>#${id} · Story</span><em>${priority}</em></div><strong>${title}</strong><div class="ci-taskbottom"><span>Sprint 08</span><span class="ci-avatar">${initials}</span></div></div>`;
  const column = (title, items, count) => `<div class="ci-column"><div class="ci-coltitle">${title}<span class="ci-count">${count}</span></div>${items}</div>`;
  const project = app('project', 'Project Delivery / Execution Board', 'Boards  /  Sprint 08',
    sidebar(['▧ Overview', '▤ Boards', '☷ Backlogs', '◫ Sprint 08', '◇ Queries', '▦ Delivery plans'], '▤ Boards','Iteration: 05–16 Oct') +
    `<div class="ci-work"><div class="ci-proj-top"><div><h3>Field Service Platform</h3><div class="ci-micro">Sprint 08 · 05–16 Oct · Delivery team</div></div><div class="ci-proj-stats"><div class="ci-proj-pill"><b>24 / 31</b>Story points</div><div class="ci-proj-pill ci-proj-progress"><b class="ci-good">77%</b>Completed</div><div class="ci-proj-pill"><b>16 Oct</b>Release review</div></div></div><div class="ci-board">
      ${column('TO DO', task(248,'Add region-level KPI filter','P2','ML') + task(253,'Confirm retry policy','P1','AK'), '4')}
      ${column('IN PROGRESS', task(241,'Route assignment rules','P1','JP','move') + task(245,'Reconcile invoice totals','P2','SR'), '3')}
      ${column('IN REVIEW', task(237,'Customer notification UAT','P1','LB','is-review') + task(239,'Export exceptions log','P2','JP','is-review'), '2')}
      ${column('DONE', task(231,'Approve service data map','P1','ML','is-done') + task(234,'Define acceptance criteria','P2','SR','is-done'), '8')}
    </div></div>`);

  const program = app('program', 'Strategic Initiatives / Program Office', 'Portfolio governance  /  Wave 02',
    sidebar(['◇ Executive status', '▥ Roadmap', '⋈ Dependencies', '▣ Investment', '⚑ RAID & decisions', '◷ Resources'], '◇ Executive status','Steering group · Weekly') +
    `<div class="ci-work"><div class="ci-program-head"><div><h3>Service Modernization Program</h3><small>Four connected initiatives · Gate review: 23 Oct</small></div><span class="ci-tag">Executive watchlist · 2 amber</span></div><div class="ci-program-grid">
      ${panel(`<div class="ci-sectionline"><span class="ci-pname">Integrated delivery roadmap</span><span class="ci-micro">SEP → FEB</span></div><div class="ci-roadmap"><span></span>${['SEP','OCT','NOV','DEC','JAN','FEB'].map(x=>`<div class="ci-time">${x}</div>`).join('')}
        <span>Routing & capacity</span><div class="ci-linebar" style="grid-column:span 3"><b></b></div><div class="ci-linebar" style="grid-column:span 3;opacity:.2"></div>
        <span>Finance reporting</span><div class="ci-linebar" style="grid-column:span 1;opacity:.2"></div><div class="ci-linebar" style="grid-column:span 3"><b></b></div><div class="ci-linebar" style="grid-column:span 2;opacity:.2"></div>
        <span>CRM migration</span><div class="ci-linebar" style="grid-column:span 2;opacity:.2"></div><div class="ci-linebar" style="grid-column:span 4"><b></b></div>
        <span>Analytics layer</span><div class="ci-linebar" style="grid-column:span 3;opacity:.2"></div><div class="ci-linebar" style="grid-column:span 3"><b></b></div></div><div class="ci-micro" style="margin-top:12px"><b class="ci-link">Dependency:</b> Data mapping → CRM migration → analytics validation</div>`)}
      ${panel(`<div class="ci-pname">Program investment</div><div class="ci-budget"><div><span class="ci-micro">Approved</span><b>$1.24M</b></div><div><span class="ci-micro">Actual to date</span><b>$0.91M</b></div></div>${bar('Budget consumed','73.4%',73.4)}<p class="ci-micro" style="margin-bottom:0">Available budget $330K</p>`)}
      ${panel(`<div class="ci-pname">Workstream health / governance</div>${[['Routing optimization','On track'],['Finance visibility','Watch'],['CRM transition','Watch'],['Analytics foundation','On track']].map(([a,b])=>`<div class="ci-statrow"><span>${a}</span><b class="${b==='Watch'?'ci-warn':'ci-good'}">${b}</b></div>`).join('')}<div class="ci-micro" style="margin-top:9px">Resource allocation: 78% · Steering approval pending: 1</div>`)}
      ${panel(`<div class="ci-pname">RAID / escalation queue</div><div class="ci-risk"><span>R-014 · Data quality / owner AK</span><b class="ci-warn">HIGH</b></div><div class="ci-risk"><span>D-007 · Cutover window / sponsor</span><b class="ci-bad">DECISION</b></div><div class="ci-risk"><span>I-021 · Vendor API limit / owner JP</span><b class="ci-good">MITIGATED</b></div>`)}
    </div></div>`);

  const impl = app('impl', 'Enterprise Systems / Implementation Hub', 'Release readiness  /  Wave 01',
    sidebar(['◉ Readiness', '☷ Requirements', '⋈ Integrations', '▤ Data migration', '▣ Testing & UAT', '✓ Cutover'], '◉ Readiness','Go/no-go gate · Demo') +
    `<div class="ci-work"><div class="ci-impl-head"><h3>Deployment readiness review</h3><span class="ci-tag">Release candidate 1.4</span></div><div class="ci-impl-grid">
      ${panel(`<div class="ci-pname">Go-live readiness</div><div class="ci-ring">84%</div>${bar('Requirements configured','46 / 50',92)}<div style="height:12px"></div>${bar('UAT cases passed','112 / 120',93.3)}<p class="ci-micro">8 UAT cases outstanding</p>`)}
      ${panel(`<div class="ci-pname">Cutover and sign-off checklist</div><div class="ci-check passed"><span class="ci-tick">✓</span><span>Scope baseline approved</span></div><div class="ci-check passed"><span class="ci-tick">✓</span><span>Security roles verified</span></div><div class="ci-check passed"><span class="ci-tick">✓</span><span>Migration dry run #2 reconciled</span></div><div class="ci-check"><span class="ci-tick"></span><span>Business UAT sign-off pending</span></div><div class="ci-check"><span class="ci-tick"></span><span>Support handoff / go-no-go</span></div>`)}
      ${panel(`<div class="ci-pname">Interface / integration chain</div><div class="ci-flow"><span class="ci-node">Field Ops</span><span class="ci-arrow">→</span><span class="ci-node">Service API</span><span class="ci-arrow">→</span><span class="ci-node">Finance</span></div><div class="ci-pname">Open exceptions</div><div class="ci-testrow"><span>Critical defects</span><b class="ci-good">0</b></div><div class="ci-testrow"><span>High defects</span><b class="ci-warn">2</b></div><div class="ci-testrow"><span>Training complete</span><b>39 / 44</b></div>`)}
    </div></div>`);

  const code = app('code', 'Technical Operations / Automation', 'service-ops  /  local demo',
    sidebar(['EXPLORER', '▾ src', '  ◇ kpi.js', '  ◇ service-events.js', '▾ tests', '  ◇ kpi.test.js', '  ◇ package.json'], '  ◇ kpi.js','● 2 changes · main') +
    `<div class="ci-work"><div class="ci-tabs"><span class="ci-tab sel">◇ kpi.js</span><span class="ci-tab">◇ kpi.test.js</span><span class="ci-tab">◇ package.json</span></div><div class="ci-codearea"><div class="ci-numbers">1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12</div><div class="ci-source"><span class="ci-comment">// Illustrative service operations logic</span>
<span class="ci-kw">export function</span> <span class="ci-fn">grossMargin</span>(data) {
  <span class="ci-kw">const</span> { revenue, labor, materials } = data;
  <span class="ci-kw">if</span> (revenue &lt;= <span class="ci-num">0</span>) <span class="ci-kw">return</span> <span class="ci-num">0</span>;
  <span class="ci-kw">const</span> profit = revenue - labor - materials;
  <span class="ci-kw">return</span> Math.<span class="ci-fn">round</span>(profit / revenue * <span class="ci-num">1000</span>) / <span class="ci-num">10</span>;
}

<span class="ci-kw">export const</span> kpi = <span class="ci-fn">grossMargin</span>({
  revenue: <span class="ci-num">126400</span>, labor: <span class="ci-num">51250</span>,
  materials: <span class="ci-num">14900</span>
}); <span class="ci-comment">// 47.7 percent</span></div></div><div class="ci-terminal"><div class="ci-termhead">TERMINAL &nbsp; | &nbsp; PROBLEMS &nbsp; | &nbsp; OUTPUT</div><div>$ npm test -- --run</div><div class="ci-success">✓ grossMargin › handles expenses correctly</div><div class="ci-success">✓ grossMargin › protects zero revenue</div><div><span class="ci-success">12 passed</span> &nbsp; | &nbsp; 0 failed &nbsp; | &nbsp; 0 skipped</div></div></div>`);


  // The original five illustrative application screens above are preserved.
  // The new presentation connects them with a single visible laptop and cursor.
  const STEPS = [
    {short:'REVENUE + OPS',name:'Revenue & Operations'},
    {short:'PROJECTS',name:'Project Delivery'},
    {short:'PROGRAM / PMO',name:'Strategic Program Office'},
    {short:'IMPLEMENTATION',name:'Enterprise Systems'},
    {short:'AUTOMATION',name:'Technical Operations'}
  ];
  // All five illustrative applications are already open on the desktop.
  // 7.735 seconds: five meaningful workspace actions and three separate closing titles.
  const OPEN_MS=300, ACTION_MOVE_MS=135, ACTION_CLICK_MS=75, ACTION_HOLD_MS=140;
  const MOVE_MS=135, CLICK_MS=75, HOLD_MS=305;
  const DESKTOP_MS=100, CLOSE_MS=550, MANY_MS=540, LEADER_MS=560, NAME_MS=1200, LANDING_MS=160;
  const LAPTOP_TOTAL_MS=OPEN_MS+STEPS.length*(ACTION_MOVE_MS+ACTION_CLICK_MS+ACTION_HOLD_MS+MOVE_MS+CLICK_MS+HOLD_MS)+DESKTOP_MS+CLOSE_MS+MANY_MS+LEADER_MS+NAME_MS+LANDING_MS;
  const ACTIONS = [
    {kicker:'REVENUE / OPERATIONS',prompt:'Assign capacity exception',result:'Capacity issue assigned',metric:'Revenue · margin · capacity',detail:'Financial performance · people · service'},
    {kicker:'PROJECT / DELIVERY',prompt:'Advance delivery task',result:'Story advanced to review',metric:'Project execution / Delivery Board',detail:'Stakeholders · schedule · delivery'},
    {kicker:'PROGRAM / PMO',prompt:'Assign program risk owner',result:'Program risk owner set',metric:'Programs · governance · strategy',detail:'Initiatives · dependencies · resources'},
    {kicker:'ENTERPRISE SYSTEMS',prompt:'Request UAT approval',result:'UAT follow-up requested',metric:'ERP / WMS / business readiness',detail:'Migration · testing · cutover'},
    {kicker:'TECHNICAL AUTOMATION',prompt:'Validate workflow rules',result:'12 checks passed',metric:'Automations · testing · logic',detail:'Configuration · development · controls'}
  ];
  const symbols=['▥','▦','◇','◈','⌘'];
  const labels=['REVENUE & OPERATIONS','PROJECT DELIVERY','STRATEGIC PROGRAM / PMO','ENTERPRISE IMPLEMENTATION','TECHNICAL AUTOMATION'];
  const workspaceMarkup=[operations,project,program,impl,code].map((markup,i)=>
    `<div class="li-desktop-window" data-window="${i}" style="--stack:${i};z-index:${10-i}">
      <div class="li-window-head"><span class="li-window-symbol">${symbols[i]}</span>
        <span class="li-window-caption">${labels[i]}</span>
        <div class="li-window-actions"><span class="li-minimize">−</span><span class="li-maximize">□</span><span class="li-close-symbol">×</span></div>
      </div><div class="li-window-content">${markup}<div class="li-mobile-spotlight" aria-hidden="true"><small>${STEPS[i].name}</small><strong>${ACTIONS[i].metric}</strong><span>${ACTIONS[i].detail}</span></div><div class="li-action-card" aria-hidden="true">
        <div class="li-action-kicker">${ACTIONS[i].kicker}</div>
        <div class="li-action-hit"><span class="li-action-prompt">${ACTIONS[i].prompt}</span><span class="li-action-arrow">↗</span></div>
        <strong class="li-action-result">✓ ${ACTIONS[i].result}</strong>
      </div></div>
    </div>`).join('');
  const overlay = document.createElement('div');
  overlay.id = 'cinematic-intro';
  overlay.className = 'li phase-off';
  overlay.setAttribute('aria-hidden','true');
  overlay.innerHTML = `<div class="li-shell">
    <div class="li-top"><div class="li-identity">
      <div class="li-brand">JEFF PURSLEY / PORTFOLIO</div>
      <div class="li-computer">Jeff’s Computer</div>
    </div><button class="li-skip" type="button" aria-label="Skip portfolio introduction">Skip intro ↗</button></div>
    <h2 class="li-main-heading">I fix what slows <span>businesses down.</span></h2>
    <div class="li-stage" aria-hidden="true"><div class="li-desk-wrap">
      <div class="li-backglow"></div><div class="li-desk-surface"></div>
      <div class="li-laptop"><div class="li-screen-shell">
        <div class="li-screen-bezel"><span class="li-camera"></span><div class="li-screen">
          <div class="li-desktop">
            <div class="li-os-menubar"><span class="li-os-apple">◈</span><b>Jeff’s Computer</b><span>File</span><span>View</span><span>Window</span><span class="li-os-status">● &nbsp; Wi-Fi &nbsp; ◉</span></div>
            <div class="li-os-wallpaper">
              <div class="li-wallpaper-shape one"></div><div class="li-wallpaper-shape two"></div><div class="li-wallpaper-grid"></div>
              <div class="li-desktop-icons">${STEPS.map((w,i)=>`<div class="li-desktop-icon"><span>${symbols[i]}</span><small>${w.short}</small></div>`).join('')}</div>
              <div class="li-wallpaper-label">JEFF’S COMPUTER <span>/ WORKSPACE</span></div>
            </div>
            <div class="li-os-windows">${workspaceMarkup}</div>
            <div class="li-taskbar"><span class="li-taskbar-start">◈</span>
              <div class="li-taskbar-apps">${STEPS.map((w,i)=>`<span class="li-task-app" data-task="${i}"><b>${symbols[i]}</b><small>${w.short}</small><i></i></span>`).join('')}</div>
              <span class="li-taskbar-end">▤ &nbsp;●</span>
            </div>
          </div>
          <div class="li-cursor"><svg viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M4.1 2.6L18.4 17.9L11.9 18.9L15.6 27.1L12.4 28.5L8.8 20.2L4.1 24.5V2.6Z" fill="#fff" stroke="#0D2430" stroke-width="1.4" stroke-linejoin="round"/></svg><span class="li-cursor-ring"></span></div>
        </div></div>
      </div><div class="li-base" aria-hidden="true"><div class="li-base-deck"><div class="li-hinge"></div>
        <div class="li-keyboard">${Array.from({length:78},()=>'<i></i>').join('')}</div>
        <div class="li-trackpad"></div><div class="li-front-lip"></div>
      </div></div></div></div>
    </div>
    <div class="li-center-copy" aria-hidden="true"><div class="li-center-lock">
      <div class="li-many">MANY WORKSPACES</div><div class="li-one">ONE LEADER</div><div class="li-name">JEFF PURSLEY</div><div class="li-role">Operations · Revenue Management · Programs · Technology</div>
    </div></div>
    <div class="li-note">ORIGINAL CONCEPT INTERFACES · ALL WORKSPACE DATA IS ILLUSTRATIVE</div>
    <div class="li-loader" aria-hidden="true"><div class="li-loader-track"><span class="li-loader-fill"></span></div>
      <div class="li-loader-row"><span class="li-dot">●</span><span class="li-loader-message">Opening Jeff’s Computer</span><span class="li-loader-percent">0%</span></div>
    </div>
    <span class="li-live" role="status" aria-live="polite" style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)"></span>
  </div>`;
  document.body.appendChild(overlay);
  const hero=document.querySelector('.home-hero');
  const replay=document.createElement('button');
  replay.type='button'; replay.className='li-replay';
  replay.textContent='↻ Watch the intro';
  replay.setAttribute('aria-label','Replay desktop window minimizing introduction');
  const heroHeading=hero?.querySelector('.hero-copy h1');
  // Make the replay accessible without scrolling through the homepage on phones.
  if(heroHeading)heroHeading.insertAdjacentElement('afterend',replay);
  else (hero?.querySelector('.hero-copy')||hero||document.body).appendChild(replay);
  const skip=overlay.querySelector('.li-skip');
  const screen=overlay.querySelector('.li-screen');
  const cursor=overlay.querySelector('.li-cursor');
  const windows=[...overlay.querySelectorAll('.li-desktop-window')];
  const taskbar=[...overlay.querySelectorAll('.li-task-app')];
  const loader=overlay.querySelector('.li-loader');
  const loaderMessage=overlay.querySelector('.li-loader-message');
  const loaderPercent=overlay.querySelector('.li-loader-percent');
  const live=overlay.querySelector('.li-live');
  loader.style.setProperty('--duration',`${LAPTOP_TOTAL_MS}ms`);
  let epoch=0, playing=false, progressTimer=null, exitTimer=null, returnFocus=null;
  const pending=new Set();
  const wait=(ms)=>new Promise(resolve=>{
    const entry={id:null,done:resolve};
    entry.id=window.setTimeout(()=>{pending.delete(entry);resolve();},ms);
    pending.add(entry);
  });
  const clearPending=()=>{
    for(const item of pending){window.clearTimeout(item.id);item.done();}
    pending.clear();
  };
  const safeStorage=(action)=>{
    try {return action==='read' ? window.localStorage.getItem(SEEN_KEY) : window.localStorage.setItem(SEEN_KEY,'1');}
    catch(_) {return null;}
  };
  const phase=(value)=>{overlay.className=`li phase-${value}`};
  const resetWindows=()=>{
    windows.forEach((item,i)=>{
      item.classList.remove('is-minimizing','is-minimized','is-focused','is-action-complete');
      item.querySelector('.li-minimize')?.classList.remove('is-pressed');
      item.querySelector('.li-action-hit')?.classList.remove('is-pressed');
      item.querySelector('.ci-window')?.classList.toggle('is-active',i===0);
    });
    // Restore the illustrative changes so replay begins with the original screens.
    windows[0]?.querySelector('.ci-ops-kpis .ci-panel:nth-child(4)')?.classList.remove('li-action-updated');
    const projectColumns=windows[1]?.querySelectorAll('.ci-column');
    const projectStory=windows[1]?.querySelector('.ci-task.move');
    if(projectColumns?.length>=3 && projectStory){
      projectColumns[1].insertBefore(projectStory,projectColumns[1].querySelector('.ci-task'));
      projectColumns[1].querySelector('.ci-count').textContent='3';
      projectColumns[2].querySelector('.ci-count').textContent='2';
    }
    const riskState=windows[2]?.querySelector('.ci-risk .ci-warn');
    if(riskState)riskState.textContent='HIGH';
    const signoff=windows[3]?.querySelector('.ci-check:not(.passed) span:last-child');
    if(signoff)signoff.textContent='Business UAT sign-off pending';
    windows[4]?.querySelector('.ci-terminal')?.classList.remove('li-action-updated');
    taskbar.forEach(icon=>icon.classList.remove('minimized'));
    cursor.classList.remove('is-clicking');
    windows[0]?.classList.add('is-focused');
  };
  const completeAction=(index)=>{
    const item=windows[index];
    item.classList.add('is-action-complete');
    if(index===0)item.querySelector('.ci-ops-kpis .ci-panel:nth-child(4)')?.classList.add('li-action-updated');
    if(index===1){
      const cols=item.querySelectorAll('.ci-column');
      const story=item.querySelector('.ci-task.move');
      if(cols.length>=3 && story){
        cols[2].insertBefore(story,cols[2].querySelector('.ci-task'));
        cols[1].querySelector('.ci-count').textContent='2';
        cols[2].querySelector('.ci-count').textContent='3';
      }
    }
    if(index===2){
      const state=item.querySelector('.ci-risk .ci-warn');
      if(state)state.textContent='OWNER SET';
    }
    if(index===3){
      const signoff=item.querySelector('.ci-check:not(.passed) span:last-child');
      if(signoff)signoff.textContent='UAT follow-up requested';
    }
    if(index===4)item.querySelector('.ci-terminal')?.classList.add('li-action-updated');
    live.textContent=ACTIONS[index].result+'.';
  };
  const moveCursor=(x,y)=>{
    cursor.style.setProperty('--cursor-x',`${x}px`);
    cursor.style.setProperty('--cursor-y',`${y}px`);
  };
  const pointAt=(index)=>{
    const rect=windows[index].querySelector('.li-minimize').getBoundingClientRect();
    const origin=screen.getBoundingClientRect();
    moveCursor(rect.left-origin.left+rect.width*.47,rect.top-origin.top+rect.height*.37);
  };
  const pointAction=(index)=>{
    const rect=windows[index].querySelector('.li-action-hit').getBoundingClientRect();
    const origin=screen.getBoundingClientRect();
    moveCursor(rect.left-origin.left+rect.width*.7,rect.top-origin.top+rect.height*.5);
  };
  const stop=(skipped=false)=>{
    if(!playing) return;
    const closingEpoch=++epoch;
    clearPending();
    window.clearInterval(progressTimer); progressTimer=null;
    window.clearTimeout(exitTimer);
    playing=false;
    if(!skipped){loaderPercent.textContent='100%';loaderMessage.textContent='Opening portfolio';}
    phase('exit');
    overlay.setAttribute('aria-hidden','true'); overlay.inert=true;
    document.documentElement.classList.remove('li-lock');
    document.querySelectorAll('[data-li-inert]').forEach(el=>{el.inert=false;el.removeAttribute('data-li-inert');});
    safeStorage('write');
    document.documentElement.classList.add('li-home-arrive');
    window.setTimeout(()=>document.documentElement.classList.remove('li-home-arrive'),1000);
    if(returnFocus&&document.contains(returnFocus))returnFocus.focus({preventScroll:true});
    exitTimer=window.setTimeout(()=>{if(!playing&&epoch===closingEpoch)overlay.className='li phase-off';},930);
  };
  const play=async(manual=false)=>{
    if(playing||reduced.matches)return;
    window.clearTimeout(exitTimer);
    playing=true;
    returnFocus=manual?replay:document.querySelector('.home-hero h1');
    if(returnFocus&&!returnFocus.hasAttribute('tabindex'))returnFocus.setAttribute('tabindex','-1');
    for(const el of document.querySelectorAll('body > *:not(#cinematic-intro)')){
      if(!el.inert){el.inert=true;el.setAttribute('data-li-inert','');}
    }
    overlay.inert=false;
    overlay.setAttribute('aria-hidden','false');
    document.documentElement.classList.add('li-lock');
    phase('desktop'); resetWindows();
    const cursorScreen=screen.getBoundingClientRect();
    moveCursor(cursorScreen.width*.80,cursorScreen.height*.80);
    loader.classList.remove('running');
    void loader.offsetWidth;
    loader.classList.add('running');
    loaderPercent.textContent='0%';
    loaderMessage.textContent='Five workspaces · One operating system';
    const start=performance.now();
    window.clearInterval(progressTimer);
    progressTimer=window.setInterval(()=>{
      loaderPercent.textContent=`${Math.min(99,Math.floor((performance.now()-start)*100/LAPTOP_TOTAL_MS))}%`;
    },100);
    live.textContent='Jeff’s Computer desktop. Five professional application windows already open.';
    skip.focus({preventScroll:true});
    const token=++epoch;
    await wait(OPEN_MS); if(token!==epoch)return;
    for(let i=0;i<windows.length;i++){
      loaderMessage.textContent=`Working in ${STEPS[i].short.toLowerCase()}`;
      pointAction(i);
      await wait(ACTION_MOVE_MS); if(token!==epoch)return;
      cursor.classList.add('is-clicking');
      windows[i].querySelector('.li-action-hit').classList.add('is-pressed');
      await wait(ACTION_CLICK_MS); if(token!==epoch)return;
      cursor.classList.remove('is-clicking');
      windows[i].querySelector('.li-action-hit').classList.remove('is-pressed');
      completeAction(i);
      loaderMessage.textContent=ACTIONS[i].result;
      await wait(ACTION_HOLD_MS); if(token!==epoch)return;
      pointAt(i);
      await wait(MOVE_MS); if(token!==epoch)return;
      cursor.classList.add('is-clicking');
      windows[i].querySelector('.li-minimize').classList.add('is-pressed');
      await wait(CLICK_MS); if(token!==epoch)return;
      cursor.classList.remove('is-clicking');
      windows[i].querySelector('.li-minimize').classList.remove('is-pressed');
      windows[i].classList.add('is-minimizing');
      taskbar[i].classList.add('minimized');
      live.textContent=`Minimized ${STEPS[i].short}. ${windows.length-i-1} applications remaining.`;
      await wait(HOLD_MS); if(token!==epoch)return;
      windows[i].classList.add('is-minimized');
      windows[i+1]?.classList.add('is-focused');
    }
    loaderMessage.textContent='Desktop clear · Closing laptop';
    live.textContent='All five applications minimized. The desktop is clear.';
    await wait(DESKTOP_MS); if(token!==epoch)return;
    phase('close');live.textContent='The laptop closes.';
    await wait(CLOSE_MS);if(token!==epoch)return;
    phase('many');live.textContent='Many workspaces.';loaderMessage.textContent='MANY WORKSPACES';
    await wait(MANY_MS);if(token!==epoch)return;
    phase('leader');live.textContent='One leader.';loaderMessage.textContent='ONE LEADER';
    await wait(LEADER_MS);if(token!==epoch)return;
    phase('name');live.textContent='Jeff Pursley.';loaderMessage.textContent='JEFF PURSLEY';
    await wait(NAME_MS);if(token!==epoch)return;
    await wait(LANDING_MS);if(token!==epoch)return;
    stop();
  };
  skip.addEventListener('click',()=>stop(true));
  replay.addEventListener('click',()=>play(true));
  overlay.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();stop(true);}
    if(e.key==='Tab'){e.preventDefault();skip.focus();}
  });
  reduced.addEventListener?.('change',e=>{if(e.matches)stop(true)});
  let fromOwnSite=false;
  try{fromOwnSite=!!document.referrer&&new URL(document.referrer).origin===location.origin;}catch(_){}
  const nav=performance.getEntriesByType?.('navigation')?.[0];
  const reload=nav?.type==='reload'||performance.navigation?.type===1;
  if(!reduced.matches&&(forcePreview||reload||(!safeStorage('read')&&!fromOwnSite)))play(false);
})();
