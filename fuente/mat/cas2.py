

# ===================== Funciones para Matemáticas I, II y III =====================
import re as _re
y = sp.Symbol('y')
n = sp.Symbol('n', integer=True, positive=True)
_LOC.update({'y': y, 'n': n, 'sen': sp.sin, 'tg': sp.tan, 'arcsen': sp.asin, 'arcsin': sp.asin, 'arccos': sp.acos, 'arctan': sp.atan, 'raiz': sp.sqrt})
L = sp.latex


def _abs(s):
    s = str(s)
    for _ in range(4):
        s2 = _re.sub(r'\|([^|]+)\|', r'abs(\1)', s)
        if s2 == s:
            break
        s = s2
    return s.replace('≤', '<=').replace('≥', '>=').replace('≠', '!=').replace('−', '-').replace('·', '*').replace(',', '.')


def _e(s):
    return _expr(_abs(s))


def _ok(**k):
    k['ok'] = True
    return _out(k)


def _err(e):
    return _out({'ok': False, 'error': str(e)})


def _set(S):
    try:
        if S == sp.S.EmptySet:
            return '\\varnothing'
        return L(S)
    except Exception:
        return str(S)


# ---------- Álgebra
def algebra(op, fs, gs='', a=''):
    try:
        f = _e(fs)
        if op == 'expandir':
            r = sp.expand(f)
        elif op == 'factorizar':
            r = sp.factor(f)
        elif op == 'simplificar':
            r = sp.simplify(f)
        elif op == 'parciales':
            r = sp.apart(sp.together(f), x)
        elif op == 'dividir':
            g = _e(gs)
            q, rr = sp.div(sp.Poly(f, x), sp.Poly(g, x))
            return _ok(f=L(f), g=L(g), q=L(q.as_expr()), r=L(rr.as_expr()), rz=bool(rr.is_zero))
        elif op == 'residuo':
            A = _e(a)
            v = sp.simplify(f.subs(x, A))
            p = sp.Poly(f, x)
            raices = sorted(set(sp.roots(p, filter='Q').keys()), key=lambda t: float(t)) if p.degree() > 0 else []
            return _ok(f=L(f), a=L(A), v=L(v), cero=bool(v == 0), raices=[L(t) for t in raices], fac=L(sp.factor(f)))
        else:
            return _err('operación desconocida')
        return _ok(f=L(f), r=L(r), igual=bool(sp.simplify(r - f) == 0))
    except Exception as e:
        return _err(e)


# ---------- Ecuaciones y desigualdades
def desigualdad(fs):
    try:
        rel = _e(fs)
        if not isinstance(rel, sp.core.relational.Relational):
            return _err('escribe una desigualdad con <, >, <= o >=')
        S = sp.solveset(rel, x, sp.S.Reals)
        g = rel.lhs - rel.rhs
        crit = sorted([c for c in sp.solveset(g, x, sp.S.Reals) if c.is_real], key=lambda t: float(t)) if not isinstance(sp.solveset(g, x, sp.S.Reals), sp.ConditionSet) else []
        sing = []
        try:
            sing = sorted([c for c in sp.singularities(g, x) if c.is_real], key=lambda t: float(t))
        except Exception:
            pass
        return _ok(rel=L(rel), S=_set(S), crit=[L(c) for c in crit], critn=[float(c) for c in crit], sing=[L(c) for c in sing], singn=[float(c) for c in sing], g=str(g).replace('**', '^'))
    except Exception as e:
        return _err(e)


def ecuacion(fs):
    try:
        s = _abs(fs)
        if '=' in s and not any(t in s for t in ['<=', '>=', '!=']):
            l, r = s.split('=', 1)
            eq = sp.Eq(_expr(l), _expr(r))
        else:
            eq = sp.Eq(_expr(s), 0)
        S = sp.solveset(eq, x, sp.S.Reals)
        sols, desc = [], []
        if isinstance(S, sp.FiniteSet):
            for v in sorted(S, key=lambda t: float(t)):
                okv = True
                try:
                    for side in (eq.lhs, eq.rhs):
                        z = complex(side.subs(x, v).evalf())
                        if abs(z.imag) > 1e-9:
                            okv = False
                except Exception:
                    okv = False
                (sols if okv else desc).append({'v': L(v), 'n': _num(v)})
            S = sp.FiniteSet(*[_e(str(sp.sympify(0)))]) if False else sp.FiniteSet(*[v for v in S if L(v) in [q['v'] for q in sols]])
        return _ok(eq=L(eq), S=_set(S), sols=sols, desc=desc)
    except Exception as e:
        return _err(e)


# ---------- Funciones
def funcion(fs):
    try:
        f = _e(fs)
        dom = sp.calculus.util.continuous_domain(f, x, sp.S.Reals)
        try:
            ran = sp.calculus.util.function_range(f, x, dom)
            ran = ran.replace(lambda e: e.is_number and e.is_real and not e.is_Rational and not e.is_infinite, lambda e: sp.radsimp(sp.simplify(sp.expand(e))))
            rs = _set(ran)
        except Exception:
            rs = None
        fm = sp.simplify(f.subs(x, -x))
        par = 'par' if sp.simplify(fm - f) == 0 else 'impar' if sp.simplify(fm + f) == 0 else 'ninguna'
        ceros = sp.solveset(f, x, dom)
        cz = _set(ceros) if not isinstance(ceros, sp.ConditionSet) else None
        y0 = f.subs(x, 0)
        yi = L(sp.simplify(y0)) if y0.is_finite else None
        inv = None
        try:
            sols = sp.solve(sp.Eq(y, f), x)
            if len(sols) == 1:
                inv = L(sols[0].subs(y, x))
            elif sols:
                inv = 'varias'
        except Exception:
            pass
        av = []
        try:
            for c in sp.singularities(f, x):
                if c.is_real:
                    lim = sp.limit(f, x, c, dir='+')
                    if lim.is_infinite:
                        av.append(L(c))
        except Exception:
            pass
        hz = []
        for t in [sp.oo, -sp.oo]:
            try:
                l = sp.limit(f, x, t)
                if l.is_finite and l.is_real:
                    hz.append(L(l))
            except Exception:
                pass
        return _ok(f=L(f), dom=_set(dom), ran=rs, par=par, ceros=cz, yi=yi, inv=inv, av=av, ah=sorted(set(hz)))
    except Exception as e:
        return _err(e)


def componer(fs, gs):
    try:
        f = _e(fs)
        g = _e(gs)
        return _ok(f=L(f), g=L(g), fg=L(sp.simplify(f.subs(x, g))), gf=L(sp.simplify(g.subs(x, f))))
    except Exception as e:
        return _err(e)


def identidad(ls, rs):
    try:
        a = _e(ls)
        b = _e(rs)
        d = sp.simplify(sp.trigsimp(a - b))
        return _ok(a=L(a), b=L(b), es=bool(d == 0), d=L(d), sa=L(sp.trigsimp(a)), sb=L(sp.trigsimp(b)))
    except Exception as e:
        return _err(e)


# ---------- Derivadas con reglas
def _dpasos(f, pasos, nivel=0):
    if nivel > 6 or len(pasos) > 30:
        return
    d = sp.diff(f, x)
    if not f.has(x):
        pasos.append(('Constante', L(f), '0'))
        return
    if f == x:
        return
    if f.is_Add:
        pasos.append(('Suma', L(f), ' + '.join('\\frac{d}{dx}\\left(' + L(t) + '\\right)' for t in f.args)))
        for t in f.args:
            _dpasos(t, pasos, nivel + 1)
        return
    if f.is_Mul:
        c, r = f.as_independent(x)
        if c != 1:
            pasos.append(('Constante por función', L(f), L(c) + '\\cdot\\frac{d}{dx}\\left(' + L(r) + '\\right)'))
            _dpasos(r, pasos, nivel + 1)
            return
        num, den = sp.fraction(f)
        if den != 1 and den.has(x):
            pasos.append(('Cociente', L(f), '\\frac{(' + L(sp.diff(num, x)) + ')(' + L(den) + ') - (' + L(num) + ')(' + L(sp.diff(den, x)) + ')}{(' + L(den) + ')^{2}}'))
            return
        u = f.args[0]
        v = sp.Mul(*f.args[1:])
        pasos.append(('Producto', L(f), '(' + L(sp.diff(u, x)) + ')(' + L(v) + ') + (' + L(u) + ')(' + L(sp.diff(v, x)) + ')'))
        return
    if f.is_Pow:
        b, e = f.args
        if not e.has(x):
            if b == x:
                pasos.append(('Potencia', L(f), L(e) + 'x^{' + L(e - 1) + '}'))
            else:
                pasos.append(('Potencia y cadena', L(f), L(e) + '\\left(' + L(b) + '\\right)^{' + L(e - 1) + '}\\cdot\\left(' + L(sp.diff(b, x)) + '\\right)'))
                _dpasos(b, pasos, nivel + 1)
            return
        if not b.has(x):
            pasos.append(('Exponencial de base ' + L(b), L(f), L(f) + '\\ln(' + L(b) + ')\\cdot\\left(' + L(sp.diff(e, x)) + '\\right)'))
            return
        pasos.append(('Derivación logarítmica', L(f), L(d)))
        return
    if isinstance(f, sp.exp):
        u = f.args[0]
        pasos.append(('Exponencial' + (' y cadena' if u != x else ''), L(f), L(f) + ('' if u == x else '\\cdot\\left(' + L(sp.diff(u, x)) + '\\right)')))
        if u != x:
            _dpasos(u, pasos, nivel + 1)
        return
    if isinstance(f, sp.log):
        u = f.args[0]
        pasos.append(('Logaritmo' + (' y cadena' if u != x else ''), L(f), '\\frac{1}{' + L(u) + '}' + ('' if u == x else '\\cdot\\left(' + L(sp.diff(u, x)) + '\\right)')))
        if u != x:
            _dpasos(u, pasos, nivel + 1)
        return
    if isinstance(f, (sp.sin, sp.cos, sp.tan, sp.asin, sp.acos, sp.atan, sp.cot, sp.sec, sp.csc)):
        u = f.args[0]
        base = sp.diff(type(f)(x), x).subs(x, u)
        pasos.append(('Trigonométrica' + (' y cadena' if u != x else ''), L(f), L(base) + ('' if u == x else '\\cdot\\left(' + L(sp.diff(u, x)) + '\\right)')))
        if u != x:
            _dpasos(u, pasos, nivel + 1)
        return
    pasos.append(('Regla general', L(f), L(d)))


def derivada(fs, orden='1'):
    try:
        f = _e(fs)
        pasos = []
        _dpasos(f, pasos)
        d = sp.diff(f, x)
        ds = sp.simplify(d)
        k = max(1, min(6, int(orden)))
        dk = [L(sp.simplify(sp.diff(f, x, j))) for j in range(1, k + 1)]
        return _ok(f=L(f), d=L(d), ds=L(ds), dstr=str(ds).replace('**', '^'), pasos=[{'r': a, 'de': b, 'es': c} for a, b, c in pasos], dk=dk)
    except Exception as e:
        return _err(e)


def implicita(Fs):
    try:
        s = _abs(Fs)
        if '=' in s:
            l, r = s.split('=', 1)
            F = _expr(l) - _expr(r)
        else:
            F = _expr(s)
        Fx = sp.diff(F, x)
        Fy = sp.diff(F, y)
        return _ok(F=L(F), Fx=L(Fx), Fy=L(Fy), dy=L(sp.simplify(-Fx / Fy)))
    except Exception as e:
        return _err(e)


# ---------- Análisis de la curva
def curva(fs, a='', b=''):
    try:
        f = _e(fs)
        d1 = sp.simplify(sp.diff(f, x))
        d2 = sp.simplify(sp.diff(d1, x))
        dom = sp.calculus.util.continuous_domain(f, x, sp.S.Reals)
        inc = sp.solveset(d1 > 0, x, dom)
        dec = sp.solveset(d1 < 0, x, dom)
        cu = sp.solveset(d2 > 0, x, dom)
        cd = sp.solveset(d2 < 0, x, dom)
        crit = sp.solveset(d1, x, dom)
        infl = sp.solveset(d2, x, dom)
        pts = []
        if isinstance(crit, sp.FiniteSet):
            for c in sorted(crit, key=lambda t: float(t)):
                v2 = d2.subs(x, c)
                pts.append({'x': L(c), 'xn': _num(c), 'f': L(sp.simplify(f.subs(x, c))), 'fn': _num(f.subs(x, c)), 'd2': L(sp.simplify(v2)), 'tipo': 'max' if v2.is_negative else 'min' if v2.is_positive else '?'})
        ab = None
        if a != '' and b != '':
            A, B = _e(a), _e(b)
            cand = [A, B] + [c for c in (crit if isinstance(crit, sp.FiniteSet) else []) if A <= c <= B]
            vals = [(c, sp.simplify(f.subs(x, c))) for c in cand]
            mx = max(vals, key=lambda t: float(t[1]))
            mn = min(vals, key=lambda t: float(t[1]))
            ab = {'tabla': [{'x': L(c), 'f': L(v), 'fn': _num(v)} for c, v in vals], 'max': [L(mx[0]), L(mx[1])], 'min': [L(mn[0]), L(mn[1])]}
        return _ok(f=L(f), d1=L(d1), d2=L(d2), dom=_set(dom), inc=_set(inc), dec=_set(dec), cu=_set(cu), cd=_set(cd), pts=pts,
                   infl=[L(c) for c in sorted(infl, key=lambda t: float(t))] if isinstance(infl, sp.FiniteSet) else [], ab=ab)
    except Exception as e:
        return _err(e)


# ---------- Integrales con pasos
_NOM = {'ConstantRule': 'Constante', 'PowerRule': 'Potencia', 'AddRule': 'Suma', 'ConstantTimesRule': 'Constante por función', 'URule': 'Sustitución',
        'PartsRule': 'Por partes', 'CyclicPartsRule': 'Por partes cíclica', 'ExpRule': 'Exponencial', 'ReciprocalRule': 'Recíproca (ln|u|)',
        'ArctanRule': 'Arcotangente', 'ArcsinRule': 'Arcoseno', 'RewriteRule': 'Reescribir', 'TrigSubstitutionRule': 'Sustitución trigonométrica',
        'SinRule': 'Seno', 'CosRule': 'Coseno', 'SecTanRule': 'Secante por tangente', 'CscCotRule': 'Cosecante por cotangente', 'Sec2Rule': 'Secante al cuadrado',
        'Csc2Rule': 'Cosecante al cuadrado', 'AlternativeRule': 'Alternativa', 'DontKnowRule': 'Sin regla elemental', 'DerivativeRule': 'Derivada',
        'PiecewiseRule': 'Por tramos', 'HeavisideRule': 'Heaviside', 'NestedPowRule': 'Potencia anidada', 'ErfRule': 'Función error', 'TanRule': 'Tangente', 'CotRule': 'Cotangente', 'SqrtQuadraticRule': 'Raíz de una cuadrática (fórmula)', 'ReciprocalSqrtQuadraticRule': 'Inversa de raíz de cuadrática', 'PartialFractionsRule': 'Fracciones parciales'}


def _ipasos(r, out, nivel=0):
    if r is None or len(out) > 40 or nivel > 12:
        return
    nm = type(r).__name__
    ig = getattr(r, 'integrand', None)
    item = {'r': _NOM.get(nm, nm), 'i': L(ig) if ig is not None else '', 'nivel': nivel, 'det': ''}
    try:
        if nm == 'URule':
            item['det'] = 'u = ' + L(r.u_func) + ',\\; du = ' + L(sp.diff(r.u_func, getattr(r, 'variable', x))) + '\\,dx'
        elif nm == 'PartsRule':
            item['det'] = 'u = ' + L(r.u) + ',\\; dv = ' + L(r.dv) + '\\,dx'
        elif nm == 'RewriteRule':
            item['det'] = '= ' + L(r.rewritten)
        elif nm == 'ConstantTimesRule':
            item['det'] = '= ' + L(r.constant) + '\\int ' + L(r.other) + '\\,d' + L(r.variable)
        elif nm == 'TrigSubstitutionRule':
            item['det'] = L(r.theta) + ':\\; x = ' + L(r.func)
        elif nm == 'CyclicPartsRule':
            item['det'] = 'la integral reaparece y se despeja'
    except Exception:
        pass
    if nm not in ('AlternativeRule',):
        out.append(item)
    for at in ('substeps', 'alternatives'):
        sub = getattr(r, at, None)
        if sub:
            for s in (sub if at == 'substeps' else sub[:1]):
                _ipasos(s, out, nivel + 1)
    for at in ('substep', 'v_step', 'second_step'):
        s = getattr(r, at, None)
        if s is not None and hasattr(s, 'integrand'):
            _ipasos(s, out, nivel + 1)


def integral(fs, a='', b=''):
    try:
        from sympy.integrals.manualintegrate import integral_steps
        f = _e(fs)
        pasos = []
        try:
            _ipasos(integral_steps(f, x), pasos)
        except Exception:
            pass
        pasos = [q for k, q in enumerate(pasos) if k == 0 or (q['r'], q['i'], q['nivel']) != (pasos[k - 1]['r'], pasos[k - 1]['i'], pasos[k - 1]['nivel'])]
        F = sp.integrate(f, x)
        res = {'f': L(f), 'F': L(F) if not F.has(sp.Integral) else None, 'Fstr': str(F).replace('**', '^') if not F.has(sp.Integral) else None, 'pasos': pasos}
        if a != '' and b != '':
            A, B = _e(a), _e(b)
            v = sp.integrate(f, (x, A, B))
            res.update({'a': L(A), 'b': L(B), 'v': L(sp.simplify(v)), 'vn': _num(v), 'conv': bool(v.is_finite) if v.is_finite is not None else None,
                        'Fb': L(sp.limit(F, x, B)) if (B.is_infinite and not F.has(sp.Integral)) else (L(sp.simplify(F.subs(x, B))) if not F.has(sp.Integral) else None),
                        'Fa': L(sp.limit(F, x, A)) if (A.is_infinite and not F.has(sp.Integral)) else (L(sp.simplify(F.subs(x, A))) if not F.has(sp.Integral) else None)})
        return _ok(**res)
    except Exception as e:
        return _err(e)


def lhopital(fs, ts):
    try:
        f = _e(fs)
        t = _e(ts)
        num, den = sp.fraction(sp.together(f))
        pasos = []
        for k in range(6):
            ln = sp.limit(num, x, t)
            ld = sp.limit(den, x, t)
            forma = '0/0' if (ln == 0 and ld == 0) else '∞/∞' if (ln.is_infinite and ld.is_infinite) else None
            pasos.append({'num': L(num), 'den': L(den), 'ln': L(ln), 'ld': L(ld), 'forma': forma})
            if not forma:
                break
            num, den = sp.simplify(sp.diff(num, x)), sp.simplify(sp.diff(den, x))
        Lm = sp.limit(f, x, t)
        return _ok(f=L(f), t=L(t), pasos=pasos, L=L(Lm), Ln=_num(Lm))
    except Exception as e:
        return _err(e)


# ---------- Ecuaciones diferenciales
def _cancel_exp(e):
    t = sp.Symbol('_t', positive=True)
    for k in (2, 1, 3, 4, 5, 10):
        try:
            e2 = sp.powdenest(e, force=True).subs(sp.exp(x / k), t).subs(sp.exp(x), t ** k)
            if not e2.has(x):
                return sp.cancel(e2).subs(t, sp.exp(x / k))
        except Exception:
            pass
    return e

def edo(rhs, x0='', y0=''):
    try:
        Y = sp.Function('y')
        r = sp.nsimplify(_e(rhs), rational=True).subs(y, Y(x))
        eq = sp.Eq(Y(x).diff(x), r)
        clases = list(sp.classify_ode(eq, Y(x)))
        ics = {Y(_e(x0)): _e(y0)} if (x0 != '' and y0 != '') else None
        sol = sp.dsolve(eq, Y(x), ics=ics) if ics else sp.dsolve(eq, Y(x))
        if isinstance(sol, list):
            sol = sol[0]
        try:
            cands = [sol.rhs]
            for fn in (sp.simplify, sp.cancel, sp.factor, lambda e: sp.powsimp(sp.expand(e)), _cancel_exp):
                try:
                    cands.append(fn(sol.rhs))
                except Exception:
                    pass
            sol = sp.Eq(sol.lhs, min(cands, key=sp.count_ops))
        except Exception:
            pass
        es = {'separable': 'separable', '1st_linear': 'lineal de primer orden', '1st_exact': 'exacta', 'Bernoulli': 'de Bernoulli', '1st_homogeneous_coeff_best': 'homogénea'}
        tipos = [es[c] for c in clases if c in es]
        rhs_s = sol.rhs
        return _ok(eq=L(eq), sol=L(sol), tipos=list(dict.fromkeys(tipos)), ystr=str(rhs_s).replace('**', '^') if not rhs_s.has(sp.Integral) else None)
    except Exception as e:
        return _err(e)


# ---------- Sucesiones y series
def sucesion(ans):
    try:
        a = _e(ans).subs(x, n)
        try:
            lim = sp.limit(a, n, sp.oo)
        except Exception:
            lim = sp.nan
        malo = lim == sp.nan or lim.has(sp.AccumBounds) or lim.has(sp.zoo)
        return _ok(a=L(a), L='\\text{no existe}' if malo else L(lim), Ln=None if malo else _num(lim), conv=bool(lim.is_finite) and not malo, terms=[_num(a.subs(n, k)) for k in range(1, 21)])
    except Exception as e:
        return _err(e)


def serie(ans, n0='1'):
    try:
        a = _e(ans).subs(x, n)
        N0 = int(_e(n0))
        S = sp.Sum(a, (n, N0, sp.oo))
        res = {'a': L(a), 'n0': N0}
        try:
            r = sp.limit(sp.Abs(a.subs(n, n + 1) / a), n, sp.oo)
            res['razon'] = L(r)
            res['razonn'] = _num(r)
        except Exception:
            res['razon'] = None
        try:
            rt = sp.limit(sp.Abs(a) ** (sp.Integer(1) / n), n, sp.oo)
            res['raiz'] = L(rt)
            res['raizn'] = _num(rt)
        except Exception:
            res['raiz'] = None
        lt = None
        try:
            lt = sp.limit(a, n, sp.oo)
        except Exception:
            pass
        try:
            if lt is None or lt.has(sp.AccumBounds) or lt == sp.nan:
                if sp.limit(sp.Abs(a), n, sp.oo) == 0:
                    lt = sp.Integer(0)
        except Exception:
            pass
        res['term'] = L(lt) if lt is not None else None
        res['termn'] = _num(lt) if lt is not None else None
        try:
            c = S.is_convergent()
            res['conv'] = bool(c) if c in (True, False) else None
        except Exception:
            res['conv'] = None
        try:
            if res.get('conv'):
                v = sp.summation(a, (n, N0, sp.oo))
                if not v.has(sp.Sum):
                    res['suma'] = L(sp.simplify(v))
                    res['suman'] = _num(v)
        except Exception:
            pass
        try:
            ab = sp.Sum(sp.Abs(a), (n, N0, sp.oo)).is_convergent()
            res['abs'] = bool(ab) if ab in (True, False) else None
        except Exception:
            res['abs'] = None
        res['parciales'] = []
        s = 0.0
        for k in range(N0, N0 + 30):
            v = _num(a.subs(n, k))
            if v is None:
                break
            s += v
            res['parciales'].append(s)
        return _ok(**res)
    except Exception as e:
        return _err(e)


def potencias(cs, c='0'):
    try:
        cn = _e(cs).subs(x, n)
        C = _e(c)
        R = sp.limit(sp.Abs(cn / cn.subs(n, n + 1)), n, sp.oo)
        res = {'c': L(cn), 'centro': L(C), 'R': L(R), 'Rn': _num(R) if R.is_finite else None, 'inf': bool(R.is_infinite)}
        if R.is_finite and R.is_positive:
            ext = []
            for pnt in [C - R, C + R]:
                term = cn * (pnt - C) ** n
                try:
                    cv = sp.Sum(term, (n, 1, sp.oo)).is_convergent()
                    cv = bool(cv) if cv in (True, False) else None
                except Exception:
                    cv = None
                ext.append({'x': L(pnt), 'conv': cv, 'serie': L(sp.simplify(term))})
            res['ext'] = ext
        return _ok(**res)
    except Exception as e:
        return _err(e)


def taylor(fs, a='0', k='4'):
    try:
        f = _e(fs)
        A = _e(a)
        K = max(1, min(12, int(k)))
        p = sp.series(f, x, A, K + 1).removeO()
        coef = [L(sp.simplify(sp.diff(f, x, j).subs(x, A) / sp.factorial(j))) for j in range(K + 1)]
        return _ok(f=L(f), a=L(A), p=L(p), pstr=str(p).replace('**', '^'), coef=coef)
    except Exception as e:
        return _err(e)


# ---------- Varias variables
def parciales(fs, x0='', y0=''):
    try:
        f = _e(fs)
        fx, fy = sp.diff(f, x), sp.diff(f, y)
        fxx, fyy, fxy = sp.diff(fx, x), sp.diff(fy, y), sp.diff(fx, y)
        res = {'f': L(f), 'fx': L(sp.simplify(fx)), 'fy': L(sp.simplify(fy)), 'fxx': L(sp.simplify(fxx)), 'fyy': L(sp.simplify(fyy)), 'fxy': L(sp.simplify(fxy)), 'fyx': L(sp.simplify(sp.diff(fy, x)))}
        if x0 != '' and y0 != '':
            P = {x: _e(x0), y: _e(y0)}
            res.update({'v': L(sp.simplify(f.subs(P))), 'gx': L(sp.simplify(fx.subs(P))), 'gy': L(sp.simplify(fy.subs(P))), 'gxn': _num(fx.subs(P)), 'gyn': _num(fy.subs(P))})
        pts = []
        try:
            sols = sp.solve([fx, fy], [x, y], dict=True)
            for s_ in sols:
                if not all(v.is_real for v in s_.values()):
                    continue
                H = (fxx * fyy - fxy ** 2).subs(s_)
                a2 = fxx.subs(s_)
                tipo = 'mínimo' if H > 0 and a2 > 0 else 'máximo' if H > 0 and a2 < 0 else 'silla' if H < 0 else 'no concluyente'
                pts.append({'x': L(s_[x]), 'y': L(s_[y]), 'D': L(sp.simplify(H)), 'fxx': L(sp.simplify(a2)), 'tipo': tipo, 'f': L(sp.simplify(f.subs(s_)))})
        except Exception:
            pass
        res['pts'] = pts[:8]
        return _ok(**res)
    except Exception as e:
        return _err(e)


def doble(fs, xa, xb, ya, yb, orden='dydx'):
    try:
        f = _e(fs)
        if orden == 'polar':
            r, t = sp.symbols('r theta', positive=True)
            g = sp.simplify(f.subs({x: r * sp.cos(t), y: r * sp.sin(t)}) * r)
            Ra, Rb, Ta, Tb = _e(xa), _e(xb), _e(ya), _e(yb)
            inner = sp.simplify(sp.integrate(g, (r, Ra, Rb)))
            v = sp.simplify(sp.integrate(inner, (t, Ta, Tb)))
            return _ok(f=L(f), g=L(g), inner=L(inner), v=L(v), vn=_num(v), orden=orden)
        if orden == 'dydx':
            A, B = _e(xa), _e(xb)
            G1, G2 = _e(ya), _e(yb)
            inner = sp.simplify(sp.integrate(f, (y, G1, G2)))
            v = sp.simplify(sp.integrate(inner, (x, A, B)))
        else:
            A, B = _e(ya), _e(yb)
            G1, G2 = _e(xa), _e(xb)
            inner = sp.simplify(sp.integrate(f, (x, G1, G2)))
            v = sp.simplify(sp.integrate(inner, (y, A, B)))
        return _ok(f=L(f), inner=L(inner), v=L(v), vn=_num(v), orden=orden)
    except Exception as e:
        return _err(e)
