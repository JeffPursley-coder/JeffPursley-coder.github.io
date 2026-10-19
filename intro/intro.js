/**
 * Cinematic multi-workspace portfolio intro (no dependencies).
 * All app screens and numerical scenarios are illustrative concept interfaces.
 * The actual professional accomplishments remain on the underlying portfolio.
 */
(() => {
  'use strict';
  const SEEN_KEY = 'jp-cinematic-intro-seen-v1';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const path = location.pathname.replace(/\/+$/, '/') || '/';
  const isHome = path === '/' || path === '/index.html';
  if (!isHome || location.hash || location.search) return;

  const titles = [
    ['01 / BUSINESS OPERATIONS', 'Operations Control', 'Financial performance · Field capacity · Service delivery'],
    ['02 / PROJECT DELIVERY', 'Project Atlas', 'Sprint execution · Backlog ownership · Work in progress'],
    ['03 / PROGRAM LEADERSHIP', 'Transformation Program Office', 'Multiple workstreams · Dependencies · Governance'],
    ['04 / SYSTEMS IMPLEMENTATION', 'Implementation Hub', 'Requirements · Migration · User acceptance · Cutover'],
    ['05 / CODE & AUTOMATION', 'Workflow Engine', 'Source control · Test execution · Business logic']
  ];
  const chrome = (title, section) => `<div class="ci-appbar"><div class="ci-lights" aria-hidden="true"><i></i><i></i><i></i></div><span class="ci-appname">${title}</span><span class="ci-appmeta">${section}</span><span class="ci-demo">Illustrative demo</span></div>`;
  const sidebar = (items, selected, foot = 'Illustrative workspace') => `<aside class="ci-sidebar" aria-hidden="true"><span class="ci-sidelabel">WORKSPACE</span>${items.map((i) => `<div class="ci-navitem${i === selected ? ' sel' : ''}">${i}</div>`).join('')}<div class="ci-sidefoot">${foot}</div></aside>`;
  const panel = (content, extra = '') => `<div class="ci-panel ${extra}">${content}</div>`;
  const bar = (text, value, percent) => `<div class="ci-barrows"><div class="ci-barlabel"><span>${text}</span><b>${value}</b></div><div class="ci-track"><span style="--fill:${percent}%"></span></div></div>`;
  const spark = `<svg class="ci-spark" viewBox="0 0 490 100" role="presentation" aria-hidden="true" preserveAspectRatio="none"><defs><linearGradient id="ci-revenue-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#43c8d5" stop-opacity=".3"/><stop offset="100%" stop-color="#43c8d5" stop-opacity="0"/></linearGradient></defs><path d="M0 89 L0 70 L98 63 L196 56 L294 23 L392 49 L490 24 L490 89Z" fill="url(#ci-revenue-area)"/><path d="M0 70 L98 63 L196 56 L294 23 L392 49 L490 24" fill="none" stroke="#68dcd8" stroke-width="3" class="ci-draw"/><path d="M0 89 H490" stroke="#31556a" stroke-width="1"/></svg>`;
  const app = (kind, name, area, content) => `<section class="ci-window ci-${kind}" aria-label="${name} illustrative software interface">${chrome(name, area)}<div class="ci-appbody">${content}</div></section>`;

  const operations = app('ops', 'Dragonfly / Operations Control', 'Overview  /  Service profitability',
    sidebar(['◫ Overview', '▥ Financial reporting', '⌁ Route capacity', '◷ Scheduling', '◇ Quality & CX'], '◫ Overview', 'Demo dataset · Not employer records') +
    `<div class="ci-work"><div class="ci-sectionline"><strong>Operations overview</strong><small>Q3 illustrative scenario · USD</small></div><div class="ci-ops-kpis">
      ${[['MONTHLY REVENUE','$126,400','Q3 total $372,800'],['GROSS MARGIN','47.7%','Gross profit $60,250'],['OPERATING PROFIT','$36,150','After $24,100 overhead'],['ROUTE UTILIZATION','82%','18 / 22 planned slots']].map(x=>panel(`<div class="ci-pname">${x[0]}</div><b class="ci-big">${x[1]}</b><small>${x[2]}</small>`,'ci-kpi')).join('')}</div>
      <div class="ci-ops-main">${panel(`<div class="ci-sectionline"><span class="ci-pname">Revenue trend</span><span class="ci-tag">+5.9% vs prior month</span></div>${spark}<div class="ci-barlabel"><small>APR</small><small>MAY</small><small>JUN</small><small>JUL</small><small>AUG</small><small>SEP</small></div>`)}
      ${panel(`<div class="ci-pname">Cost allocation / September</div><div class="ci-barrows">${bar('Service labor','$51,250',57)}${bar('Materials & supplies','$14,900',17)}${bar('Operating overhead','$24,100',27)}</div><p class="ci-micro" style="margin:8px 0 0">Monthly cost base: $90,250</p>`)}</div>
      <div class="ci-ops-bottom">${panel(`<div class="ci-pname">September P&L snapshot</div><table class="ci-ptable"><tr><td>Revenue</td><td>$126,400</td></tr><tr><td>Direct labor + materials</td><td>($66,150)</td></tr><tr><td>Gross profit</td><td>$60,250</td></tr><tr><td>Operating expenses</td><td>($24,100)</td></tr><tr><td>Operating profit</td><td>$36,150</td></tr></table>`)}
      ${panel(`<div class="ci-pname">Field service performance</div>${bar('On-time service','96%',96)}<div style="height:11px"></div>${bar('First-time completion','92%',92)}<div class="ci-micro" style="margin-top:9px">Customer follow-up: 1.8 days avg.</div>`)}
      ${panel(`<div class="ci-pname">Tomorrow / workforce</div><div class="ci-miniwork"><span class="ci-avatar">JS</span><div><b>Northwest zone</b><small>6 scheduled visits</small></div></div><div class="ci-miniwork"><span class="ci-avatar">AK</span><div><b>Central zone</b><small>7 scheduled visits</small></div></div><span class="ci-tag">12 / 14 technicians assigned</span>`)}</div>
    </div>`);

  const task = (id, title, priority, initials, state = '') => `<div class="ci-task ${state}"><div class="ci-taskbottom"><span>#${id} · Story</span><em>${priority}</em></div><strong>${title}</strong><div class="ci-taskbottom"><span>Sprint 08</span><span class="ci-avatar">${initials}</span></div></div>`;
  const column = (title, items, count) => `<div class="ci-column"><div class="ci-coltitle">${title}<span class="ci-count">${count}</span></div>${items}</div>`;
  const project = app('project', 'Project Atlas / Delivery Board', 'Boards  /  Sprint 08',
    sidebar(['▧ Overview', '▤ Boards', '☷ Backlogs', '◫ Sprint 08', '◇ Queries', '▦ Delivery plans'], '▤ Boards','Iteration: 05–16 Oct') +
    `<div class="ci-work"><div class="ci-proj-top"><div><h3>Field Service Platform</h3><div class="ci-micro">Sprint 08 · 05–16 Oct · Delivery team</div></div><div class="ci-proj-stats"><div class="ci-proj-pill"><b>24 / 31</b>Story points</div><div class="ci-proj-pill ci-proj-progress"><b class="ci-good">77%</b>Completed</div><div class="ci-proj-pill"><b>16 Oct</b>Release review</div></div></div><div class="ci-board">
      ${column('TO DO', task(248,'Add region-level KPI filter','P2','ML') + task(253,'Confirm retry policy','P1','AK'), '4')}
      ${column('IN PROGRESS', task(241,'Route assignment rules','P1','JP','move') + task(245,'Reconcile invoice totals','P2','SR'), '3')}
      ${column('IN REVIEW', task(237,'Customer notification UAT','P1','LB','is-review') + task(239,'Export exceptions log','P2','JP','is-review'), '2')}
      ${column('DONE', task(231,'Approve service data map','P1','ML','is-done') + task(234,'Define acceptance criteria','P2','SR','is-done'), '8')}
    </div></div>`);

  const program = app('program', 'Enterprise Transformation / Program Office', 'Portfolio governance  /  Wave 02',
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

  const impl = app('impl', 'Service Transformation / Implementation Hub', 'Release readiness  /  Wave 01',
    sidebar(['◉ Readiness', '☷ Requirements', '⋈ Integrations', '▤ Data migration', '▣ Testing & UAT', '✓ Cutover'], '◉ Readiness','Go/no-go gate · Demo') +
    `<div class="ci-work"><div class="ci-impl-head"><h3>Deployment readiness review</h3><span class="ci-tag">Release candidate 1.4</span></div><div class="ci-impl-grid">
      ${panel(`<div class="ci-pname">Go-live readiness</div><div class="ci-ring">84%</div>${bar('Requirements configured','46 / 50',92)}<div style="height:12px"></div>${bar('UAT cases passed','112 / 120',93.3)}<p class="ci-micro">8 UAT cases outstanding</p>`)}
      ${panel(`<div class="ci-pname">Cutover and sign-off checklist</div><div class="ci-check passed"><span class="ci-tick">✓</span><span>Scope baseline approved</span></div><div class="ci-check passed"><span class="ci-tick">✓</span><span>Security roles verified</span></div><div class="ci-check passed"><span class="ci-tick">✓</span><span>Migration dry run #2 reconciled</span></div><div class="ci-check"><span class="ci-tick"></span><span>Business UAT sign-off pending</span></div><div class="ci-check"><span class="ci-tick"></span><span>Support handoff / go-no-go</span></div>`)}
      ${panel(`<div class="ci-pname">Interface / integration chain</div><div class="ci-flow"><span class="ci-node">Field Ops</span><span class="ci-arrow">→</span><span class="ci-node">Service API</span><span class="ci-arrow">→</span><span class="ci-node">Finance</span></div><div class="ci-pname">Open exceptions</div><div class="ci-testrow"><span>Critical defects</span><b class="ci-good">0</b></div><div class="ci-testrow"><span>High defects</span><b class="ci-warn">2</b></div><div class="ci-testrow"><span>Training complete</span><b>39 / 44</b></div>`)}
    </div></div>`);

  const code = app('code', 'Workflow Engine / Development', 'service-ops  /  local demo',
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

  const overlay = document.createElement('div');
  overlay.id = 'cinematic-intro';
  overlay.className = 'ci phase-intro';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `<div class="ci-shell"><div class="ci-top"><div class="ci-brand">JEFF PURSLEY / PORTFOLIO</div><button type="button" class="ci-skip" aria-label="Skip portfolio introduction">Skip intro ↗</button></div>
    <div class="ci-head"><div><p class="ci-kicker">MULTIPLE WORKSPACES</p><h2 class="ci-heading">Operations Control</h2></div><div class="ci-deck">Financial performance · Field capacity · Service delivery</div></div>
    <div class="ci-stage" aria-hidden="true">${operations}${project}${program}${impl}${code}</div>
    <div class="ci-progress" aria-hidden="true">${titles.map(()=>'<span></span>').join('')}</div><div class="ci-footnote">CONCEPT INTERFACES · ALL WORKSPACE SCENARIOS & DATA ARE ILLUSTRATIVE</div>
    <div class="ci-intro-title" aria-hidden="true"><div><strong>MULTIPLE<br>WORKSPACES</strong><small>ONE CONNECTED WAY OF LEADING WORK</small></div></div>
    <div class="ci-finale" aria-hidden="true"><div class="ci-finale-leader">ONE LEADER</div><div class="ci-finale-name">JEFF PURSLEY</div></div>
    <span class="ci-live" role="status" aria-live="polite" style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)"></span></div>`;
  document.body.append(overlay);
  const hero = document.querySelector('.home-hero');
  const replay = document.createElement('button');
  replay.type = 'button';
  replay.className = 'ci-replay';
  replay.textContent = '↻ Replay introduction';
  replay.setAttribute('aria-label','Replay five-workspace introduction');
  replay.style.cssText = 'display:inline-flex;align-items:center;min-height:36px;margin:16px 0 0;background:transparent;color:inherit;border:1px solid currentColor;opacity:.72;border-radius:30px;padding:7px 13px;font-size:12px;font-weight:700;cursor:pointer';
  if (hero) {
    const loc = hero.querySelector('.hero-location') || hero.querySelector('.hero-copy');
    if (loc) loc.insertAdjacentElement('afterend', replay);
  }

  const windows = [...overlay.querySelectorAll('.ci-window')];
  const indicators = [...overlay.querySelectorAll('.ci-progress span')];
  const label = overlay.querySelector('.ci-heading');
  const kicker = overlay.querySelector('.ci-kicker');
  const deck = overlay.querySelector('.ci-deck');
  const live = overlay.querySelector('.ci-live');
  const skip = overlay.querySelector('.ci-skip');
  const wait = (ms) => new Promise((resolve) => { const t = window.setTimeout(resolve, ms); timeouts.push(t); });
  const timeouts = [];
  let epoch = 0;
  let playing = false;
  let returnFocus = null;
  const safeStorage = (action, value) => { try { if (action === 'get') return window.localStorage.getItem(SEEN_KEY); window.localStorage.setItem(SEEN_KEY,value); } catch (_) { return null; } };
  const phase = (name) => { overlay.className = `ci phase-${name}`; };
  const resetProjectCard = () => {
    const moving = overlay.querySelector('.ci-project .ci-task.move');
    const columns = overlay.querySelectorAll('.ci-project .ci-column');
    if (!moving || columns.length !== 4) return;
    columns[1].insertBefore(moving, columns[1].querySelector('.ci-task'));
    columns[1].querySelector('.ci-count').textContent = '3';
    columns[2].querySelector('.ci-count').textContent = '2';
  };
  const advanceProjectCard = () => {
    const moving = overlay.querySelector('.ci-project .ci-task.move');
    const columns = overlay.querySelectorAll('.ci-project .ci-column');
    if (!moving || columns.length !== 4 || !playing) return;
    const from = moving.getBoundingClientRect();
    columns[2].appendChild(moving);
    const to = moving.getBoundingClientRect();
    if (!reduced.matches && moving.animate) moving.animate([
      {transform:`translate(${from.left-to.left}px, ${from.top-to.top}px)`,opacity:.88},
      {transform:'translate(0, 0)',opacity:1}
    ], {duration:580,easing:'cubic-bezier(.18,.74,.2,1)'});
    columns[1].querySelector('.ci-count').textContent = '2';
    columns[2].querySelector('.ci-count').textContent = '3';
  };
  const show = (index) => {
    const [a, b, c] = titles[index];
    kicker.textContent = `MULTIPLE WORKSPACES · ${a}`;
    label.textContent = b;
    deck.textContent = c;
    live.textContent = `${a}. ${b}. ${c}. Illustrative interface.`;
    windows.forEach((w, n) => { w.classList.toggle('is-active', n===index); w.classList.toggle('is-before', n<index); w.classList.toggle('is-after', n>index); });
    indicators.forEach((dot,n)=>dot.classList.toggle('sel',n===index));
    if (index===1) timeouts.push(window.setTimeout(advanceProjectCard,600));
  };
  const stop = (byUser=false) => {
    if (!playing && overlay.getAttribute('aria-hidden') === 'true') return;
    const completedEpoch = ++epoch;
    timeouts.forEach(clearTimeout); timeouts.length = 0;
    playing = false;
    phase('exit');
    window.setTimeout(() => { if (!playing && epoch === completedEpoch) overlay.className = 'ci phase-off'; }, 760);
    document.documentElement.classList.remove('ci-lock');
    overlay.setAttribute('aria-hidden','true');
    overlay.setAttribute('inert','');
    document.querySelectorAll('[data-ci-inert]').forEach(x => {x.inert=false;x.removeAttribute('data-ci-inert');});
    safeStorage('set','1');
    document.documentElement.classList.add('ci-home-arrive');
    window.setTimeout(()=>document.documentElement.classList.remove('ci-home-arrive'),950);
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus({preventScroll:true});
  };
  const play = async (manual=false) => {
    if (playing || reduced.matches) return;
    playing = true;
    returnFocus = manual ? replay : document.querySelector('.home-hero h1');
    if (returnFocus && !returnFocus.hasAttribute('tabindex')) returnFocus.setAttribute('tabindex','-1');
    document.querySelectorAll('body > *:not(#cinematic-intro)').forEach(x => {if (!x.inert) {x.inert=true;x.setAttribute('data-ci-inert','');}});
    overlay.removeAttribute('inert');
    overlay.setAttribute('aria-hidden','false');
    document.documentElement.classList.add('ci-lock');
    overlay.className='ci phase-intro';
    windows.forEach(w=>w.className=w.className.replace(/\s+is-(active|before|after)/g,''));
    resetProjectCard();
    live.textContent='Multiple workspaces. Five illustrative professional environments.';
    skip.focus({preventScroll:true});
    const run = ++epoch;
    await wait(780); if(run!==epoch)return;
    phase('work');
    for(let i=0;i<windows.length;i++) {
      show(i);
      await wait(1570); if(run!==epoch)return;
    }
    phase('shuffle'); live.textContent='Five workspaces converge.';
    await wait(890); if(run!==epoch)return;
    phase('close');
    await wait(440); if(run!==epoch)return;
    phase('leader'); live.textContent='One leader.';
    await wait(1050); if(run!==epoch)return;
    phase('name'); live.textContent='Jeff Pursley.';
    await wait(1530); if(run!==epoch)return;
    stop(false);
  };
  skip.addEventListener('click',()=>stop(true));
  replay.addEventListener('click',()=>play(true));
  overlay.addEventListener('keydown',(e)=>{ if(e.key==='Escape') {e.preventDefault();stop(true);} if(e.key==='Tab'){e.preventDefault();skip.focus();} });
  reduced.addEventListener?.('change',(e)=>{if(e.matches)stop(false);});
  // Never intercept hash navigation, internal page-to-page links, or return visits.
  let fromOwnSite = false;
  try { fromOwnSite = !!document.referrer && new URL(document.referrer).origin===location.origin; } catch(_) { /* external referrer */ }
  if(!reduced.matches && !safeStorage('get') && !fromOwnSite) play(false);
})();

