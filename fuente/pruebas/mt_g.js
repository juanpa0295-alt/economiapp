const {chromium}=require("playwright");
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1280,height:900}});
const errs=[];pg.on("pageerror",e=>errs.push("PAGEERR "+e.message));pg.on("console",m=>{if(m.type()==="error")errs.push(m.text())});
await pg.route(/mathjax|googleapis|gstatic/,r=>r.abort());await pg.route(/mathjs/,r=>r.fulfill({path:"mat/node_modules/mathjs/lib/browser/math.js",contentType:"application/javascript"}));
await pg.goto("http://localhost:8767/materias/economia-politica.html");await pg.waitForTimeout(800);
const ids=await pg.evaluate(()=>ALL.map(s=>s.id));console.log(ids.join(","));
const bad=()=>pg.evaluate(()=>{const L=document.querySelector("#lesson"),t=L.innerText;return [...L.querySelectorAll(".err")].map(x=>x.textContent).join("|")+(/NaN|undefined|Infinity|\[object/.test(t)?" NaN:"+(t.match(/.{0,60}(NaN|undefined|Infinity|\[object).{0,30}/)||[""])[0]:"")});
for(const id of ids){await pg.evaluate(i=>{location.hash=i},id);await pg.waitForTimeout(300);let r=await bad();if(r)console.log(id,"initial",r);
  const simEmpty=await pg.evaluate(()=>{const s=document.querySelector("#sim");return s?s.innerText.length:-1});console.log(id,"sim chars",simEmpty);
  for(const sel of ["#sim .seg button","#sim .chips button"]){const n=await pg.locator(sel).count();
  for(let k=0;k<n;k++){const btn=pg.locator(sel).nth(k);if(!(await btn.isVisible()))continue;await btn.click();await pg.waitForTimeout(150);r=await bad();if(r)console.log(id,sel,k,(await btn.innerText()),r)}}
}
console.log("errs",errs.slice(0,10));await b.close()})();
