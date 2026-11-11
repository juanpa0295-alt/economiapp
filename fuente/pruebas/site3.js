const {JSDOM,ResourceLoader}=require('jsdom');const path=require('path');const fs=require('fs');
const ROOT=path.resolve(__dirname,'../../docs');
class L extends ResourceLoader{fetch(url,o){if(url.startsWith('file:'))return super.fetch(url,o);if(url.includes('mathjs@'))return Promise.resolve(fs.readFileSync(__dirname+'/../mat/node_modules/mathjs/lib/browser/math.js'));return Promise.resolve(Buffer.from(''))}}
const storage={};
async function open(rel){const errs=[];
  const dom=await JSDOM.fromFile(path.join(ROOT,rel),{runScripts:"dangerously",resources:new L(),pretendToBeVisual:true,beforeParse(w){
    w.matchMedia=()=>({matches:false});w.HTMLElement.prototype.animate=function(){};w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=function(){};
    const ctx=new Proxy({},{get:(t,k)=>k==="measureText"?()=>({width:10}):k==="createLinearGradient"?()=>({addColorStop(){}}):typeof k==="string"?(()=>{}):undefined,set:()=>true});
    w.HTMLCanvasElement.prototype.getContext=()=>ctx;
    Object.defineProperty(w,'localStorage',{value:{getItem:k=>k in storage?storage[k]:null,setItem:(k,v)=>{storage[k]=String(v)},removeItem:k=>{delete storage[k]}}});
    w.addEventListener('error',e=>errs.push(e.message));w.console.error=(...a)=>errs.push(a.join(' '));}});
  await new Promise(r=>dom.window.addEventListener('load',r));return{dom,errs}}
const bad=t=>{const m=t.replace(/\s+/g,' ').match(/.{40}(NaN|undefined|\[object|Infinity).{30}/);return m?m[0]:''};
(async()=>{
  for(const p of ['index.html','materias/contabilidad.html','materias/derecho-laboral.html','materias/desarrollo-economico.html','materias/desarrollo-humano.html','materias/econometria-2.html','materias/econometria.html','materias/economia-ambiental.html','materias/economia-clasica.html','materias/economia-colombiana.html','materias/economia-institucional.html','materias/economia-internacional.html','materias/economia-politica.html','materias/epistemologia.html','materias/estadistica-1.html','materias/estadistica-2.html','materias/etica-profesional.html','materias/evaluacion-proyectos.html','materias/finanzas-corporativas.html','materias/finanzas-territoriales.html','materias/formacion-ciudadana.html','materias/fuentes-investigacion.html','materias/fundamentos-administracion.html','materias/gerencia-financiera.html','materias/historia-economica-colombia.html','materias/historia-economica.html','materias/historia-pensamiento.html','materias/ingles-1.html','materias/ingles-2.html','materias/ingles-3.html','materias/ingles-4.html','materias/introduccion-economia.html','materias/lectoescritura.html','materias/macroeconomia-1.html','materias/macroeconomia-2.html','materias/macroeconomia-3.html','materias/matematicas-1.html','materias/matematicas-2.html','materias/matematicas-3.html','materias/matematicas-economicas.html','materias/matematicas.html','materias/metodos-lineales.html','materias/microeconometria.html','materias/microeconomia-1.html','materias/microeconomia-2.html','materias/monografia.html','materias/negocios-emprendimiento.html','materias/politicas-publicas-salud.html','materias/principios-macro.html','materias/principios-micro.html','materias/teoria-juegos.html']){
    const {dom,errs}=await open(p);const w=dom.window,d=w.document;
    const ids=[...new Set([...d.querySelectorAll('[data-go]')].map(b=>b.dataset.go))];let issues=[];
    for(const id of ids){w.location.hash=id;w.dispatchEvent(new w.HashChangeEvent('hashchange'));
      const L=d.getElementById('lesson');let b=bad(L.textContent);if(b)issues.push(id+': '+b);
      const e=L.querySelector('.err');if(e)issues.push(id+' ERR: '+e.textContent);
      const sim=d.getElementById('sim');
      if(sim){for(const r of sim.querySelectorAll('input[type=range]')){const v=r.value;for(const x of [r.max,r.min,v]){r.value=x;r.dispatchEvent(new w.Event('input'))}
          b=bad(L.textContent);if(b){issues.push(id+' tras mover '+r.id+': '+b);break}}
        for(const s of sim.querySelectorAll('.seg button')){s.click();b=bad(L.textContent);if(b){issues.push(id+' tras '+s.textContent+': '+b);break}}}
      for(const c of L.querySelectorAll('.chips.pre button')){c.click();b=bad(L.textContent);const e2=L.querySelector('.err');if(b||e2){issues.push(id+' ejemplo '+c.textContent+': '+(b||e2.textContent));}}
      const tab=L.querySelector('[data-tab="stata"]');if(tab){tab.click();const pane=L.querySelector('[data-pane="stata"]');if(pane.hidden)issues.push(id+': pestaña Stata no abre')}
    }
    const tags=d.querySelectorAll('#trunk .tag').length;
    console.log(p.padEnd(32),'temas',ids.length,'| etiquetas examen',tags,'| problemas',issues.length?issues.slice(0,6):'ninguno','| errores',errs.length?errs.slice(0,3):'ninguno');
  }
  const {dom,errs}=await open('index.html');const d=dom.window.document,w=dom.window;
  console.log('portada:',[...d.querySelectorAll('.line h2')].map(h=>h.textContent).join(', '),'| próximas:',[...d.querySelectorAll('#soon div')].map(x=>x.firstChild.textContent).join(', '));
  const q=d.getElementById('q');for(const v of ['prorroga','indemnizacion','horas extra','nomina','moratoria','tobin']){q.value=v;q.dispatchEvent(new w.Event('input'));console.log(' buscar',v,'→',[...d.querySelectorAll('#res a')].map(a=>a.getAttribute('href')).join(', ')||'(nada)')}
  const missing=[];for(const f of fs.readdirSync(path.join(ROOT,'materias')).filter(f=>f.endsWith('.html'))){const h=fs.readFileSync(path.join(ROOT,'materias',f),'utf8');for(const m of h.matchAll(/(?:src|href)="([^"#]+)"/g)){if(m[1].startsWith('http'))continue;if(!fs.existsSync(path.join(ROOT,'materias',m[1])))missing.push(f+' → '+m[1])}}
  console.log('referencias rotas:',missing.length?missing:'ninguna','| errores portada:',errs.length?errs:'ninguno');
})();
