/**
 * Many Workspaces -> One Manager -> Jeff Pursley
 * Lightweight homepage overlay, 12 authentic software-inspired demo screenshots.
 * All artwork is local; no dependencies, video streaming, or third-party APIs.
 */
(() => {
  'use strict';
  const SEEN_KEY = 'jp-many-workspaces-intro-v1';
  const TIMING = { travel: 4550, manager: 1200, name: 1650, fade: 650 };
  const pathname = location.pathname.replace(/\/+$/, '') || '/';
  const forcePreview = new URLSearchParams(location.search).get('intro') === '1';
  const isPreview = pathname.endsWith('/preview.html');
  if ((pathname !== '/' && pathname !== '/index.html' && !isPreview) || location.hash || (location.search && !forcePreview)) return;
  const hero = document.querySelector('.home-hero');
  if (!hero) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  const groups = [
    [
      ['Operations Manager', '01_operations_manager_dynamics_365_field_service.webp', 'Dynamics 365 Field Service'],
      ['Project Manager', '02_project_manager_microsoft_planner.webp', 'Microsoft Planner'],
      ['Program Manager', '03_program_manager_planview.webp', 'Planview'],
      ['Implementation Specialist', '04_implementation_specialist_servicenow_jira.webp', 'ServiceNow and Jira']
    ],
    [
      ['Revenue Management', '05_revenue_management_power_bi.webp', 'Power BI'],
      ['Supply Chain', '06_supply_chain_sap_ibp.webp', 'SAP Integrated Business Planning'],
      ['Budgeting', '07_budgeting_excel_power_bi.webp', 'Microsoft Excel and Power BI'],
      ['Business Systems', '08_business_systems_power_platform.webp', 'Microsoft Power Platform']
    ],
    [
      ['Process Automation', '09_process_automation_power_automate.webp', 'Power Automate'],
      ['Leadership', '10_leadership_teams_power_bi.webp', 'Microsoft Teams and Power BI'],
      ['AI Implementation', '11_ai_implementation_copilot_studio.webp', 'Microsoft Copilot Studio'],
      ['Scrum', '12_scrum_jira.webp', 'Jira Software']
    ]
  ];
  const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const imageUrl = file => 'assets/workspaces/' + file;
  const card = ([label, filename, software]) =>
    '<figure class="ws-card"><img src="' + imageUrl(filename) + '" alt="' + escape(software) + ' demo interface" width="1000" height="563" decoding="async" loading="eager">' +
    '<figcaption class="ws-card-label">' + escape(label) + '</figcaption></figure>';
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
    '<button type="button" class="ws-skip">Skip intro <span aria-hidden="true">↗</span></button></div>',
    '<div class="ws-stage" aria-hidden="true">',
    ...groups.map((list, i) => '<div class="ws-row ws-row-' + (i + 1) + '" data-dir="' + (i === 1 ? 'left' : 'right') + '"><div class="ws-track">' + list.map(card).join('') + '</div></div>'),
    '<div class="ws-vignette"></div>',
    '<div class="ws-title-plate"><div class="ws-rule"></div><div class="ws-title ws-title-many">MANY<br>WORKSPACES</div>',
    '<div class="ws-title ws-title-manager">ONE MANAGER</div>',
    '<div class="ws-title ws-title-name">JEFF PURSLEY</div><div class="ws-rule"></div></div>',
    '</div>',
    '<div class="ws-foot"><span>12 DISCIPLINES · 1 CONNECTED APPROACH</span><span class="ws-counter">01 / 12</span></div>',
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

  let running = false, generation = 0, returnFocus = null;
  const timers = new Set();
  const skip = overlay.querySelector('.ws-skip');
  const live = overlay.querySelector('.ws-live');
  const counter = overlay.querySelector('.ws-counter');
  function storage(mode) {
    try { if (mode === 'read') return localStorage.getItem(SEEN_KEY); localStorage.setItem(SEEN_KEY, '1'); }
    catch (_) { /* Storage may be disabled. */ }
    return null;
  }
  function wait(ms) {
    return new Promise(resolve => {
      const timer = { id: 0, resolve };
      timer.id = setTimeout(() => { timers.delete(timer); resolve(); }, ms);
      timers.add(timer);
    });
  }
  function clearWaits() {
    for (const timer of timers) { clearTimeout(timer.id); timer.resolve(); }
    timers.clear();
  }
  // Move one card's width on desktop (3 visible) and two widths on mobile (2 visible).
  // This ensures the fourth card from each row is fully seen before the title changes.
  function layoutTracks() {
    const narrow = matchMedia('(max-width: 700px)').matches;
    for (const row of overlay.querySelectorAll('.ws-row')) {
      const track = row.querySelector('.ws-track');
      const first = track.querySelector('.ws-card');
      if (!first) continue;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      row.style.setProperty('--travel', Math.round((first.getBoundingClientRect().width + gap) * (narrow ? 2 : 1)) + 'px');
    }
  }
  function phase(next) { overlay.className = 'ws-intro ws-' + next; }
  function finish(skipped = false) {
    if (!running) return;
    running = false;
    generation++;
    clearWaits();
    overlay.classList.add('ws-fading');
    overlay.inert = true;
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('ws-locked');
    for (const element of document.querySelectorAll('[data-ws-inert]')) {
      element.inert = false;
      element.removeAttribute('data-ws-inert');
    }
    storage('write');
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
    setTimeout(() => { if (!running) phase('off'); }, skipped ? 250 : TIMING.fade);
  }
  async function play(manual = false) {
    if (running || reduced.matches) return;
    clearWaits();
    const token = ++generation;
    running = true;
    returnFocus = manual ? replay : heading;
    if (returnFocus === heading && !heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    for (const element of document.querySelectorAll('body > *:not(#cinematic-intro)')) {
      if (!element.inert) { element.inert = true; element.setAttribute('data-ws-inert', ''); }
    }
    overlay.inert = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('ws-locked');
    phase('prepare');
    layoutTracks();
    // Restart each time, even when replaying a previously completed animation.
    void overlay.offsetWidth;
    phase('moving');
    live.textContent = 'Many workspaces.';
    skip.focus({ preventScroll: true });
    const start = performance.now();
    const ticker = setInterval(() => {
      if (!running || token !== generation) { clearInterval(ticker); return; }
      counter.textContent = String(Math.min(12, Math.max(1, Math.ceil(9 * (performance.now() - start) / TIMING.travel) + 3))).padStart(2, '0') + ' / 12';
    }, 180);
    await wait(TIMING.travel); clearInterval(ticker); if (token !== generation) return;
    counter.textContent = '12 / 12';
    phase('manager'); live.textContent = 'One manager.';
    await wait(TIMING.manager); if (token !== generation) return;
    phase('name'); live.textContent = 'Jeff Pursley.';
    await wait(TIMING.name); if (token !== generation) return;
    finish();
  }
  skip.addEventListener('click', () => finish(true));
  replay.addEventListener('click', () => play(true));
  overlay.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); finish(true); }
    if (e.key === 'Tab') { e.preventDefault(); skip.focus(); }
  });
  reduced.addEventListener?.('change', e => { if (e.matches) finish(true); });
  addEventListener('resize', () => { if (!running) layoutTracks(); });
  let fromOwnSite = false;
  try { fromOwnSite = Boolean(document.referrer) && new URL(document.referrer).origin === location.origin; } catch (_) {}
  const nav = performance.getEntriesByType?.('navigation')?.[0];
  const reload = nav?.type === 'reload';
  if (!reduced.matches && (forcePreview || reload || (!storage('read') && !fromOwnSite))) play();
})();
