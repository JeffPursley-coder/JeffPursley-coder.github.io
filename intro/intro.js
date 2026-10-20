/**
 * Many Workspaces → One Manager → Jeff Pursley.
 * Two full-bleed, opposing six-screen filmstrips of locally hosted demo interfaces.
 * Vanilla JS / CSS; original GitHub Pages portfolio stays underneath.
 */
(() => {
  'use strict';
  const SEEN_KEY = 'jp-many-workspaces-intro-v2';
  const TIMING = { travel: 6200, manager: 1150, name: 1900, fade: 650 };
  const pathname = location.pathname.replace(/\/+$/, '') || '/';
  const forced = new URLSearchParams(location.search).get('intro') === '1';
  if ((pathname !== '/' && pathname !== '/index.html') ||
      location.hash || (location.search && !forced)) return;

  const hero = document.querySelector('.home-hero');
  if (!hero) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // 12 existing, real-product-branded demo screenshots already hosted in this repo.
  // Exactly six in each row. The whole width of each track traverses the viewport.
  const groups = [
    [
      ['Operations Manager', '01_operations_manager_dynamics_365_field_service.webp', 'Dynamics 365 Field Service'],
      ['Project Manager', '02_project_manager_microsoft_planner.webp', 'Microsoft Planner'],
      ['Program Manager', '03_program_manager_planview.webp', 'Planview'],
      ['Implementation Specialist', '04_implementation_specialist_servicenow_jira.webp', 'ServiceNow + Jira'],
      ['Revenue Management', '05_revenue_management_power_bi.webp', 'Microsoft Power BI'],
      ['Supply Chain', '06_supply_chain_sap_ibp.webp', 'SAP Integrated Business Planning']
    ],
    [
      ['Budgeting', '07_budgeting_excel_power_bi.webp', 'Microsoft Excel + Power BI'],
      ['Business Systems', '08_business_systems_power_platform.webp', 'Dynamics 365 + Power Platform'],
      ['Process Automation', '09_process_automation_power_automate.webp', 'Microsoft Power Automate'],
      ['Leadership', '10_leadership_teams_power_bi.webp', 'Microsoft Teams + Power BI'],
      ['AI Implementation', '11_ai_implementation_copilot_studio.webp', 'Microsoft Copilot Studio'],
      ['Scrum', '12_scrum_jira.webp', 'Jira Software']
    ]
  ];
  const escape = value => String(value).replace(/[&<>"']/g, char =>
    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
  const card = ([role, file, product]) =>
    '<figure class="ws-card">' +
      '<img src="assets/workspaces/' + escape(file) + '" alt="' +
        escape(product) + ' fictional demo workspace" width="1672" height="941" decoding="async" loading="eager">' +
      '<div class="ws-product">' + escape(product) + '</div>' +
      '<figcaption class="ws-card-label"><span>' + escape(role) + '</span></figcaption>' +
    '</figure>';

  const overlay = document.createElement('div');
  overlay.id = 'cinematic-intro';
  overlay.className = 'ws-intro ws-off';
  overlay.inert = true;
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Many workspaces, one manager, Jeff Pursley');
  overlay.innerHTML = [
    '<div class="ws-top"><span class="ws-brand">JEFF PURSLEY <span>/ PROFESSIONAL PORTFOLIO</span></span>',
    '<button class="ws-skip" type="button">Skip intro <span aria-hidden="true">↗</span></button></div>',
    '<div class="ws-stage" aria-hidden="true">',
      '<div class="ws-row ws-row-top" data-dir="right"><div class="ws-track">' + groups[0].map(card).join('') + '</div></div>',
      '<div class="ws-row ws-row-bottom" data-dir="left"><div class="ws-track">' + groups[1].map(card).join('') + '</div></div>',
      '<div class="ws-center">',
        '<div class="ws-center-glow"></div>',
        '<div class="ws-title ws-title-many">MANY WORKSPACES</div>',
        '<div class="ws-title ws-title-manager">ONE MANAGER</div>',
        '<div class="ws-title ws-title-name">JEFF PURSLEY</div>',
      '</div>',
    '</div>',
    '<div class="ws-foot"><span>12 REAL SOFTWARE WORKSPACES · ONE CONNECTED APPROACH</span>',
      '<span>OPERATIONS · SYSTEMS · DELIVERY</span></div>',
    '<p class="ws-live" role="status" aria-live="polite"></p>'
  ].join('');
  document.body.appendChild(overlay);

  const replay = document.createElement('button');
  replay.type = 'button';
  replay.className = 'ws-replay';
  replay.textContent = '↻ Watch the intro';
  replay.setAttribute('aria-label', 'Replay the many workspaces introduction');
  const heading = hero.querySelector('.hero-copy h1');
  if (heading) heading.insertAdjacentElement('afterend', replay);
  else (hero.querySelector('.hero-copy') || hero).appendChild(replay);

  const skip = overlay.querySelector('.ws-skip');
  const live = overlay.querySelector('.ws-live');
  let running = false, generation = 0, returnFocus = null, closeTimer = null;
  const waits = new Set();

  function storage(mode) {
    try {
      if (mode === 'read') return localStorage.getItem(SEEN_KEY);
      localStorage.setItem(SEEN_KEY, '1');
    } catch (_) { /* Local storage may be disabled. */ }
    return null;
  }
  function wait(ms) {
    return new Promise(resolve => {
      const task = { id:null, resolve };
      task.id = setTimeout(() => { waits.delete(task); resolve(); }, ms);
      waits.add(task);
    });
  }
  function clearWaits() {
    for (const task of waits) { clearTimeout(task.id); task.resolve(); }
    waits.clear();
  }
  function phase(next) { overlay.className = 'ws-intro ws-' + next; }

  // Travel is the ENTIRE six-card strip minus one viewport, rather than one card.
  // That guarantees all 12 unique screens enter the viewport during the motion.
  function layoutTracks() {
    for (const row of overlay.querySelectorAll('.ws-row')) {
      const track = row.querySelector('.ws-track');
      const distance = Math.max(0, Math.ceil(track.scrollWidth - row.clientWidth));
      row.style.setProperty('--ws-distance', distance + 'px');
    }
  }
  function finish(skipped = false) {
    if (!running) return;
    running = false;
    generation++;
    clearWaits();
    overlay.classList.add('ws-fading');
    overlay.inert = true;
    overlay.setAttribute('aria-hidden','true');
    document.documentElement.classList.remove('ws-locked');
    for (const element of document.querySelectorAll('[data-ws-inert]')) {
      element.inert = false;
      element.removeAttribute('data-ws-inert');
    }
    storage('write');
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus({preventScroll:true});
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => { if (!running) phase('off'); },
      skipped ? 250 : TIMING.fade);
  }
  async function play(manual = false) {
    if (running || reduced.matches) return;
    clearTimeout(closeTimer);
    clearWaits();
    const token = ++generation;
    running = true;
    returnFocus = manual ? replay : heading;
    if (returnFocus === heading && !heading.hasAttribute('tabindex')) {
      heading.setAttribute('tabindex','-1');
    }
    for (const element of document.querySelectorAll('body > *:not(#cinematic-intro)')) {
      if (!element.inert) { element.inert = true; element.setAttribute('data-ws-inert',''); }
    }
    overlay.inert = false;
    overlay.setAttribute('aria-hidden','false');
    document.documentElement.classList.add('ws-locked');
    phase('prepare');
    layoutTracks();
    live.textContent = 'Many workspaces.';
    skip.focus({preventScroll:true});
    // Style/layout flush before beginning both transitions.
    void overlay.offsetWidth;
    await wait(60);
    if (token !== generation) return;
    phase('moving');
    await wait(TIMING.travel);
    if (token !== generation) return;
    phase('manager');
    live.textContent = 'One manager.';
    await wait(TIMING.manager);
    if (token !== generation) return;
    phase('name');
    live.textContent = 'Jeff Pursley.';
    await wait(TIMING.name);
    if (token !== generation) return;
    finish();
  }

  skip.addEventListener('click', () => finish(true));
  replay.addEventListener('click', () => play(true));
  overlay.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); finish(true); }
    if (event.key === 'Tab') { event.preventDefault(); skip.focus(); }
  });
  reduced.addEventListener?.('change', event => { if (event.matches) finish(true); });
  window.addEventListener('resize', () => { if (!running) layoutTracks(); });
  let fromOwnSite = false;
  try { fromOwnSite = Boolean(document.referrer) &&
    new URL(document.referrer).origin === location.origin; } catch (_) {}
  const nav = performance.getEntriesByType?.('navigation')?.[0];
  const reload = nav?.type === 'reload';
  if (!reduced.matches && (forced || reload || (!storage('read') && !fromOwnSite))) play();
})();