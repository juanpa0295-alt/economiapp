// Economiapp · botones flotantes «Opinar» y «Compartir» (portada y todas las materias).
// La configuración (formulario de Google) la inyecta build.py en window.ECO.
(function () {
  const C = window.ECO || {}, F = C.form || {};
  const ev = (n, p) => { try { window.gtag && gtag("event", n, p || {}); } catch (e) {} };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const materia = () => (document.title.split(" · ")[0] || "Portada").trim();
  const PEND = "eco-opiniones-pendientes";

  const css = `.eco-fab{position:fixed;right:max(14px,env(safe-area-inset-right));bottom:max(14px,env(safe-area-inset-bottom));z-index:60;display:flex;gap:8px}
.eco-fab button{font:600 13.5px/1 var(--f-body,system-ui,sans-serif);border:1.5px solid var(--ink,#1b2430);border-radius:99px;padding:9px 14px;min-height:40px;cursor:pointer;background:var(--card,#f8f9f5);color:var(--ink,#1b2430);box-shadow:0 2px 10px rgba(0,0,0,.14)}
.eco-fab button.pri{background:var(--ink,#1b2430);color:var(--card,#f8f9f5)}
.eco-ov{position:fixed;inset:0;z-index:70;background:rgba(10,14,20,.45);display:flex;align-items:flex-end;justify-content:center;padding:12px}
@media(min-width:640px){.eco-ov{align-items:center}}
.eco-pn{background:var(--card,#f8f9f5);color:var(--ink,#1b2430);border-radius:18px;max-width:460px;width:100%;max-height:92vh;overflow:auto;padding:20px 20px 16px;font:15px/1.45 var(--f-body,system-ui,sans-serif);box-shadow:0 10px 40px rgba(0,0,0,.3)}
.eco-pn h3{margin:0 0 4px;font-size:18px}.eco-pn p.s{margin:0 0 14px;color:var(--muted,#5c6670);font-size:13.5px}
.eco-pn fieldset{border:0;margin:0 0 14px;padding:0}.eco-pn legend,.eco-pn label.t{font-weight:600;font-size:14px;margin-bottom:6px;display:block}
.eco-pn .op{display:flex;flex-wrap:wrap;gap:6px}
.eco-pn .op label{border:1.5px solid var(--rule,#cfd5cb);border-radius:99px;padding:6px 12px;cursor:pointer;font-size:13.5px;min-height:34px;display:inline-flex;align-items:center}
.eco-pn .op input{position:absolute;opacity:0;pointer-events:none}
.eco-pn .op input:checked+span{font-weight:700}
.eco-pn .op label:has(input:checked){border-color:var(--ink,#1b2430);background:var(--ink,#1b2430);color:var(--card,#f8f9f5)}
.eco-pn textarea,.eco-pn input[type=text]{width:100%;box-sizing:border-box;font:inherit;font-size:15px;border:1.5px solid var(--rule,#cfd5cb);border-radius:10px;padding:8px 10px;background:var(--paper,#edf0ea);color:inherit}
.eco-pn .bt{display:flex;gap:8px;justify-content:flex-end;margin-top:6px}
.eco-pn .bt button{font:600 14px/1 inherit;border:1.5px solid var(--ink,#1b2430);border-radius:99px;padding:9px 16px;min-height:40px;cursor:pointer;background:transparent;color:inherit}
.eco-pn .bt button.pri{background:var(--ink,#1b2430);color:var(--card,#f8f9f5)}
.eco-pn small{color:var(--muted,#5c6670);font-size:12.5px;display:block;margin-top:4px}
.eco-pn .ok{font-size:15px;padding:10px 0}
@media print{.eco-fab{display:none}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const fab = document.createElement("div"); fab.className = "eco-fab";
  const conForm = !!(F.action && F.campos);
  fab.innerHTML = (navigator.share ? `<button type="button" id="eco-sh">Compartir</button>` : `<button type="button" id="eco-sh">Copiar enlace</button>`) +
    (conForm ? `<button type="button" class="pri" id="eco-op">Opinar</button>` : "");
  const ponerFab = () => { document.body.appendChild(fab); document.body.style.paddingBottom = "70px"; };
  if (document.body) ponerFab(); else addEventListener("DOMContentLoaded", ponerFab);

  // ---------- Compartir (con etiqueta de campaña para medir el canal)
  fab.addEventListener("click", async e => {
    if (e.target.id === "eco-sh") {
      const u = new URL(location.href); u.search = "?utm_source=compartido&utm_medium=app";
      const data = { title: "Economiapp", text: `Estoy estudiando ${materia()} con Economiapp, rutas de estudio para Economía:`, url: u.toString() };
      try {
        if (navigator.share) { await navigator.share(data); ev("compartir", { materia: materia(), metodo: "nativo" }); }
        else { await navigator.clipboard.writeText(data.url); e.target.textContent = "¡Enlace copiado!"; setTimeout(() => e.target.textContent = "Copiar enlace", 1800); ev("compartir", { materia: materia(), metodo: "copiar" }); }
      } catch (err) {}
    }
    if (e.target.id === "eco-op") abrir();
  });

  // ---------- Opinar: se envía a un formulario de Google (sin servidor propio)
  const enviar = async datos => {
    const body = new URLSearchParams();
    Object.entries(F.campos).forEach(([k, entry]) => { if (datos[k]) body.append(entry, datos[k]); });
    await fetch(F.action, { method: "POST", mode: "no-cors", body });
  };
  const pendientes = () => { try { return JSON.parse(localStorage.getItem(PEND) || "[]"); } catch (e) { return []; } };
  const guardarPend = a => { try { a.length ? localStorage.setItem(PEND, JSON.stringify(a)) : localStorage.removeItem(PEND); } catch (e) {} };
  if (conForm && navigator.onLine) { const p = pendientes(); if (p.length) Promise.all(p.map(enviar)).then(() => guardarPend([])).catch(() => {}); }

  const abrir = () => {
    const ov = document.createElement("div"); ov.className = "eco-ov"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "Danos tu opinión");
    const op = (name, vals) => `<div class="op">${vals.map(v => `<label><input type="radio" name="${name}" value="${esc(v)}"><span>${esc(v)}</span></label>`).join("")}</div>`;
    ov.innerHTML = `<form class="eco-pn"><h3>¿Cómo te va con Economiapp?</h3><p class="s">Un minuto. Tu respuesta llega directo al autor y decide qué se mejora primero.</p>
      <fieldset><legend>¿Qué tan útil te ha sido ${esc(materia())}?</legend>${op("utilidad", ["1", "2", "3", "4", "5"])}<small>1 = nada útil · 5 = me salvó</small></fieldset>
      <fieldset><label class="t" for="eco-falta">¿Qué te faltó o qué arreglarías?</label><textarea id="eco-falta" name="falta" rows="3" maxlength="1500" placeholder="Un tema, un error, una idea…"></textarea></fieldset>
      <fieldset><legend>Si existiera una versión con simulacros y resolvedores para parciales, ¿pagarías por el semestre?</legend>${op("pago", ["No", "Sí, hasta $10.000", "Sí, hasta $20.000", "Sí, hasta $30.000", "Sí, más"])}</fieldset>
      <fieldset><label class="t" for="eco-contacto">Correo o WhatsApp (opcional)</label><input type="text" id="eco-contacto" name="contacto" maxlength="120" autocomplete="email"><small>Solo si quieres que te escriba para probar novedades. Se usa únicamente para eso (Ley 1581 de 2012); puedes pedir que se borre cuando quieras.</small></fieldset>
      <div class="bt"><button type="button" data-x>Cancelar</button><button type="submit" class="pri">Enviar</button></div></form>`;
    document.body.appendChild(ov);
    const cerrar = () => { ov.remove(); fab.querySelector("#eco-op")?.focus(); };
    ov.addEventListener("click", e => { if (e.target === ov || e.target.hasAttribute("data-x")) cerrar(); });
    ov.addEventListener("keydown", e => { if (e.key === "Escape") cerrar(); });
    ov.querySelector("input,textarea").focus();
    ov.querySelector("form").addEventListener("submit", async e => {
      e.preventDefault(); const fd = new FormData(e.target);
      const d = { materia: materia() + (location.hash ? " " + location.hash : ""), utilidad: fd.get("utilidad") || "", falta: (fd.get("falta") || "").trim(), pago: fd.get("pago") || "", contacto: (fd.get("contacto") || "").trim() };
      if (!d.utilidad && !d.falta && !d.pago) { e.target.querySelector(".s").innerHTML = "<b>Responde al menos una pregunta.</b>"; return; }
      try { if (!navigator.onLine) throw 0; await enviar(d); } catch (err) { guardarPend(pendientes().concat([d])); }
      ev("opinion_enviada", { materia: materia(), utilidad: d.utilidad || "sin", pago: d.pago || "sin" });
      e.target.innerHTML = `<h3>¡Gracias!</h3><p class="ok">Tu opinión ${navigator.onLine ? "ya llegó" : "se enviará cuando vuelvas a tener internet"}. Si dejaste contacto, te escribiré cuando haya novedades.</p><div class="bt"><button type="button" class="pri" data-x>Cerrar</button></div>`;
    });
  };
})();
