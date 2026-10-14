import {classify} from "./engine.mjs";
import {acceptanceCases,featuredCaseIds} from "./scenarios.mjs";
const byId=new Map(acceptanceCases.map(c=>[c.id,c]));
const list=document.getElementById("case-list");
const fields={id:"case-id",category:"out-category",state:"out-state",urgent:"out-urgent",owner:"out-owner",nextAction:"out-next",reason:"out-reason",review:"out-review"};
const put=(id,value)=>{document.getElementById(id).textContent=String(value);};
let selected=featuredCaseIds[0];
function show(id){
 const entry=byId.get(id);if(!entry)return;
 const output=classify({text:entry.text});
 selected=id;
 put("case-id",entry.id+" · Fictional operating message");
 put("input-message",entry.text);
 put("out-category",output.category);
 put("out-state",output.state.replaceAll("_"," "));
 put("out-urgent",output.urgent?"YES · Surface to manager":"NO · Routine priority");
 put("out-owner",output.owner);
 put("out-next",output.nextAction);
 put("out-review",output.reviewRequired?"YES · Human check appropriate":"NO · Routine review only");
 put("out-reason",output.reason);
 put("out-guard",output.safeguards.ignoredEmbeddedInstructions?"Untrusted instructions ignored; no action is sent.":"No messages are sent or changed.");
 document.querySelectorAll("[data-case]").forEach(b=>{
  const active=b.dataset.case===id;
  b.setAttribute("aria-pressed",String(active));b.classList.toggle("selected",active);
 });
 const badge=document.getElementById("state-badge");badge.className="state-badge "+(output.state==="NEEDS_REVIEW"?"review":output.state==="RESOLVED"?"done":"");
}
for(const id of featuredCaseIds){
 const item=byId.get(id);if(!item)continue;
 const btn=document.createElement("button");
 btn.type="button";btn.dataset.case=id;btn.className="case-button";
 const short=document.createElement("strong");short.textContent=id+" · "+item.category;
 const summary=document.createElement("small");summary.textContent=item.text;
 btn.append(short,summary);btn.addEventListener("click",()=>show(id));list.append(btn);
}
document.getElementById("reset-demo").addEventListener("click",()=>{
 show(featuredCaseIds[0]);document.querySelector('[data-case="'+featuredCaseIds[0]+'"]').focus();
});
show(selected);
