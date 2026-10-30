// Economiapp · cálculo simbólico en el navegador.
// Motor exacto: SymPy (el mismo de la app de Streamlit) corriendo con Pyodide; se carga la primera vez que se usa.
// Motor de respaldo: math.js con métodos numéricos, para mostrar resultados aproximados mientras carga SymPy
// o si no se puede cargar.
const CAS_PY = "# Economiapp · Matemáticas: las mismas operaciones de SymPy que pages/1_Matematicas.py.\n# Se ejecuta en el navegador con Pyodide; cada función devuelve un JSON con fórmulas en LaTeX.\nimport json\nimport sympy as sp\nfrom sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application, convert_xor\n_TR = standard_transformations + (implicit_multiplication_application, convert_xor)\n\nx = sp.Symbol('x')\n_LOC = {'x': x, 'e': sp.E, 'E': sp.E, 'pi': sp.pi, 'ln': sp.log, 'oo': sp.oo, 'inf': sp.oo, 'infinito': sp.oo}\n\n\ndef _expr(s):\n    return parse_expr(str(s).replace('X', 'x').replace('∞', 'oo'), local_dict=dict(_LOC), transformations=_TR)\n\n\ndef _num(v):\n    try:\n        if v.is_infinite:\n            return None\n        f = complex(v.evalf())\n        return f.real if abs(f.imag) < 1e-12 else None\n    except Exception:\n        return None\n\n\ndef _out(d):\n    return json.dumps(d)\n\n\ndef limite(fs, ts):\n    try:\n        f = _expr(fs)\n        t = _expr(ts)\n        inf = bool(t.is_infinite)\n        L = sp.limit(f, x, t) if not inf else sp.limit(f, x, t)\n        if inf:\n            Li = Ld = L\n        else:\n            Li = sp.limit(f, x, t, dir='-')\n            Ld = sp.limit(f, x, t, dir='+')\n        existe = (Li == Ld) and not (L.has(sp.zoo) or L == sp.nan)\n        # Evaluación directa sin cancelar factores (la app usaba cancel(), que ocultaba el 0/0)\n        num, den = sp.fraction(sp.together(f))\n        caso, simp = 'directo', None\n        if not inf:\n            vn = sp.simplify(num.subs(x, t))\n            vd = sp.simplify(den.subs(x, t))\n            if vd == 0 and vn == 0:\n                caso = 'indeterminado'\n                simp = sp.latex(sp.simplify(f))\n            elif vd == 0:\n                caso = 'asintota'\n            dir_txt = [sp.latex(vn), sp.latex(vd)]\n        else:\n            caso, dir_txt = 'infinito', None\n        return _out({'ok': True, 'f': sp.latex(f), 't': sp.latex(t), 'inf': inf,\n                     'L': sp.latex(L), 'Li': sp.latex(Li), 'Ld': sp.latex(Ld),\n                     'Ln': _num(L), 'existe': bool(existe), 'caso': caso,\n                     'eval': dir_txt, 'simp': simp})\n    except Exception as e:\n        return _out({'ok': False, 'error': str(e)})\n\n\ndef optimiza(fs):\n    try:\n        f = _expr(fs)\n        d1 = sp.diff(f, x)\n        d2 = sp.diff(d1, x)\n        crudos = sp.solve(d1, x)\n        pts = []\n        for p in crudos:\n            pn = _num(p)\n            if pn is None or sp.im(p) != 0:\n                continue\n            c = d2.subs(x, p)\n            cn = _num(c)\n            tipo = 'max' if cn is not None and cn < -1e-12 else 'min' if cn is not None and cn > 1e-12 else 'inconcluso'\n            fv = f.subs(x, p)\n            pts.append({'x': sp.latex(sp.nsimplify(p) if p.is_Float else p), 'xn': pn,\n                        'f2': sp.latex(sp.simplify(c)), 'f2n': cn, 'tipo': tipo,\n                        'fx': sp.latex(sp.simplify(fv)), 'fxn': _num(fv)})\n        pts.sort(key=lambda q: q['xn'])\n        return _out({'ok': True, 'f': sp.latex(f), 'd1': sp.latex(d1), 'd2': sp.latex(d2), 'pts': pts})\n    except Exception as e:\n        return _out({'ok': False, 'error': str(e)})\n\n\ndef integra(fs, a, b):\n    try:\n        f = _expr(fs)\n        A = sp.nsimplify(_expr(a))\n        B = sp.nsimplify(_expr(b))\n        F = sp.integrate(f, x)\n        if F.has(sp.Integral):\n            return _out({'ok': False, 'error': 'SymPy no encontró una antiderivada elemental para esta función.'})\n        area = sp.simplify(sp.integrate(f, (x, A, B)))\n        eb = sp.simplify(F.subs(x, B))\n        ea = sp.simplify(F.subs(x, A))\n        return _out({'ok': True, 'f': sp.latex(f), 'F': sp.latex(F), 'a': sp.latex(A), 'b': sp.latex(B),\n                     'Fb': sp.latex(eb), 'Fa': sp.latex(ea), 'area': sp.latex(area), 'arean': _num(area)})\n    except Exception as e:\n        return _out({'ok': False, 'error': str(e)})\n";
const PYO = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
const CAS = {
  state: "idle", py: null, subs: [],
  on(fn) { this.subs.push(fn) },
  set(s) { this.state = s; this.subs.forEach(f => { try { f(s) } catch (e) {} }) },
  load() {
    if (this.state !== "idle") return this.p;
    this.set("loading");
    this.p = new Promise(res => {
      let done = false;
      const fail = () => { if (!done) { done = true; this.set("error"); res(false) } };
      const timer = setTimeout(fail, 90000);
      const s = document.createElement("script");
      s.src = PYO + "pyodide.js";
      s.onerror = () => { clearTimeout(timer); fail() };
      s.onload = async () => {
        try {
          const py = await loadPyodide({ indexURL: PYO });
          await py.loadPackage("sympy");
          py.runPython(CAS_PY);
          if (done) return;
          done = true; clearTimeout(timer); this.py = py; this.set("ready"); res(true);
        } catch (e) { clearTimeout(timer); fail() }
      };
      document.head.appendChild(s);
    });
    return this.p;
  },
  call(fn, ...args) {
    const f = this.py.globals.get(fn);
    try { return JSON.parse(f(...args.map(String))) } finally { if (f && f.destroy) f.destroy() }
  }
};

// ---------- Motor numérico de respaldo (math.js)
const NUM = {
  src(s) { return String(s).replace(/\*\*/g, "^").replace(/X/g, "x").replace(/∞/g, "Infinity").replace(/\bln\(/g, "log(").replace(/\binfinito\b|\boo\b|\binf\b/gi, "Infinity") },
  parse(s) { const node = math.parse(NUM.src(s)), c = node.compile(); return { node, f: x => { try { const v = c.evaluate({ x }); return typeof v === "number" ? v : (v && typeof v.re === "number" && Math.abs(v.im) < 1e-12 ? v.re : NaN) } catch (e) { return NaN } } } },
  tex(node) { try { return node.toTex({ parenthesis: "auto", implicit: "hide" }) } catch (e) { return node.toString() } },
  d(node) { try { return math.simplify(math.derivative(node, "x")) } catch (e) { return math.derivative(node, "x") } },
  target(s) { const t = NUM.src(s).trim(); if (/^[+-]?Infinity$/.test(t)) return t.startsWith("-") ? -Infinity : Infinity; return math.evaluate(t) },
  side(f, a, sg) {
    const vals = []; for (let k = 2; k <= 9; k++) { const h = 10 ** -k; vals.push(f(a + sg * h)) }
    const last = vals.slice(-3);
    if (last.some(v => !isFinite(v))) return last.every(v => v === Infinity || v > 1e12) ? Infinity : last.every(v => v === -Infinity || v < -1e12) ? -Infinity : NaN;
    if (Math.abs(last[2]) > 1e7 && Math.abs(last[2]) > 5 * Math.abs(last[0])) return last[2] > 0 ? Infinity : -Infinity;
    return Math.abs(last[2] - last[1]) < 1e-4 * Math.max(1, Math.abs(last[2])) ? last[2] : NaN;
  },
  limit(s, t) {
    const { node, f } = NUM.parse(s), a = NUM.target(t);
    if (!isFinite(a)) { const sg = a > 0 ? 1 : -1, v = [6, 8, 10].map(k => f(sg * 10 ** k)); const L = v.every(x => x > 1e9) ? Infinity : v.every(x => x < -1e9) ? -Infinity : Math.abs(v[2] - v[1]) < 1e-5 * Math.max(1, Math.abs(v[2])) ? v[2] : NaN; return { f: NUM.tex(node), a, inf: true, Li: L, Ld: L, L, existe: !isNaN(L) } }
    const Li = NUM.side(f, a, -1), Ld = NUM.side(f, a, 1), same = (Li === Ld) || (isFinite(Li) && isFinite(Ld) && Math.abs(Li - Ld) < 1e-4 * Math.max(1, Math.abs(Li)));
    return { f: NUM.tex(node), a, inf: false, Li, Ld, L: same ? Ld : NaN, existe: same && !isNaN(Ld), fa: f(a) };
  },
  optimize(s) {
    const { node } = NUM.parse(s), d1 = NUM.d(node), d2 = NUM.d(d1), g = d1.compile(), h = d2.compile(), F = node.compile();
    const ev = (c, x) => { try { const v = c.evaluate({ x }); return typeof v === "number" ? v : NaN } catch (e) { return NaN } };
    const grid = []; for (let i = 0; i <= 4000; i++) grid.push(-100 + i * 0.05); for (let i = 0; i <= 2000; i++) grid.push(-1000 + i);
    grid.sort((p, q) => p - q); for (let i = grid.length - 1; i > 0; i--) if (Math.abs(grid[i] - grid[i - 1]) < 1e-9) grid.splice(i, 1);
    const roots = [];
    const add = r => { if (isFinite(r) && !roots.some(x => Math.abs(x - r) < 1e-6 * Math.max(1, Math.abs(r)))) roots.push(r) };
    for (let i = 0; i < grid.length; i++) {
      const x0 = grid[i], v0 = ev(g, x0); if (v0 === 0 && (ev(g, x0 - 0.01) !== 0 || ev(g, x0 + 0.01) !== 0)) add(x0);
      if (i + 1 < grid.length) { const x1 = grid[i + 1], v1 = ev(g, x1);
        if (isFinite(v0) && isFinite(v1) && v0 * v1 < 0) { let lo = x0, hi = x1, flo = v0; for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2, fm = ev(g, m); if (flo * fm <= 0) hi = m; else { lo = m; flo = fm } } add((lo + hi) / 2) } }
    }
    // raíces dobles: mínimos locales de |f'| que tocan cero
    for (let i = 1; i + 1 < grid.length; i++) { const a = Math.abs(ev(g, grid[i - 1])), b = Math.abs(ev(g, grid[i])), c = Math.abs(ev(g, grid[i + 1]));
      if (!(b < a && b < c)) continue;
      let lo = grid[i - 1], hi = grid[i + 1]; const R = (Math.sqrt(5) - 1) / 2, A = x => Math.abs(ev(g, x));
      for (let k = 0; k < 120; k++) { const m1 = hi - R * (hi - lo), m2 = lo + R * (hi - lo); if (A(m1) < A(m2)) hi = m2; else lo = m1 }
      const xm = (lo + hi) / 2; if (A(xm) < 1e-8 * Math.max(1, Math.abs(ev(h, xm)) + Math.abs(xm))) add(xm) }
    roots.sort((p, q) => p - q);
    return { f: NUM.tex(node), d1: NUM.tex(d1), d2: NUM.tex(d2), pts: roots.slice(0, 12).map(x => { const c = ev(h, x); return { xn: x, f2n: c, fxn: ev(F, x), tipo: c < -1e-9 ? "max" : c > 1e-9 ? "min" : "inconcluso" } }) };
  },
  integral(s, a, b) {
    const { node, f } = NUM.parse(s), A = NUM.target(a), B = NUM.target(b);
    const simp = (l, r, fl, fm, fr) => (r - l) / 6 * (fl + 4 * fm + fr);
    const rec = (l, r, fl, fm, fr, whole, eps, depth) => { const m = (l + r) / 2, lm = (l + m) / 2, rm = (m + r) / 2, flm = f(lm), frm = f(rm), L = simp(l, m, fl, flm, fm), R = simp(m, r, fm, frm, fr);
      if (depth <= 0 || Math.abs(L + R - whole) <= 15 * eps) return L + R + (L + R - whole) / 15;
      return rec(l, m, fl, flm, fm, L, eps / 2, depth - 1) + rec(m, r, fm, frm, fr, R, eps / 2, depth - 1) };
    if (!isFinite(A) || !isFinite(B)) return { f: NUM.tex(node), area: NaN };
    const fa = f(A), fb = f(B), fm = f((A + B) / 2);
    const area = rec(A, B, fa, fm, fb, simp(A, B, fa, fm, fb), 1e-10, 40);
    return { f: NUM.tex(node), a: A, b: B, area };
  }
};
