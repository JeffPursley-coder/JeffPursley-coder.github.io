// No dependencies: structural and link checks for the public portfolio.
import {readFileSync,readdirSync,statSync,existsSync} from "node:fs";
import {dirname,resolve,extname,join} from "node:path";
import {fileURLToPath} from "node:url";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const htmls=readdirSync(root).filter(f=>f.endsWith(".html")&&f!=="waypoint.html");
const failures=[];
function fail(file,msg){failures.push(file+": "+msg)}
function attr(text,key){return [...text.matchAll(new RegExp("(?:^|\\s)"+key+"\\s*=\\s*[\\\"']([^\\\"']*)[\\\"']","gi"))].map(m=>m[1]);}
function checkFile(path,html){
 const ids=[...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(x=>x[1]);const unique=new Set(ids);
 if(unique.size!==ids.length)fail(path,"duplicate id");
 const h1=(html.match(/<h1(?=[\s>])/gi)||[]).length;
 if(h1!==1)fail(path,"expected one h1; found "+h1);
 if(!/<title>[^<]+<\/title>/i.test(html))fail(path,"missing page title");
 if(!/<meta[^>]+(?:name=["']description["']|content=["'][^"']+["'][^>]+name=["']description["'])/i.test(html))fail(path,"missing meta description");
 for(const m of html.matchAll(/<img\b[^>]*>/gi))if(!/\balt\s*=/.test(m[0]))fail(path,"image missing alt: "+m[0].slice(0,75));
 for(const m of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)){
  const value=m[1];
  if(/^(?:https?:|mailto:|tel:|data:|javascript:|#|\/\/)/i.test(value)){
   if(value.startsWith("#")&&value.length>1){const frag=decodeURIComponent(value.slice(1));if(!unique.has(frag))fail(path,"missing same-page target: #"+frag)}
   continue;
  }
  const [filePart,frag]=value.split("#");
  const local=filePart.split("?")[0];if(!local)continue;
  const disk=resolve(root,dirname(path),local);
  const target=existsSync(disk)&&statSync(disk).isDirectory()?join(disk,"index.html"):disk;
  if(!target.startsWith(root+"/")&&!target.startsWith(root+"\\\\")) {fail(path,"path outside repo: "+value);continue;}
  if(!existsSync(target)){fail(path,"missing local target: "+value);continue;}
  if(frag&&extname(target)===".html"){
   const linked=readFileSync(target,"utf8");
   if(!linked.includes('id="'+decodeURIComponent(frag)+'"')&&!linked.includes("id='"+decodeURIComponent(frag)+"'"))fail(path,"missing target anchor: "+value);
  }
 }
 const opening=(html.match(/<section(?=[\s>])/gi)||[]).length;
 const closing=(html.match(/<\/section\s*>/gi)||[]).length;
 if(opening!==closing)fail(path,"unbalanced sections "+opening+"/"+closing);
}
for(const path of htmls)checkFile(path,readFileSync(join(root,path),"utf8"));
const css=readFileSync(join(root,"styles.css"),"utf8").replace(/\/\*[\s\S]*?\*\//g,"");
let depth=0;for(const c of css){if(c==="{")depth++;else if(c==="}")depth--;if(depth<0){fail("styles.css","extra closing CSS brace");break;}}
if(depth!==0)fail("styles.css","unclosed CSS brace");
if(failures.length){console.error(failures.join("\n"));process.exit(1)}
console.log("Site integrity PASS: "+htmls.length+" top-level HTML pages; links, anchors, h1, titles, alt text, section balance and CSS braces checked.");
