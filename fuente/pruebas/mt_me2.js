const {chromium}=require("playwright");
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1280,height:900}});
const errs=[];pg.on("pageerror",e=>errs.push("PAGEERR "+e.message));
await pg.route(/mathjax|googleapis|gstatic/,r=>r.abort());await pg.route(/mathjs/,r=>r.fulfill({path:"mat/node_modules/mathjs/lib/browser/math.js",contentType:"application/javascript"}));
await pg.goto("http://localhost:8767/materias/matematicas-economicas.html");await pg.waitForTimeout(800);
const ids=await pg.evaluate(()=>ALL.map(s=>s.id));console.log(ids.join(","));
const bad=()=>pg.evaluate(()=>{const L=document.querySelector("#lesson"),t=L.innerText;return [...L.querySelectorAll(".err")].map(x=>x.textContent).join("|")+(/NaN|undefined|Infinity/.test(t)?" NaN:"+(t.match(/.{0,60}(NaN|undefined|Infinity).{0,30}/)||[""])[0]:"")+([...L.querySelectorAll(".plot svg")].some(s=>!s.querySelector("path"))?" EMPTYPLOT":"")});
for(const id of ids){await pg.evaluate(i=>{location.hash=i},id);await pg.waitForTimeout(300);let r=await bad();if(r)console.log(id,"initial",r);
  const n=await pg.locator("#sim .seg button").count();
  for(let k=0;k<n;k++){const btn=pg.locator("#sim .seg button").nth(k);if(!(await btn.isVisible()))continue;await btn.click();await pg.waitForTimeout(120);r=await bad();if(r)console.log(id,"seg",k,(await btn.innerText()),r)}
  // move every range to min and max
  const rs=await pg.locator("#sim input[type=range]").count();
  for(let k=0;k<rs;k++){for(const which of ["min","max"]){const id=await pg.evaluate(([k,w])=>{const r=document.querySelectorAll("#sim input[type=range]")[k];if(!r)return"";r.dataset.v0=r.value;r.value=r[w];r.dispatchEvent(new Event("input",{bubbles:true}));return r.id},[k,which]);
    const rr=await bad();if(rr&&!/err/.test(rr))console.log(id,which,rr.slice(0,160));
    await pg.evaluate(k=>{const r=document.querySelectorAll("#sim input[type=range]")[k];if(!r)return;r.value=r.dataset.v0;r.dispatchEvent(new Event("input",{bubbles:true}))},k)}}
}
console.log("errs",errs.slice(0,10));await b.close()})();
