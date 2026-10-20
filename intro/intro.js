/**
 * Jeff's Brain — original homepage intro, no dependencies.
 * Edit INSTALLS and TIMING to customize. Progress is metaphorical.
 */
(() => {
  'use strict';
  const SEEN_KEY='jp-brain-intro-v1';
  const TIMING={startup:700,install:635,award:1100,ending:1450};
  const INSTALLS=[
    {action:'Learning',name:'how to make the best steak',done:'LEARNED'},
    {action:'Installing',name:'Project Management',done:'INSTALLED'},
    {action:'Installing',name:'Program Management',done:'INSTALLED'},
    {action:'Mastering',name:'Implementation',done:'MASTERED'},
    {action:'Installing',name:'Revenue Management',done:'INSTALLED'},
    {action:'Installing',name:'how to make an omelette',done:'INSTALLED'},
    {action:'Removing',name:'Bottlenecks',done:'REMOVED'},
    {action:'Mastering',name:'Supply Chain Logistics',done:'MASTERED'},
    {action:'Mastering',name:'Business Systems',done:'MASTERED'},
    {action:'Installing',name:'Accountability',done:'INSTALLED'},
    {action:'Installing',name:'Leadership',done:'INSTALLED'},
    {action:'Mastering',name:'Budgeting',done:'MASTERED'},
    {action:'Installing',name:'Dad Jokes',done:'INSTALLED',fun:'dad'},
    {action:'Installing',name:'Process Automation',done:'INSTALLED'},
    {action:'Installing',name:'1 Magic Trick',done:'INSTALLED',fun:'magic'},
    {action:'Installing',name:'SCRUM',done:'INSTALLED'},
    {action:'Installing',name:'Operational Knowledge',done:'INSTALLED'}
  ];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const pathname=location.pathname.replace(/\/+$/,'') || '/';
  const forcePreview=new URLSearchParams(location.search).get('intro')==='1';
  if((pathname!=='/'&&pathname!=='/index.html')||location.hash||(location.search&&!forcePreview))return;
  const hero=document.querySelector('.home-hero');
  if(!hero)return;

  // The silhouette path is traced from Jeff's uploaded black, raised-arms image.
  const figurePath='M93 3 L72 33 L54 70 L38 94 L30 98 L23 114 L12 122 L2 143 L0 352 L29 388 L68 420 L77 432 L78 443 L90 476 L60 544 L42 574 L44 580 L1 674 L0 700 L523 700 L462 544 L452 459 L519 456 L560 444 L560 270 L552 251 L539 236 L512 178 L495 168 L458 178 L446 184 L445 192 L448 196 L438 202 L434 210 L436 220 L458 240 L476 252 L488 255 L495 262 L508 358 L458 348 L444 340 L436 324 L417 307 L346 304 L335 298 L329 288 L342 272 L350 250 L356 246 L366 217 L366 204 L362 199 L368 158 L364 146 L345 118 L330 110 L322 102 L304 97 L278 98 L250 106 L238 114 L217 136 L211 176 L203 184 L199 194 L201 228 L212 236 L212 255 L206 258 L184 280 L167 284 L145 274 L104 265 L94 268 L78 282 L62 270 L62 253 L91 110 L102 98 L128 89 L164 56 L159 42 L151 36 L150 22 L105 3 Z';
  const overlay=document.createElement('div');
  overlay.id='cinematic-intro';
  overlay.className='jp-intro jp-off';
  overlay.inert=true;
  overlay.setAttribute('aria-hidden','true');
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Jeff Pursley introduction');
  overlay.innerHTML=[
    '<div class="jp-intro-inner">',
    '<div class="jp-top"><span class="jp-corner">JEFF PURSLEY <b>/ INITIALIZATION LAB</b></span>',
    '<button type="button" class="jp-skip">Skip intro ↗</button></div>',
    '<div class="jp-stage"><div class="jp-stage-glow"></div>',
    '<svg class="jp-cables" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">',
      '<path class="jp-wire jp-wire-a" d="M375 295 C510 300 505 192 626 184"/>',
      '<path class="jp-wire jp-wire-b" d="M372 340 C485 365 530 315 628 275"/>',
      '<path class="jp-wire jp-wire-c" d="M370 385 C540 440 539 365 626 355"/>',
      '<path class="jp-wire jp-wire-mobile" d="M475 225 C540 302 480 332 505 398"/>',
    '</svg>',
    '<div class="jp-figure-wrap"><div class="jp-figure-label">JEFF PURSLEY</div>',
      '<div class="jp-figure-frame"><svg class="jp-figure" viewBox="0 0 561 701" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
        '<defs><path id="jp-person" d="'+figurePath+'"/><clipPath id="jp-person-clip"><use href="#jp-person"/></clipPath>',
          '<linearGradient id="jp-body-light" x1="0" y1="1" x2="0.85" y2="0">',
          '<stop offset="0" stop-color="#087b70"/><stop offset=".52" stop-color="#36c8c7"/>',
          '<stop offset="1" stop-color="#a5f8ef"/></linearGradient></defs>',
        '<use href="#jp-person" fill="#03070c" stroke="#33586a" stroke-width="1.8"/>',
        '<g clip-path="url(#jp-person-clip)"><rect class="jp-person-fill" width="561" height="701" fill="url(#jp-body-light)"/>',
        '<path d="M0 590H561 M0 480H561 M0 370H561 M0 260H561 M0 150H561" class="jp-scanlines"/></g>',
        '<use href="#jp-person" fill="none" stroke="#65b4b4" stroke-width="1.5" opacity=".48"/>',
      '</svg><span class="jp-figure-spark">✦</span></div>',
      '<div class="jp-figure-foot"><span class="jp-figure-dot">●</span> PROFILE ASSEMBLY <span class="jp-figure-count">00 / 17</span></div>',
    '</div>',
    '<div class="jp-monitor-wrap"><div class="jp-monitor">',
      '<div class="jp-monitor-top"><i></i><i></i><i></i><span>jeffOS / CORE MODULES</span></div>',
      '<div class="jp-screen">',
        '<div class="jp-prompt">&gt; initializing Jeff Pursley<span class="jp-cursor">_</span></div>',
        '<div class="jp-screen-kicker">CURRENT OPERATION</div>',
        '<div class="jp-action">INITIALIZING</div>',
        '<div class="jp-module-name">Loading profile...</div>',
        '<div class="jp-progress-head"><span>PROGRESS</span><span class="jp-percent">0%</span></div>',
        '<div class="jp-bar" role="progressbar" aria-label="Current installation" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span class="jp-bar-fill"></span></div>',
        '<div class="jp-result">AWAITING INPUT</div>',
        '<div class="jp-history-label">COMPLETED MODULES</div><div class="jp-history" aria-hidden="true"></div>',
        '<div class="jp-award" aria-hidden="true"><span>PMP</span><strong>PASSED</strong><b>ABOVE TARGET</b></div>',
      '</div>',
    '</div><div class="jp-monitor-stand"></div><div class="jp-monitor-base"></div></div></div>',
    '<div class="jp-bottom"><span class="jp-bottom-status">INITIALIZING...</span><span>ONE PERSON · MANY FUNCTIONS</span></div>',
    '<div class="jp-final" aria-hidden="true"><span class="jp-final-kicker">INITIALIZATION COMPLETE</span>',
    '<h2>JEFF PURSLEY</h2><p>Many functions. One manager.</p>',
    '<span class="jp-final-online"><i></i> SYSTEM ONLINE</span></div>',
    '<p class="jp-live" role="status" aria-live="polite"></p>',
    '</div>'
  ].join('');
  document.body.appendChild(overlay);

  const replay=document.createElement('button');
  replay.type='button';replay.className='jp-replay';
  replay.textContent='↻ Watch the intro';
  replay.setAttribute('aria-label','Replay Jeff Pursley introduction');
  const heading=hero.querySelector('.hero-copy h1');
  if(heading)heading.insertAdjacentElement('afterend',replay);
  else (hero.querySelector('.hero-copy')||hero).appendChild(replay);

  const get=(selector)=>overlay.querySelector(selector);
  const skip=get('.jp-skip'),progress=get('.jp-bar'),bar=get('.jp-bar-fill');
  const percent=get('.jp-percent'),action=get('.jp-action'),moduleName=get('.jp-module-name');
  const result=get('.jp-result'),prompt=get('.jp-prompt'),history=get('.jp-history');
  const count=get('.jp-figure-count'),fill=get('.jp-person-fill'),status=get('.jp-bottom-status');
  const live=get('.jp-live');
  let running=false,generation=0,returnFocus=null;
  const timers=new Set();
  function storage(method){
    try{if(method==='read')return localStorage.getItem(SEEN_KEY);localStorage.setItem(SEEN_KEY,'1')}
    catch(_){/* Privacy modes may block storage. */}
    return null;
  }
  const wait=(ms)=>new Promise(resolve=>{
    const task={id:null,resolve};
    task.id=setTimeout(()=>{timers.delete(task);resolve()},ms);
    timers.add(task);
  });
  function clearWaits(){for(const t of timers){clearTimeout(t.id);t.resolve()}timers.clear()}
  function setProgress(pct){
    const n=Math.max(0,Math.min(100,pct));
    bar.style.width=n+'%';percent.textContent=n+'%';
    progress.setAttribute('aria-valuenow',String(n));
  }
  function setFigure(frac){fill.style.transform='scaleY('+Math.max(0,Math.min(1,frac))+')'}
  function phase(name){overlay.className='jp-intro jp-'+name}
  function finish(skipped=false){
    if(!running)return;
    running=false;generation++;clearWaits();
    overlay.inert=true;overlay.setAttribute('aria-hidden','true');
    overlay.classList.add('jp-fading');
    document.documentElement.classList.remove('jp-locked');
    for(const el of document.querySelectorAll('[data-jp-inert]')){
      el.inert=false;el.removeAttribute('data-jp-inert');
    }
    storage('write');
    if(returnFocus&&document.contains(returnFocus))returnFocus.focus({preventScroll:true});
    setTimeout(()=>{if(!running)phase('off')},skipped?250:720);
  }
  async function play(manual=false){
    if(running||reduced.matches)return;
    clearWaits();running=true;const token=++generation;
    returnFocus=manual?replay:heading;
    if(returnFocus===heading&&!heading.hasAttribute('tabindex'))heading.setAttribute('tabindex','-1');
    for(const el of document.querySelectorAll('body > *:not(#cinematic-intro)')){
      if(!el.inert){el.inert=true;el.setAttribute('data-jp-inert','')}
    }
    overlay.inert=false;overlay.setAttribute('aria-hidden','false');
    document.documentElement.classList.add('jp-locked');
    phase('running');history.replaceChildren();setFigure(0);
    count.textContent='00 / '+INSTALLS.length;setProgress(0);
    action.textContent='INITIALIZING';moduleName.textContent='Jeff Pursley profile';
    prompt.textContent='> initializing Jeff Pursley...';result.textContent='LOADING CORE MODULES';
    result.className='jp-result';status.textContent='CONNECTING...';
    live.textContent='Initializing Jeff Pursley profile.';
    skip.focus({preventScroll:true});
    await wait(TIMING.startup);if(token!==generation)return;
    for(let i=0;i<INSTALLS.length;i++){
      const item=INSTALLS[i];
      action.textContent=item.action.toUpperCase()+':';
      moduleName.textContent=item.name;
      prompt.textContent='> '+item.action.toLowerCase()+' / module_'+String(i+1).padStart(2,'0');
      result.className='jp-result';result.textContent='PROCESSING...';
      overlay.classList.toggle('jp-joke-dad',item.fun==='dad');
      overlay.classList.toggle('jp-joke-magic',item.fun==='magic');
      status.textContent='MODULE '+String(i+1).padStart(2,'0')+' OF '+INSTALLS.length;
      setProgress(0);
      const start=performance.now(),duration=TIMING.install-110;
      while(performance.now()-start<duration){
        setProgress(Math.min(99,Math.floor((performance.now()-start)/duration*100)));
        await wait(45);
        if(token!==generation)return;
      }
      setProgress(100);result.textContent=item.done;result.className='jp-result jp-complete';
      count.textContent=String(i+1).padStart(2,'0')+' / '+INSTALLS.length;
      setFigure((i+1)/INSTALLS.length);
      overlay.classList.remove('jp-cable-pulse');void overlay.offsetWidth;
      overlay.classList.add('jp-cable-pulse');
      const row=document.createElement('div');row.textContent='✓ '+item.name;
      history.prepend(row);
      while(history.children.length>3)history.lastElementChild.remove();
      live.textContent=item.name+': '+item.done+'.';
      await wait(110);if(token!==generation)return;
    }
    overlay.classList.remove('jp-joke-dad','jp-joke-magic');
    phase('award');status.textContent='CREDENTIAL CONFIRMED';
    prompt.textContent='> credential verification';live.textContent='PMP passed, above target.';
    await wait(TIMING.award);if(token!==generation)return;
    phase('finale');status.textContent='PROFILE ACTIVE';
    live.textContent='Jeff Pursley. Many functions. One manager. System online.';
    await wait(TIMING.ending);if(token!==generation)return;
    finish();
  }
  skip.addEventListener('click',()=>finish(true));
  replay.addEventListener('click',()=>play(true));
  overlay.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();finish(true)}
    if(e.key==='Tab'){e.preventDefault();skip.focus()}
  });
  reduced.addEventListener?.('change',e=>{if(e.matches)finish(true)});
  let fromOwnSite=false;
  try{fromOwnSite=Boolean(document.referrer)&&new URL(document.referrer).origin===location.origin}catch(_){}
  const nav=performance.getEntriesByType?.('navigation')?.[0];
  const reload=nav?.type==='reload';
  if(!reduced.matches&&(forcePreview||reload||(!storage('read')&&!fromOwnSite)))play(false);
})();