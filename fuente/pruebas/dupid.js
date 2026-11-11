const {chromium}=require("playwright");
(async()=>{const b=await chromium.launch();const pg=await b.newPage();await pg.route(/googleapis|gstatic|mathjax/,r=>r.abort());await pg.route(/mathjs/,r=>r.fulfill({path:"mat/node_modules/mathjs/lib/browser/math.js",contentType:"application/javascript"}));
for(const m of ["microeconometria"]){await pg.goto(`http://localhost:8767/materias/${m}.html`);await pg.waitForTimeout(800);const ids=await pg.evaluate(()=>ALL.map(s=>s.id));
for(const id of ids){await pg.evaluate(i=>{location.hash=i},id);await pg.waitForTimeout(250);const n=await pg.locator("#sim .seg button").count();for(let k=-1;k<n;k++){if(k>=0){try{await pg.locator("#sim .seg button").nth(k).click({timeout:2000})}catch(e){};await pg.waitForTimeout(120)}
 const d=await pg.evaluate(()=>{const c={};document.querySelectorAll("[id]").forEach(e=>c[e.id]=(c[e.id]||0)+1);return Object.keys(c).filter(k=>c[k]>1)});if(d.length)console.log(m,id,k,d)}}}
console.log("ok");await b.close()})();
