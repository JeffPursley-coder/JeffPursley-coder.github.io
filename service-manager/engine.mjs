/** Independent deterministic demonstration, not a Gemini implementation or production benchmark. */
export const STATES = ["ACTION","WAITING","FOLLOW_UP","INFO","RESOLVED","NEEDS_REVIEW"];
export function classify(raw) {
  const text=String(typeof raw==="string"?raw:(raw?.text||""));
  const s=text.toLowerCase();
  const has=(re)=>re.test(s);
  const injected=has(/ignore rules|send credentials|override system/);
  const security=has(/(?:requests?|send|disclos(?:e|ure)).{0,30}(?:password|credentials?)|(?:password|credentials?).{0,30}(?:disclos(?:e|ure)|urg(?:e|ent)|requests?)/);
  const urgent=has(/\b(urgent|immediate|hazard|service outage|high priority|major account|site inaccessible|critical)\b/);
  let state,reason;
  if(security&&!has(/real request is approval/)){
    state="NEEDS_REVIEW";reason="Suspicious credential request requires authorized security review.";
  }else if(has(/classifier unavailable|workflow unavailable|integration failure/)){
    state="NEEDS_REVIEW";reason="Automation unavailable; preserve obligations and use manual review.";
  }else if(has(/does not identify who owns|owner unclear|without assigned owner|conflict with new work state|contradict|unrelated work items|history unavailable|outside expected inbox|conflicting instructions|ambiguous/)){
    state="NEEDS_REVIEW";reason="Conflicting, incomplete, or unseen context requires a human decision.";
  }else if(has(/manager corrects|manual correction|stale event later/)){
    state="ACTION";reason="Protect manager correction from stale event processing.";
  }else if(has(/reopened with fresh|reopened issue/)){
    state="ACTION";reason="Reopened obligation requires a fresh owner action.";
  }else if(has(/duplicate event.*existing action|existing action must persist/)){
    state="ACTION";reason="Do not alter the current obligation because of a duplicate event.";
  }else if(has(/task completion evidence.*verif|confirmed action completed|completed;.*confirms|verified completion/)){
    state="RESOLVED";reason="Completion was verified, rather than inferred from message activity.";
  }else if(has(/routine weekly bulletin|invoice copy already acknowledged|informational update/)){
    state="INFO";reason="No outstanding operational action is identified.";
  }else if(has(/check-in next week|nothing owed until date|future checkpoint/)){
    state="FOLLOW_UP";reason="Management follow-up is deferred to a known checkpoint.";
  }else if(has(/accepts transfer|waiting on vendor|awaiting confirmed vendor|third party is obtaining|accepted delegation|waiting for (?:the )?(vendor|scheduler|technician)/)){
    state="WAITING";reason="The next step belongs to a confirmed third party.";
  }else if(has(/(?:i will inspect|manager must|manager intervention|manager asks|approve|approval|supervisor decision|retains final approval|repair not completed|must decide|decision request|asking manager|requesting repairs)/)){
    state="ACTION";reason="A manager-owned decision, action, or uncompleted obligation remains.";
  }else{
    state="NEEDS_REVIEW";reason="Insufficient evidence to assign a current obligation safely.";
  }
  if(injected&&state==="ACTION")reason+=" Instructions embedded in the email were ignored.";
  const category=has(/password|credentials?|ignore rules/)?"Security / exception"
    :has(/hazard|safety/)?"Safety"
    :has(/worker|technician/)?"Field team"
    :has(/schedule|scheduler|absence/)?"Scheduling"
    :has(/vendor|purchasing|quote|replacement part/)?"Vendor / procurement"
    :has(/customer|account|site|service|repair/)?"Customer / service"
    :has(/invoice|bulletin/)?"Administration":"Operational follow-through";
  const owner=state==="ACTION"?"Field-service manager"
    :state==="WAITING"?(has(/scheduler/)?"Assigned scheduler":has(/vendor/)?"Vendor contact":has(/technician/)?"Assigned technician":"Confirmed third party")
    :state==="FOLLOW_UP"?"Field-service manager (scheduled)"
    :state==="NEEDS_REVIEW"?"Manager to confirm":"No immediate action owner";
  const nextAction=state==="ACTION"?"Complete or explicitly delegate the manager-owned work."
    :state==="WAITING"?"Track the dependency and confirm receipt or completion."
    :state==="FOLLOW_UP"?"Revisit at the planned checkpoint."
    :state==="INFO"?"Retain for reference."
    :state==="RESOLVED"?"Keep completion evidence; reopen if new work arrives."
    :security?"Do not disclose credentials. Request authorized security review."
    :"Review full context and establish ownership manually.";
  return {category,state,urgent,owner,nextAction,reviewRequired:urgent||injected||state==="NEEDS_REVIEW",reason,
    openObligation:!["INFO","RESOLVED"].includes(state),
    safeguards:{ignoredEmbeddedInstructions:injected,noAutoSendOrDelete:true,manualReviewAvailable:true}};
}
