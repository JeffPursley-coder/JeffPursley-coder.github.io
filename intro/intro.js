/**
 * Jeff's Garage Monitor — one screen, nine real-software-inspired demo workspaces.
 * Each title stays in its own faux application chrome. The role label sits off to
 * the side with a connector; its minimize icon clicks itself, then powers off.
 * All images are illustrative portfolio demos, not authenticated vendor screens.
 */
(() => {
  'use strict';
  const SEEN_KEY = 'jp-garage-monitor-v8';
  const TIMING = Object.freeze({ startup: 300, hold: 700, click: 100, shrink: 300, gap: 65, powerOff: 560, nameHold: 1400, fade: 700 });
  const CREDENTIALS = [
    { name: 'PMP', status: 'PASSED' },
    { name: 'Certified Scrum Product Owner', status: 'CERTIFIED' },
    { name: 'Certified ScrumMaster', status: 'CERTIFIED' },
    { name: 'Google Project Management', status: 'COMPLETED' },
    { name: 'BSBA, Operations Management', status: 'COMPLETED' },
    { name: 'B.S., Computer Information Systems', status: 'COMPLETED' }
  ];
  const WORKSPACES = [
    { role: 'Project Management', software: 'Microsoft Planner', file: '02_project_manager_microsoft_planner.webp' },
    { role: 'Program Management', software: 'Planview Program Portfolio', file: '03_program_manager_planview.webp' },
    { role: 'Revenue Management', software: 'Microsoft Power BI', file: '05_revenue_management_power_bi.webp' },
    { role: 'Supply Chain', software: 'SAP Integrated Business Planning', file: '06_supply_chain_sap_ibp.webp' },
    { role: 'Operations Management', software: 'Dynamics 365 Field Service', file: '01_operations_manager_dynamics_365_field_service.webp' },
    { role: 'Budgeting', software: 'Microsoft Excel + Power BI', file: '07_budgeting_excel_power_bi.webp' },
    { role: 'Implementation', software: 'ServiceNow + Jira', file: '04_implementation_specialist_servicenow_jira.webp' },
    { role: 'Process Automation', software: 'Microsoft Power Automate', file: '09_process_automation_power_automate.webp' },
    { role: 'AI Implementation', software: 'Microsoft Copilot Studio', file: '11_ai_implementation_copilot_studio.webp' }
  ];
  const pathname = location.pathname.replace(/\/+$/, '') || '/';
  const forced = new URLSearchParams(location.search).get('intro') === '1';
  if ((pathname !== '/' && pathname !== '/index.html') || location.hash || (location.search && !forced)) return;
  const hero = document.querySelector('.home-hero');
  if (!hero) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Each nearly full-screen software window stays readable; the stack peeks at the edges.
  const placements = [
    [8,9,86], [6,11,87], [9,8,86], [8,10,87], [6,9,88],
    [8,11,86], [7,8,87], [9,12,86], [6,10,88]
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
          '<svg class="gm-role-link" aria-hidden="true" preserveAspectRatio="none"><path></path><circle r="3.5"></circle></svg>',
          '<div class="gm-role-callout"><span class="gm-role-text">Project Management</span></div>',
          '<div class="gm-taskbar" aria-hidden="true"><span class="gm-start">⊞</span><span class="gm-search">⌕ &nbsp; Search</span>',
            '<span>▤</span><span>🌐</span><span>▦</span><span>▥</span><span>◆</span><span class="gm-tray">⌃　◕　◖))　▣</span></div>',
          '<div class="gm-crt-shut" aria-hidden="true"></div>',
        '</div>',
      '</div>',
      '<div class="gm-load-panel" aria-hidden="true">',
        '<div class="gm-load-head"><span class="gm-run-file"><span class="gm-run-prompt">&gt;</span> Running: <strong>JeffPursley.exe</strong></span><span class="gm-progress-number">0%</span></div>',
        '<div class="gm-progress-track"><div class="gm-progress-fill"></div></div>',
        '<div class="gm-load-details"><span class="gm-verify-name">PMP</span><span class="gm-verify-state">Status: PASSED</span></div>',
      '</div>',
      '<button class="gm-skip" type="button">Skip intro ↗</button>',
      '<p class="gm-screen-reader" role="status" aria-live="polite"></p>',
    '</div>',
    '<div class="gm-copy-overlay" aria-hidden="true"><div class="gm-copy gm-copy-name">JEFF PURSLEY</div></div>'
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
  const skip=q('.gm-skip'),screen=q('.gm-screen'),desktop=q('.gm-desktop');
  const label=q('.gm-role-text'),callout=q('.gm-role-callout'),link=q('.gm-role-link'),live=q('.gm-screen-reader');
  const windows=[...overlay.querySelectorAll('.gm-window')];
  const nameText=q('.gm-copy-name'),panel=q('.gm-load-panel');
  const progressBar=q('.gm-progress-fill'),progressText=q('.gm-progress-number');
  const credentialText=q('.gm-verify-name'),statusText=q('.gm-verify-state');
  function showName(visible){nameText.classList.toggle('gm-copy-on',visible)}
  function updateProgress(completed){
    const count=Math.max(0,Math.min(windows.length,completed));
    const value=Math.round(count/windows.length*100);
    progressBar.style.width=value+'%';
    progressText.textContent=value+'%';
    if(count===windows.length){
      credentialText.textContent='Release Status';
      statusText.textContent='READY';
      panel.classList.add('gm-load-ready');
    }else{
      const idx=Math.min(CREDENTIALS.length-1,Math.floor(count*CREDENTIALS.length/windows.length));
      const check=CREDENTIALS[idx];
      credentialText.textContent=check.name;
      statusText.textContent='Status: '+check.status;
      panel.classList.remove('gm-load-ready');
    }
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
  function showRole(i){
    label.textContent=WORKSPACES[i].role;
    // Box stays in the empty upper-right strip ABOVE the app's own titlebar.
    // This guarantees software names in the upper-left remain unobstructed.
    callout.classList.add('gm-visible');
    const s=screen.getBoundingClientRect();
    const w=windows[i].getBoundingClientRect();
    const c=callout.getBoundingClientRect();
    const startX=Math.max(2,c.left-s.left+6),startY=Math.max(2,c.bottom-s.top);
    const endX=Math.max(2,Math.min(s.width-5,w.right-s.left-13));
    const endY=Math.max(2,Math.min(s.height-5,w.top-s.top+2));
    link.setAttribute('viewBox','0 0 '+s.width+' '+s.height);
    link.querySelector('path').setAttribute('d',
      'M '+startX+' '+startY+' L '+startX+' '+(startY+7)+' L '+endX+' '+endY);
    link.querySelector('circle').setAttribute('cx',String(endX));
    link.querySelector('circle').setAttribute('cy',String(endY));
    link.classList.add('gm-visible');
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
    showName(false);updateProgress(0);
    for(const w of windows){w.classList.remove('gm-minimizing','gm-minimized','gm-active');w.style.removeProperty('--to-x');w.style.removeProperty('--to-y')}
    callout.classList.remove('gm-visible');link.classList.remove('gm-visible');
    live.textContent="Jeff's Garage. Nine software workspaces.";
    skip.focus({preventScroll:true});
    await wait(TIMING.startup);if(token!==generation)return;
    for(let i=0;i<windows.length;i++){
      const w=windows[i];
      w.classList.add('gm-active');
      showRole(i);
      const button=w.querySelector('.gm-min');
      await wait(TIMING.hold);if(token!==generation)return;
      button.classList.add('gm-pressed');
      await wait(TIMING.click);if(token!==generation)return;
      button.classList.remove('gm-pressed');
      const rect=w.getBoundingClientRect(),s=screen.getBoundingClientRect();
      const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
      w.style.setProperty('--to-x',(s.left+s.width*.47-cx)+'px');
      w.style.setProperty('--to-y',(s.top+s.height*.93-cy)+'px');
      w.classList.add('gm-minimizing');
      callout.classList.remove('gm-visible');link.classList.remove('gm-visible');
      await wait(TIMING.shrink);if(token!==generation)return;
      w.classList.add('gm-minimized');w.classList.remove('gm-active');
      updateProgress(i+1);
      live.textContent=progressText.textContent+' loaded. '+credentialText.textContent+'. '+statusText.textContent+'.';
      await wait(TIMING.gap);if(token!==generation)return;
    }
    live.textContent='JeffPursley.exe 100 percent. Release status ready.';
    await wait(700);if(token!==generation)return;
    callout.classList.remove('gm-visible');link.classList.remove('gm-visible');
    // CRT, loader and desktop disappear together; the name is a separate final card.
    overlay.classList.add('gm-shutting');
    desktop.classList.add('gm-powering');
    await wait(TIMING.powerOff);if(token!==generation)return;
    showName(true);
    live.textContent='Jeff Pursley.';
    await wait(TIMING.nameHold);if(token!==generation)return;
    overlay.classList.add('gm-vanish');
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