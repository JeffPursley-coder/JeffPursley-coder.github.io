import test from "node:test";
import assert from "node:assert/strict";

class FakeElement {
  constructor(tag="div"){this.tag=tag;this.dataset={};this.children=[];this.attributes={};this.textContent="";this.className="";this.events={};this.focused=false;
    this.classList={toggle:(name,on)=>{this.attributes["class-toggled-"+name]=on;}};}
  append(...nodes){this.children.push(...nodes);}
  addEventListener(type,fn){this.events[type]=fn;}
  setAttribute(k,v){this.attributes[k]=v;}
  focus(){this.focused=true;}
}
const names=["case-list","case-id","input-message","out-category","out-state","out-urgent","out-owner","out-next","out-review","out-reason","out-guard","state-badge","reset-demo"];
const elements=new Map(names.map(n=>[n,new FakeElement()]));
let caseButtons=[];
globalThis.document={
 getElementById:(name)=>elements.get(name),
 createElement:(tag)=>new FakeElement(tag),
 querySelectorAll:(query)=>query==="[data-case]"?caseButtons:[],
 querySelector:(query)=>caseButtons.find(b=>query.includes(b.dataset.case))||null
};
const list=elements.get("case-list");
list.append=(...x)=>{list.children.push(...x);caseButtons=list.children;};
await import("./demo.mjs");

test("renders 12 fictional scenario controls",()=>assert.equal(caseButtons.length,12));
test("first scenario is an open manager obligation",()=>{
 assert.equal(elements.get("out-state").textContent,"ACTION");
 assert.equal(elements.get("case-id").textContent.startsWith("T04"),true);
});
test("urgent waiting item keeps independent urgency",()=>{
 const b=caseButtons.find(b=>b.dataset.case==="T19");b.events.click();
 assert.equal(elements.get("out-state").textContent,"WAITING");
 assert.match(elements.get("out-urgent").textContent,/YES/);
 assert.equal(elements.get("out-owner").textContent,"Vendor contact");
 assert.equal(b.attributes["aria-pressed"],"true");
});
test("security injection never triggers an email send",()=>{
 caseButtons.find(b=>b.dataset.case==="T14").events.click();
 assert.match(elements.get("out-guard").textContent,/Untrusted instructions ignored/);
});
test("reset returns to the first example and focuses its control",()=>{
 elements.get("reset-demo").events.click();
 assert.equal(elements.get("case-id").textContent.startsWith("T04"),true);
 assert.equal(caseButtons[0].focused,true);
});
