# Economiapp · Matemáticas: las mismas operaciones de SymPy que pages/1_Matematicas.py.
# Se ejecuta en el navegador con Pyodide; cada función devuelve un JSON con fórmulas en LaTeX.
import json
import sympy as sp
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application, convert_xor
_TR = standard_transformations + (implicit_multiplication_application, convert_xor)

x = sp.Symbol('x')
_LOC = {'x': x, 'e': sp.E, 'E': sp.E, 'pi': sp.pi, 'ln': sp.log, 'oo': sp.oo, 'inf': sp.oo, 'infinito': sp.oo}


def _expr(s):
    return parse_expr(str(s).replace('X', 'x').replace('∞', 'oo'), local_dict=dict(_LOC), transformations=_TR)


def _num(v):
    try:
        if v.is_infinite:
            return None
        f = complex(v.evalf())
        return f.real if abs(f.imag) < 1e-12 else None
    except Exception:
        return None


def _out(d):
    return json.dumps(d)


def limite(fs, ts):
    try:
        f = _expr(fs)
        t = _expr(ts)
        inf = bool(t.is_infinite)
        L = sp.limit(f, x, t) if not inf else sp.limit(f, x, t)
        if inf:
            Li = Ld = L
        else:
            Li = sp.limit(f, x, t, dir='-')
            Ld = sp.limit(f, x, t, dir='+')
        existe = (Li == Ld) and not (L.has(sp.zoo) or L == sp.nan)
        # Evaluación directa sin cancelar factores (la app usaba cancel(), que ocultaba el 0/0)
        num, den = sp.fraction(sp.together(f))
        caso, simp = 'directo', None
        if not inf:
            vn = sp.simplify(num.subs(x, t))
            vd = sp.simplify(den.subs(x, t))
            if vd == 0 and vn == 0:
                caso = 'indeterminado'
                simp = sp.latex(sp.simplify(f))
            elif vd == 0:
                caso = 'asintota'
            dir_txt = [sp.latex(vn), sp.latex(vd)]
        else:
            caso, dir_txt = 'infinito', None
        return _out({'ok': True, 'f': sp.latex(f), 't': sp.latex(t), 'inf': inf,
                     'L': sp.latex(L), 'Li': sp.latex(Li), 'Ld': sp.latex(Ld),
                     'Ln': _num(L), 'existe': bool(existe), 'caso': caso,
                     'eval': dir_txt, 'simp': simp})
    except Exception as e:
        return _out({'ok': False, 'error': str(e)})


def optimiza(fs):
    try:
        f = _expr(fs)
        d1 = sp.diff(f, x)
        d2 = sp.diff(d1, x)
        crudos = sp.solve(d1, x)
        pts = []
        for p in crudos:
            pn = _num(p)
            if pn is None or sp.im(p) != 0:
                continue
            c = d2.subs(x, p)
            cn = _num(c)
            tipo = 'max' if cn is not None and cn < -1e-12 else 'min' if cn is not None and cn > 1e-12 else 'inconcluso'
            fv = f.subs(x, p)
            pts.append({'x': sp.latex(sp.nsimplify(p) if p.is_Float else p), 'xn': pn,
                        'f2': sp.latex(sp.simplify(c)), 'f2n': cn, 'tipo': tipo,
                        'fx': sp.latex(sp.simplify(fv)), 'fxn': _num(fv)})
        pts.sort(key=lambda q: q['xn'])
        return _out({'ok': True, 'f': sp.latex(f), 'd1': sp.latex(d1), 'd2': sp.latex(d2), 'pts': pts})
    except Exception as e:
        return _out({'ok': False, 'error': str(e)})


def integra(fs, a, b):
    try:
        f = _expr(fs)
        A = sp.nsimplify(_expr(a))
        B = sp.nsimplify(_expr(b))
        F = sp.integrate(f, x)
        if F.has(sp.Integral):
            return _out({'ok': False, 'error': 'SymPy no encontró una antiderivada elemental para esta función.'})
        area = sp.simplify(sp.integrate(f, (x, A, B)))
        eb = sp.simplify(F.subs(x, B))
        ea = sp.simplify(F.subs(x, A))
        return _out({'ok': True, 'f': sp.latex(f), 'F': sp.latex(F), 'a': sp.latex(A), 'b': sp.latex(B),
                     'Fb': sp.latex(eb), 'Fa': sp.latex(ea), 'area': sp.latex(area), 'arean': _num(area)})
    except Exception as e:
        return _out({'ok': False, 'error': str(e)})
