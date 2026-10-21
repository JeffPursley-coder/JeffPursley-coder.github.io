/**
 * Jeff's Garage Monitor — one screen, twelve real-software-inspired demo workspaces.
 * Each title stays in its own faux application chrome. The role label sits off to
 * the side with a connector; a pointer minimizes each window, then powers off.
 * All images are illustrative portfolio demos, not authenticated vendor screens.
 */
(() => {
  'use strict';
  const SEEN_KEY = 'jp-garage-monitor-v1';
  const TIMING = Object.freeze({ startup: 430, hold: 165, move: 155, click: 65, shrink: 245, gap: 55, powerOff: 585, nameHold: 1100, fade: 750 });
  const WORKSPACES = [
    { role: 'Scrum', software: 'Jira Software', file: '12_scrum_jira.webp' },
    { role: 'Project Management', software: 'Microsoft Planner', file: '02_project_manager_microsoft_planner.webp' },
    { role: 'Program Management', software: 'Planview Program Portfolio', file: '03_program_manager_planview.webp' },
    { role: 'Revenue Management', software: 'Microsoft Power BI', file: '05_revenue_management_power_bi.webp' },
    { role: 'Business Systems', software: 'Dynamics 365 + Power Platform', file: '08_business_systems_power_platform.webp' },
    { role: 'Supply Chain', software: 'SAP Integrated Business Planning', file: '06_supply_chain_sap_ibp.webp' },
    { role: 'Operations Management', software: 'Dynamics 365 Field Service', file: '01_operations_manager_dynamics_365_field_service.webp' },
    { role: 'Budgeting', software: 'Microsoft Excel + Power BI', file: '07_budgeting_excel_power_bi.webp' },
    { role: 'Implementation', software: 'ServiceNow + Jira', file: '04_implementation_specialist_servicenow_jira.webp' },
    { role: 'Process Automation', software: 'Microsoft Power Automate', file: '09_process_automation_power_automate.webp' },
    { role: 'AI Implementation', software: 'Microsoft Copilot Studio', file: '11_ai_implementation_copilot_studio.webp' },
    { role: 'Leadership', software: 'Microsoft Teams + Power BI', file: '10_leadership_teams_power_bi.webp' }
  ];
  const pathname = location.pathname.replace(/\/+$/, '') || '/';
  const forced = new URLSearchParams(location.search).get('intro') === '1';
  if ((pathname !== '/' && pathname !== '/index.html') || location.hash || (location.search && !forced)) return;
  const hero = document.querySelector('.home-hero');
  if (!hero) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Top window is most prominent. The other 11 peek out from staggered positions.
  const placements = [
    [25,19,67], [23,15,68], [27,12,66], [22,21,67], [25,16,68], [21,11,69],
    [26,20,67], [23,13,67], [28,17,66], [22,22,69], [24,10,68], [27,14,66]
  ];
  const windowMarkup = WORKSPACES.map((w,i) => {
    const [x,y,width]=placements[i];
    return '<section class="gm-window" data-index="'+i+'" style="--wx:'+x+'%;--wy:'+y+'%;--ww:'+width+'%;--stack:'+(WORKSPACES.length-i)+'" aria-label="'+esc(w.software)+' illustrative workspace">' +
      '<div class="gm-window-head"><span class="gm-app-icon">'+(i===0?'◆':i===3?'▥':i===7?'▦':'▣')+'</span>'+
      '<strong class="gm-app-name">'+esc(w.software)+'</strong>'+
      '<div class="gm-window-buttons" aria-hidden="true"><span class="gm-min">−</span><span>□</span><span>×</span></div></div>'+
      '<div class="gm-window-picture"><img src="assets/workspaces/'+esc(w.file)+'" alt="" width="1672" height="941" decoding="async" loading="eager"></div>'+
      '</section>';
  }).join('');
  const overlay = document.createElement('div');
  overlay.id = 'cinematic-intro';
  overlay.className = 'gm-intro gm-off';
  overlay.inert = true;
  overlay.setAttribute('aria-hidden','true');
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label',"Jeff's Garage workstation cinematic intro");
  overlay.innerHTML = [
    '<div class="gm-monitor">',
      '<div class="gm-screen">',
        '<div class="gm-desktop">',
          '<div class="gm-wallpaper" aria-hidden="true"><div class="gm-rings"></div></div>',
          '<div class="gm-shortcuts" aria-hidden="true">',
            '<div><b>▤</b><span>Recycle Bin</span></div><div><b>📁</b><span>File Explorer</span></div>',
            '<div><b>🌐</b><span>Google Chrome</span></div><div><b>▣</b><span>Microsoft 365</span></div>',
            '<div><b>▥</b><span>Teams</span></div>',
          '</div>',
          '<div class="gm-windows">'+windowMarkup+'</div>',
          '<div class="gm-role-callout"><span class="gm-role-text">Scrum</span><i></i></div>',
          '<div class="gm-pointer" aria-hidden="true"><svg viewBox="0 0 23 29" width="23" height="29"><path d="M3 2L19 17.5l-7.8 1 4.6 8.1-4.3 2L7.4 20l-4.4 5V2Z" fill="white" stroke="#16273c" stroke-width="1.8" stroke-linejoin="round"/></svg></div>',
          '<div class="gm-taskbar" aria-hidden="true"><span class="gm-start">⊞</span><span class="gm-search">⌕ &nbsp; Search</span>',
            '<span>▤</span><span>🌐</span><span>▦</span><span>▥</span><span>◆</span><span class="gm-tray">⌃　◕　◖))　▣</span></div>',
          '<div class="gm-crt-shut" aria-hidden="true"></div>',
        '</div>',
        '<div class="gm-copy-overlay" aria-hidden="true">',
          '<div class="gm-copy gm-copy-many">MANY WORKSPACES</div>',
          '<div class="gm-copy gm-copy-one">ONE LEADER</div>',
          '<div class="gm-copy gm-copy-name">JEFF PURSLEY</div>',
        '</div>',
      '</div>',
      '<button class="gm-skip" type="button">Skip intro ↗</button>',
      '<p class="gm-screen-reader" role="status" aria-live="polite"></p>',
    '</div>'
  ].join('');
  document.body.appendChild(overlay);
  const replay=document.createElement('button');
  replay.type='button';replay.className='gm-replay';
  replay.textContent='↻ Watch the intro';
  replay.setAttribute('aria-label',"Replay Jeff's Garage monitor introduction");
  const heading=hero.querySelector('.hero-copy h1');
  if(heading)heading.insertAdjacentElement('afterend',replay);
  else (hero.querySelector('.hero-copy')||hero).appendChild(replay);
  const q = selector => overlay.querySelector(selector);
  const skip=q('.gm-skip'),screen=q('.gm-screen'),desktop=q('.gm-desktop'),pointer=q('.gm-pointer');
  const label=q('.gm-role-text'),callout=q('.gm-role-callout'),live=q('.gm-screen-reader');
  const windows=[...overlay.querySelectorAll('.gm-window')];
  const copyBeats={many:q('.gm-copy-many'),one:q('.gm-copy-one'),name:q('.gm-copy-name')};
  function showCopy(which){
    for(const [beat,node] of Object.entries(copyBeats))node.classList.toggle('gm-copy-on',beat===which);
  }
  let running=false,generation=0,returnFocus=null,closeTimer=null;
  const waits=new Set();
  function storage(mode){
    try{if(mode==='read')return localStorage.getItem(SEEN_KEY);localStorage.setItem(SEEN_KEY,'1')}
    catch(_){/* Private browsing may block storage. */}return null;
  }
  function wait(ms){return new Promise(resolve=>{
    const entry={id:null,resolve};
    entry.id=setTimeout(()=>{waits.delete(entry);resolve()},ms);waits.add(entry);
  })}
  function cancelWaits(){for(const t of waits){clearTimeout(t.id);t.resolve()}waits.clear()}
  function phase(p){overlay.className='gm-intro gm-'+p}
  function placePointerOn(button){
    const r=button.getBoundingClientRect(),s=screen.getBoundingClientRect();
    pointer.style.left=(r.left-s.left+r.width*.46)+'px';
    pointer.style.top=(r.top-s.top+r.height*.35)+'px';
  }
  function showRole(i){
    label.textContent=WORKSPACES[i].role;
    const box=windows[i].getBoundingClientRect(),s=screen.getBoundingClientRect();
    const relativeTop=Math.max(7,Math.min(76,(box.top-s.top+s.height*.025)/s.height*100));
    callout.style.top=relativeTop+'%';
    callout.classList.add('gm-visible');
    live.textContent=WORKSPACES[i].role+'. '+WORKSPACES[i].software+'.';
  }
  function finish(skipped=false){
    if(!running)return;
    running=false;generation++;cancelWaits();
    overlay.classList.add('gm-fading');overlay.inert=true;overlay.setAttribute('aria-hidden','true');
    document.documentElement.classList.remove('gm-locked');
    for(const node of document.querySelectorAll('[data-gm-inert]')){
      node.inert=false;node.removeAttribute('data-gm-inert');
    }
    storage('write');
    if(returnFocus&&document.contains(returnFocus))returnFocus.focus({preventScroll:true});
    clearTimeout(closeTimer);
    closeTimer=setTimeout(()=>{if(!running)phase('off')},skipped?220:TIMING.fade);
  }
  async function play(manual=false){
    if(running||reduced.matches)return;
    clearTimeout(closeTimer);cancelWaits();
    running=true;const token=++generation;
    returnFocus=manual?replay:heading;
    if(returnFocus===heading&&!heading.hasAttribute('tabindex'))heading.setAttribute('tabindex','-1');
    for(const node of document.querySelectorAll('body > *:not(#cinematic-intro)')){
      if(!node.inert){node.inert=true;node.setAttribute('data-gm-inert','')}
    }
    overlay.inert=false;overlay.setAttribute('aria-hidden','false');
    document.documentElement.classList.add('gm-locked');
    phase('ready');desktop.classList.remove('gm-powering');
    showCopy(null);
    pointer.classList.remove('gm-click');
    for(const w of windows){w.classList.remove('gm-minimizing','gm-minimized','gm-active');w.style.removeProperty('--to-x');w.style.removeProperty('--to-y')}
    callout.classList.remove('gm-visible');
    pointer.style.left='46%';pointer.style.top='74%';
    live.textContent="Jeff's Garage. Twelve software workspaces.";
    skip.focus({preventScroll:true});
    await wait(TIMING.startup);if(token!==generation)return;
    for(let i=0;i<windows.length;i++){
      const w=windows[i];
      w.classList.add('gm-active');
      if(i===0)showCopy('many');
      if(i===6)showCopy('one');
      showRole(i);
      const button=w.querySelector('.gm-min');
      await wait(TIMING.hold);if(token!==generation)return;
      placePointerOn(button);
      await wait(TIMING.move);if(token!==generation)return;
      pointer.classList.add('gm-click');button.classList.add('gm-pressed');
      await wait(TIMING.click);if(token!==generation)return;
      pointer.classList.remove('gm-click');button.classList.remove('gm-pressed');
      const rect=w.getBoundingClientRect(),s=screen.getBoundingClientRect();
      const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
      w.style.setProperty('--to-x',(s.left+s.width*.47-cx)+'px');
      w.style.setProperty('--to-y',(s.top+s.height*.93-cy)+'px');
      w.classList.add('gm-minimizing');
      callout.classList.remove('gm-visible');
      await wait(TIMING.shrink);if(token!==generation)return;
      w.classList.add('gm-minimized');w.classList.remove('gm-active');
      await wait(TIMING.gap);if(token!==generation)return;
    }
    live.textContent='All twelve workspaces minimized. Monitor powering off.';
    pointer.style.left='98%';pointer.style.top='82%';
    callout.classList.remove('gm-visible');
    desktop.classList.add('gm-powering');
    await wait(TIMING.powerOff);if(token!==generation)return;
    showCopy('name');
    live.textContent='Jeff Pursley.';
    await wait(TIMING.nameHold);if(token!==generation)return;
    phase('vanish');
    live.textContent='Opening Jeff Pursley portfolio.';
    await wait(TIMING.fade);if(token!==generation)return;
    finish();
  }
  skip.addEventListener('click',()=>finish(true));
  replay.addEventListener('click',()=>play(true));
  overlay.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();finish(true)}
    if(e.key==='Tab'){e.preventDefault();skip.focus()}
  });
  reduced.addEventListener?.('change',e=>{if(e.matches)finish(true)});
  let ownSite=false;
  try{ownSite=Boolean(document.referrer)&&new URL(document.referrer).origin===location.origin}catch(_){}
  const navigation=performance.getEntriesByType?.('navigation')?.[0];
  const reload=navigation?.type==='reload';
  if(!reduced.matches&&(forced||reload||(!storage('read')&&!ownSite)))play();
})();