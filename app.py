import streamlit as st
import json
import pandas as pd
import sympy as sp
import numpy as np
import google.generativeai as genai

st.set_page_config(page_title="App Econ", layout="wide")

with open('datos_materias.json', 'r', encoding='utf-8') as f:
    datos = json.load(f)

# ====== MENÚ LATERAL Y CONFIGURACIÓN DE IA ======
with st.sidebar:
    st.title("📚 Navegación")
    materia_seleccionada = st.selectbox("Selecciona la Materia:", ["Macroeconomía 1"])
    
    tema_seleccionado = st.radio("Selecciona el Tema:", [
        "PIB (Enfoque Gasto)", 
        "Teoría del Consumo",
        "Consumo Intertemporal",
        "Inversión",
        "Mercado de Dinero",
        "Modelo IS-LM",
        "Gobierno y Política Fiscal"
    ])
    
    st.divider()
    st.subheader("⚙️ Configuración IA")
    api_key = st.text_input("Ingresa tu API Key de Gemini:", type="password")
    if api_key:
        genai.configure(api_key=api_key)

# ==========================================
# MÓDULO 1: PIB (ENFOQUE GASTO)
# ==========================================
if tema_seleccionado == "PIB (Enfoque Gasto)":
    st.title("Laboratorio de Macroeconomía 📊")
    tema = datos["macroeconomia_1"]["pib_gasto"]
    st.header(tema["nombre"])

    st.subheader("Modelo Matemático")
    col_form1, col_form2 = st.columns(2)
    with col_form1:
        st.markdown("**Fórmula General Estándar:**")
        st.latex(tema["formula_general"])

    st.divider()
    st.subheader("Configuración de Variables")
    col_input1, col_input2 = st.columns(2)
    valores_ingresados = {}

    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        with col_input1 if i % 2 == 0 else col_input2:
            with st.container(border=True):
                valores_ingresados[simbolo] = st.number_input(f"{info['nombre']} ({simbolo})", value=float(info['valor_defecto']))
                with st.expander("📖 ¿Qué es y dónde se consulta?"):
                    st.markdown(info['ayuda_real'])

    C0 = valores_ingresados["C0"]
    c1 = valores_ingresados["c1"]
    T = valores_ingresados["T"]
    I = valores_ingresados["I"]
    G = valores_ingresados["G"]

    if c1 != 1:
        multiplicador = 1 / (1 - c1)
        gasto_autonomo_interno = C0 - (c1 * T) + I + G
        Y_resultado = multiplicador * gasto_autonomo_interno
        C_real = C0 + (c1 * (Y_resultado - T))
    else:
        multiplicador, Y_resultado, C_real = 0, 0, 0

    with col_form2:
        st.markdown("**Fórmula con tus Valores Actuales:**")
        st.latex(f"Y = \\frac{{1}}{{1 - {c1}}} \\cdot [{C0} - {c1}({T}) + {I} + {G}]")
        st.markdown(f"### ➡️ PIB de Equilibrio (Y) = `{Y_resultado:,.2f}`")

    st.divider()
    col_pasos, col_grafico = st.columns(2)

    with col_pasos:
        st.subheader("📝 Resolución Paso a Paso")
        st.latex(f"Y = \\left(\\frac{{1}}{{{round(1-c1, 2)}}}\\right) \\cdot [{C0} - {c1*T} + {I} + {G}]")
        st.latex(f"Y = {round(multiplicador, 2)} \\cdot [{gasto_autonomo_interno}]")
        st.latex(f"Y = {Y_resultado:,.2f}")
        
    with col_grafico:
        st.subheader("📈 Composición del PIB")
        datos_grafico = pd.DataFrame({"Componente": ["Consumo Total", "Inversión", "Gasto"], "Valor": [C_real, I, G]}).set_index("Componente")
        st.bar_chart(datos_grafico, color="#4CAF50")

    # ====== ANÁLISIS MARGINAL (PIB) ======
    st.divider()
    st.subheader("🧮 Análisis Marginal e Impacto")
    
    Y_sym, C_0_sym, c_1_sym, T_sym, I_sym, G_sym = sp.symbols('Y C_0 c_1 T I G')
    funcion_Y = (1 / (1 - c_1_sym)) * (C_0_sym - c_1_sym * T_sym + I_sym + G_sym)
    
    opciones_pib = {
        "Gasto Público (G)": G_sym,
        "Impuestos (T)": T_sym,
        "Propensión a Consumir (c1)": c_1_sym
    }
    
    var_seleccionada = st.selectbox("¿Qué variable deseas derivar con respecto a Y?", list(opciones_pib.keys()))
    simbolo_derivar = opciones_pib[var_seleccionada]
    
    derivada_Y = sp.diff(funcion_Y, simbolo_derivar)
    valor_derivada = derivada_Y.subs({C_0_sym: C0, c_1_sym: c1, T_sym: T, I_sym: I, G_sym: G})
    
    col_der1, col_der2 = st.columns(2)
    with col_der1:
        st.markdown(f"**Derivada respecto a ${simbolo_derivar}$:**")
        st.latex(f"\\frac{{\\partial Y}}{{\\partial {simbolo_derivar}}} = {sp.latex(derivada_Y)}")
    
    with col_der2:
        st.markdown("**Resultado numérico actual:**")
        st.latex(f"\\frac{{\\partial Y}}{{\\partial {simbolo_derivar}}} = {float(valor_derivada):.2f}")
        
    with st.expander(f"🔍 Ver el paso a paso algebraico de la derivada respecto a {simbolo_derivar}"):
        if simbolo_derivar == G_sym:
            st.markdown("**Regla de la Suma y Constante:**")
            st.latex(f"\\frac{{\\partial Y}}{{\\partial G}} = \\frac{{\\partial}}{{\\partial G}} \\left( \\frac{{1}}{{1-c_1}}[C_0 - c_1T + I + G] \\right)")
            st.markdown("1. Extraemos la constante $\\frac{1}{1-c_1}$ multiplicando todo.")
            st.markdown("2. Derivamos el interior: La derivada de $C_0$, $-c_1T$, e $I$ respecto a $G$ es $0$.")
            st.markdown("3. La derivada de $G$ respecto a $G$ es $1$.")
            st.latex(f"= \\frac{{1}}{{1-c_1}} \\cdot (0 - 0 + 0 + 1) = \\frac{{1}}{{1-c_1}}")
        elif simbolo_derivar == T_sym:
            st.markdown("**Regla de la Constante:**")
            st.latex(f"\\frac{{\\partial Y}}{{\\partial T}} = \\frac{{\\partial}}{{\\partial T}} \\left( \\frac{{1}}{{1-c_1}}[C_0 - c_1T + I + G] \\right)")
            st.markdown("1. Extraemos la constante $\\frac{1}{1-c_1}$.")
            st.markdown("2. Derivamos el interior: La derivada de $-c_1T$ respecto a $T$ es $-c_1$. El resto es $0$.")
            st.latex(f"= \\frac{{1}}{{1-c_1}} \\cdot (-c_1) = -\\frac{{c_1}}{{1-c_1}}")
        elif simbolo_derivar == c_1_sym:
            st.markdown("**Regla del Cociente y Regla de la Cadena:**")
            st.markdown("Como $c_1$ está en el denominador y en el numerador, aplicamos la regla del cociente $\\frac{u'v - uv'}{v^2}$ o expandimos y aplicamos regla del producto. SymPy simplifica el resultado final a:")
            st.latex(sp.latex(derivada_Y))

# ==========================================
# MÓDULO 2: TEORÍA DEL CONSUMO
# ==========================================
elif tema_seleccionado == "Teoría del Consumo":
    st.title("Laboratorio de Macroeconomía 📊")
    tema = datos["macroeconomia_1"]["teoria_consumo"]
    st.header(tema["nombre"])

    st.subheader("Modelo Matemático")
    col_form1, col_form2 = st.columns(2)
    with col_form1:
        st.markdown("**Fórmula General Estándar:**")
        st.latex(tema["formula_general"])

    st.divider()
    st.subheader("Configuración de Variables")
    col_input1, col_input2 = st.columns(2)
    valores_ingresados = {}

    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        with col_input1 if i % 2 == 0 else col_input2:
            with st.container(border=True):
                valores_ingresados[simbolo] = st.number_input(f"{info['nombre']} ({simbolo})", value=float(info['valor_defecto']))
                with st.expander("📖 ¿Qué es y dónde se consulta?"):
                    st.markdown(info['ayuda_real'])

    C0, c1, Y_val, T_val = valores_ingresados["C0"], valores_ingresados["c1"], valores_ingresados["Y"], valores_ingresados["T"]

    # ====== MOTOR MATEMÁTICO ======
    C, C_0_sym, c_1_sym, Y_sym, T_sym = sp.symbols('C C_0 c_1 Y T')
    ecuacion_consumo = sp.Eq(C, C_0_sym + c_1_sym * (Y_sym - T_sym))
    ecuacion_sustituida = ecuacion_consumo.subs({C_0_sym: C0, c_1_sym: c1, Y_sym: Y_val, T_sym: T_val})
    C_total = sp.solve(ecuacion_sustituida, C)[0]
    ahorro = (Y_val - T_val) - C_total

    with col_form2:
        st.markdown("**Fórmula con tus Valores Actuales:**")
        st.latex(sp.latex(ecuacion_sustituida))
        st.markdown(f"### ➡️ Consumo Total (C) = `{float(C_total):,.2f}`")

    st.divider()
    col_pasos, col_grafico = st.columns(2)

    with col_pasos:
        st.subheader("📝 Resolución Paso a Paso")
        st.latex(f"Y_d = {Y_val} - {T_val} = {Y_val - T_val}")
        st.latex(sp.latex(ecuacion_sustituida))
        st.latex(f"C = {C0} + {c1 * (Y_val - T_val)}")
        st.latex(f"C = {float(C_total):,.2f}")

    with col_grafico:
        st.subheader("📈 Desglose del Consumo")
        datos_grafico = pd.DataFrame({"Tipo de Consumo": ["Consumo Autónomo", "Consumo Inducido"], "Valor": [C0, float(c1 * (Y_val - T_val))]}).set_index("Tipo de Consumo")
        st.bar_chart(datos_grafico, color="#FF9800")

    # ====== ANÁLISIS MARGINAL (CONSUMO) ======
    st.divider()
    st.subheader("🧮 Análisis Marginal e Impacto")
    
    funcion_C = C_0_sym + c_1_sym * (Y_sym - T_sym)
    
    opciones_consumo = {
        "Ingreso (Y)": Y_sym,
        "Impuestos (T)": T_sym
    }
    
    var_seleccionada = st.selectbox("¿Qué variable deseas derivar con respecto a C?", list(opciones_consumo.keys()))
    simbolo_derivar = opciones_consumo[var_seleccionada]
    
    derivada_C = sp.diff(funcion_C, simbolo_derivar)
    valor_derivada = derivada_C.subs({c_1_sym: c1})
    
    col_der1, col_der2 = st.columns(2)
    with col_der1:
        st.markdown(f"**Derivada respecto a ${simbolo_derivar}$:**")
        st.latex(f"\\frac{{\\partial C}}{{\\partial {simbolo_derivar}}} = {sp.latex(derivada_C)}")
    
    with col_der2:
        st.markdown("**Resultado numérico actual:**")
        st.latex(f"\\frac{{\\partial C}}{{\\partial {simbolo_derivar}}} = {float(valor_derivada):.2f}")
        
    with st.expander(f"🔍 Ver el paso a paso algebraico de la derivada respecto a {simbolo_derivar}"):
        if simbolo_derivar == Y_sym:
            st.markdown("**Regla de la Suma:**")
            st.latex(f"\\frac{{\\partial C}}{{\\partial Y}} = \\frac{{\\partial}}{{\\partial Y}} (C_0) + \\frac{{\\partial}}{{\\partial Y}} [c_1(Y - T)]")
            st.markdown("1. La derivada de la constante $C_0$ respecto a $Y$ es $0$.")
            st.markdown("2. Distribuimos $c_1$: $c_1 Y - c_1 T$.")
            st.markdown("3. La derivada de $c_1 Y$ respecto a $Y$ es $c_1$. La derivada de $-c_1 T$ es $0$.")
            st.latex(f"= 0 + c_1 - 0 = c_1")
        elif simbolo_derivar == T_sym:
            st.markdown("**Regla de la Suma:**")
            st.latex(f"\\frac{{\\partial C}}{{\\partial T}} = \\frac{{\\partial}}{{\\partial T}} (C_0 + c_1 Y - c_1 T)")
            st.markdown("1. La derivada de las constantes $C_0$ y $c_1 Y$ respecto a $T$ es $0$.")
            st.markdown("2. La derivada de $-c_1 T$ respecto a $T$ es $-c_1$.")
            st.latex(f"= 0 + 0 - c_1 = -c_1")

# ==========================================
# MÓDULO 3: CONSUMO INTERTEMPORAL 
# ==========================================
elif tema_seleccionado == "Consumo Intertemporal":
    st.title("Laboratorio de Macroeconomía 📊")
    tema = datos["macroeconomia_1"]["consumo_intertemporal"]
    st.header(tema["nombre"])

    st.subheader("Modelo Matemático")
    col_form1, col_form2 = st.columns(2)
    with col_form1:
        st.markdown("**1. Restricción Presupuestaria:**")
        st.latex(tema["formula_general"])
        st.markdown("**2. Función de Utilidad (Cobb-Douglas):**")
        st.latex("U(C_1, C_2) = C_1^\\alpha \\cdot C_2^\\beta")

    st.divider()
    st.subheader("Configuración de Variables")
    col_input1, col_input2 = st.columns(2)
    valores_ingresados = {}

    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        with col_input1 if i % 2 == 0 else col_input2:
            with st.container(border=True):
                valores_ingresados[simbolo] = st.number_input(f"{info['nombre']} ({simbolo})", value=float(info['valor_defecto']), step=0.01)

    Y1, Y2, r = valores_ingresados["Y1"], valores_ingresados["Y2"], valores_ingresados["r"]
    alpha, beta = valores_ingresados["alpha"], valores_ingresados["beta"]

    # ====== CÁLCULOS ======
    W = Y1 + (Y2 / (1 + r))
    C2_max = W * (1 + r)
    
    C1_optimo = (alpha / (alpha + beta)) * W
    C2_optimo = (beta / (alpha + beta)) * W * (1 + r)
    Utilidad_optima = (C1_optimo**alpha) * (C2_optimo**beta)

    with col_form2:
        st.markdown("**Tu Riqueza Total (Valor Presente - W):**")
        st.latex(f"W = {Y1} + \\frac{{{Y2}}}{{1 + {r}}}")
        st.markdown(f"### ➡️ W = `{W:,.2f}`")
        st.markdown("**Canasta Óptima Calculada:**")
        st.latex(f"C_1^* = {C1_optimo:,.2f} \\quad | \\quad C_2^* = {C2_optimo:,.2f}")

    st.divider()
    col_pasos, col_grafico = st.columns(2)

    with col_pasos:
        st.subheader("📝 Puntos Extremos de Consumo")
        st.latex(f"C_1^{{max}} = W = {W:,.2f}")
        st.latex(f"C_2^{{max}} = W \\cdot (1+r) = {C2_max:,.2f}")

    with col_grafico:
        st.subheader("📈 Restricción y Curva de Indiferencia")
        c1_array = np.linspace(1, W, 100)
        c2_presupuesto = (W - c1_array) * (1 + r)
        c2_indiferencia = (Utilidad_optima / (c1_array**alpha))**(1/beta)
        
        df_grafico = pd.DataFrame({"Restricción Presupuestaria": c2_presupuesto, "Curva de Indiferencia": c2_indiferencia}, index=c1_array)
        df_grafico.loc[df_grafico["Curva de Indiferencia"] > W * (1+r) * 1.5, "Curva de Indiferencia"] = np.nan
        st.line_chart(df_grafico)

    # ====== ANÁLISIS MARGINAL (FISHER Y UTILIDAD) ======
    st.divider()
    st.subheader("🧮 Análisis Marginal (Riqueza y Utilidad)")
    
    Y1_sym, Y2_sym, r_sym = sp.symbols('Y_1 Y_2 r')
    funcion_W = Y1_sym + Y2_sym * (1 + r_sym)**-1
    
    C1_sym, C2_sym, alpha_sym, beta_sym = sp.symbols('C_1 C_2 \\alpha \\beta')
    funcion_U = (C1_sym**alpha_sym) * (C2_sym**beta_sym)
    
    opciones_fisher = {
        "Sensibilidad de la Riqueza ante la Tasa de Interés (r)": ("W", r_sym, funcion_W),
        "Sensibilidad de la Riqueza ante Ingreso Futuro (Y2)": ("W", Y2_sym, funcion_W),
        "Utilidad Marginal del Consumo Presente (C1)": ("U", C1_sym, funcion_U),
        "Utilidad Marginal del Consumo Futuro (C2)": ("U", C2_sym, funcion_U)
    }
    
    var_seleccionada = st.selectbox("Selecciona qué análisis marginal deseas realizar:", list(opciones_fisher.keys()))
    funcion_str, simbolo_derivar, funcion_elegida = opciones_fisher[var_seleccionada]
    
    derivada_elegida = sp.diff(funcion_elegida, simbolo_derivar)
    
    if funcion_str == "W":
        valor_derivada = derivada_elegida.subs({Y1_sym: Y1, Y2_sym: Y2, r_sym: r})
    else:
        valor_derivada = derivada_elegida.subs({C1_sym: C1_optimo, C2_sym: C2_optimo, alpha_sym: alpha, beta_sym: beta})
    
    col_der1, col_der2 = st.columns(2)
    with col_der1:
        st.markdown(f"**Derivada respecto a ${simbolo_derivar}$:**")
        st.latex(f"\\frac{{\\partial {funcion_str}}}{{\\partial {simbolo_derivar}}} = {sp.latex(derivada_elegida)}")
    
    with col_der2:
        st.markdown("**Resultado numérico en el punto actual/óptimo:**")
        st.latex(f"\\frac{{\\partial {funcion_str}}}{{\\partial {simbolo_derivar}}} = {float(valor_derivada):.2f}")
        
    with st.expander(f"🔍 Ver el paso a paso algebraico de la derivada respecto a {simbolo_derivar}"):
        if simbolo_derivar == r_sym:
            st.markdown("**Regla de la Cadena y Exponentes:**")
            st.latex(f"W = Y_1 + Y_2(1+r)^{{-1}}")
            st.markdown("1. La derivada de $Y_1$ (constante) es $0$.")
            st.markdown("2. Bajamos el exponente $-1$ multiplicando y restamos $1$ al exponente ($-1 - 1 = -2$).")
            st.markdown("3. Multiplicamos por la derivada interna de $(1+r)$, que es $1$.")
            st.latex(f"\\frac{{\\partial W}}{{\\partial r}} = 0 + (-1) \\cdot Y_2(1+r)^{{-2}} \\cdot (1) = -\\frac{{Y_2}}{{(1+r)^2}}")
        elif simbolo_derivar == Y2_sym:
            st.markdown("**Regla de la Constante Multiplicativa:**")
            st.latex(f"W = Y_1 + \\left( \\frac{{1}}{{1+r}} \\right) Y_2")
            st.markdown("1. La derivada de $Y_1$ es $0$.")
            st.markdown("2. Derivamos $Y_2$ dejando su coeficiente constante intacto.")
            st.latex(f"\\frac{{\\partial W}}{{\\partial Y_2}} = 0 + \\frac{{1}}{{1+r}} \\cdot 1 = \\frac{{1}}{{1+r}}")
        elif simbolo_derivar == C1_sym:
            st.markdown("**Regla de la Potencia:**")
            st.markdown("1. Tratamos a $C_2^\\beta$ como una constante.")
            st.markdown("2. Derivamos $C_1^\\alpha$: bajamos el exponente $\\alpha$ y le restamos 1.")
            st.latex(f"= \\alpha \\cdot C_1^{{\\alpha - 1}} \\cdot C_2^\\beta")
        elif simbolo_derivar == C2_sym:
            st.markdown("**Regla de la Potencia:**")
            st.markdown("1. Tratamos a $C_1^\\alpha$ como una constante.")
            st.markdown("2. Derivamos $C_2^\\beta$: bajamos el exponente $\\beta$ y le restamos 1.")
            st.latex(f"= \\beta \\cdot C_1^\\alpha \\cdot C_2^{{\\beta - 1}}")

# ==========================================
# MÓDULO 4: INVERSIÓN (DE GREGORIO & TOBIN)
# ==========================================
elif tema_seleccionado == "Inversión":
    st.title("Laboratorio de Macroeconomía 📊")
    tema = datos["macroeconomia_1"]["inversion"]
    st.header(tema["nombre"])

    st.subheader("Configuración de Variables")
    col_input1, col_input2 = st.columns(2)
    valores_ingresados = {}

    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        with col_input1 if i % 2 == 0 else col_input2:
            with st.container(border=True):
                # Validar que los decimales pequeños (tasas) tengan el step adecuado
                paso = 0.01 if simbolo in ["r", "delta", "alpha"] else 100.0
                valores_ingresados[simbolo] = st.number_input(f"{info['nombre']} ({simbolo})", value=float(info['valor_defecto']), step=paso)
                with st.expander("📖 Info"):
                    st.markdown(info['ayuda_real'])

    Y_val, alpha, r, delta = valores_ingresados["Y"], valores_ingresados["alpha"], valores_ingresados["r"], valores_ingresados["delta"]
    K_prev, VM, CR = valores_ingresados["K_prev"], valores_ingresados["VM"], valores_ingresados["CR"]

    st.divider()
    
    tab1, tab2 = st.tabs(["🏛️ Modelo Neoclásico (Optimización)", "📈 Teoría de la 'q' de Tobin"])

    with tab1:
        st.subheader("Costo de Uso y Stock de Capital Óptimo ($K^*$)")
        col_form, col_res = st.columns(2)
        
        # Cálculos Económicos
        uc = r + delta  # Asumimos Precio del Capital (Pk) = 1 para simplificar
        K_optimo = alpha * (Y_val / uc)
        Inversion_bruta = K_optimo - (1 - delta) * K_prev
        Inversion_neta = K_optimo - K_prev
        
        with col_form:
            st.markdown("**1. Costo de Uso del Capital ($uc$):**")
            st.latex(f"uc = r + \\delta = {r} + {delta} = {uc:.2f}")
            st.markdown("**2. Capital Óptimo ($K^*$):**")
            st.latex(f"K^* = {alpha} \\cdot \\frac{{{Y_val:,.0f}}}{{{uc:.2f}}}")
        
        with col_res:
            st.markdown(f"### ➡️ $K^*$ = `{K_optimo:,.2f}`")
            st.markdown(f"### ➡️ Inversión Bruta ($I_t$) = `{Inversion_bruta:,.2f}`")
            st.info(f"💡 **Decisión de la Empresa:** Como el capital deseado es {K_optimo:,.0f} y ya tienes {K_prev:,.0f}, tu inversión neta (crecimiento real) es de {Inversion_neta:,.0f}. La inversión bruta incluye reponer lo que se depreció.")

        # Análisis Marginal (Derivadas Simbólicas de De Gregorio)
        st.divider()
        st.subheader("🧮 Análisis Marginal (Sensibilidad del Capital Óptimo)")
        
        Y_sym, alpha_sym, r_sym, delta_sym = sp.symbols('Y \\alpha r \\delta')
        funcion_K = alpha_sym * (Y_sym / (r_sym + delta_sym))
        
        opciones_k = {
            "Tasa de Interés (r)": r_sym,
            "Producción Esperada (Y)": Y_sym,
            "Tasa de Depreciación (δ)": delta_sym
        }
        
        simbolo_derivar = opciones_k[st.selectbox("¿Qué variable deseas derivar con respecto a K*?", list(opciones_k.keys()))]
        
        derivada_K = sp.diff(funcion_K, simbolo_derivar)
        valor_derivada = derivada_K.subs({Y_sym: Y_val, alpha_sym: alpha, r_sym: r, delta_sym: delta})
        
        c1_der, c2_der = st.columns(2)
        with c1_der:
            st.markdown(f"**Derivada respecto a ${simbolo_derivar}$:**")
            st.latex(f"\\frac{{\\partial K^*}}{{\\partial {simbolo_derivar}}} = {sp.latex(derivada_K)}")
        with c2_der:
            st.markdown("**Resultado numérico actual:**")
            st.latex(f"\\frac{{\\partial K^*}}{{\\partial {simbolo_derivar}}} = {float(valor_derivada):,.2f}")
            
        with st.expander(f"🔍 Ver el paso a paso algebraico de la derivada respecto a {simbolo_derivar}"):
            if simbolo_derivar == r_sym:
                st.markdown("**Regla de la Cadena:**")
                st.latex(f"K^* = \\alpha Y (r + \\delta)^{{-1}}")
                st.markdown("1. Tratamos $\\alpha Y$ como constante.")
                st.markdown("2. Bajamos el exponente $-1$ y restamos 1 al exponente ($-2$).")
                st.latex(f"\\frac{{\\partial K^*}}{{\\partial r}} = -\\alpha Y (r + \\delta)^{{-2}} \\cdot (1) = -\\frac{{\\alpha Y}}{{(r + \\delta)^2}}")
            elif simbolo_derivar == Y_sym:
                st.markdown("**Regla de la Constante:**")
                st.markdown(f"La derivada de $Y$ es 1, y mantenemos el coeficiente $\\frac{{\\alpha}}{{r+\\delta}}$.")
                st.latex(f"\\frac{{\\partial K^*}}{{\\partial Y}} = \\frac{{\\alpha}}{{r + \\delta}}")

    with tab2:
        st.subheader("Teoría de la 'q' de Tobin: Valoración de Mercado")
        col_form_t, col_res_t = st.columns(2)
        
        q_resultado = VM / CR if CR != 0 else 0
        
        with col_form_t:
            st.markdown("**Fórmula General:**")
            st.latex("q = \\frac{VM}{CR}")
            st.markdown("**Fórmula con tus Valores:**")
            st.latex(f"q = \\frac{{{VM}}}{{{CR}}}")
            
        with col_res_t:
            st.markdown(f"### ➡️ Índice q = `{q_resultado:,.2f}`")
            if q_resultado > 1:
                st.success("✅ **q > 1:** La empresa está sobrevalorada. Es rentable emitir acciones para comprar nuevo capital. **Decisión: ¡Invertir!**")
            elif q_resultado < 1:
                st.error("❌ **q < 1:** La empresa está subvalorada. El capital existente es más barato que el nuevo. **Decisión: No Invertir.**")
            else:
                st.warning("⚖️ **q = 1:** Punto de equilibrio. La inversión de reposición es indiferente.")
# ==========================================
# MÓDULO 5: MERCADO DE DINERO (CURVA LM)
# ==========================================
elif tema_seleccionado == "Mercado de Dinero":
    st.title("Laboratorio de Macroeconomía 📊")
    tema = datos["macroeconomia_1"]["mercado_dinero"]
    st.header(tema["nombre"])

    st.subheader("Modelo Matemático de Liquidez")
    col_form1, col_form2 = st.columns(2)
    with col_form1:
        st.markdown("**Condición de Equilibrio:**")
        st.latex(tema["formula_general"])

    st.divider()
    st.subheader("Configuración de Variables")
    col_input1, col_input2 = st.columns(2)
    valores_ingresados = {}

    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        with col_input1 if i % 2 == 0 else col_input2:
            with st.container(border=True):
                paso = 0.01 if simbolo in ["k", "h"] else 100.0
                valores_ingresados[simbolo] = st.number_input(f"{info['nombre']} ({simbolo})", value=float(info['valor_defecto']), step=paso)
                with st.expander("📖 Info"): st.markdown(info['ayuda_real'])

    M, P, Y_val, k, h = valores_ingresados["M"], valores_ingresados["P"], valores_ingresados["Y"], valores_ingresados["k"], valores_ingresados["h"]

    # ====== CÁLCULOS ======
    oferta_real = M / P
    # Despejamos r: r = (kY - M/P) / h
    r_equilibrio = (k * Y_val - oferta_real) / h

    with col_form2:
        st.markdown("**Tasa de Interés de Equilibrio (r):**")
        st.latex(f"r = \\frac{{{k}({Y_val}) - {oferta_real}}}{{{h}}}")
        st.markdown(f"### ➡️ r* = `{r_equilibrio:.4f}` ({r_equilibrio*100:.2f}%)")

    st.divider()
    col_pasos, col_grafico = st.columns(2)

    with col_pasos:
        st.subheader("📝 Resolución del Mercado")
        st.markdown("1. Calcular Saldos Reales:")
        st.latex(f"M/P = {oferta_real:.2f}")
        st.markdown("2. Igualar a la Demanda L:")
        st.latex(f"{oferta_real:.2f} = {k}({Y_val}) - {h} \\cdot r")
        st.markdown("3. Despejar r:")
        st.latex(f"r = {r_equilibrio:.4f}")
        st.info("💡 **Insight:** Si el Banco Central aumenta M, la tasa de interés bajará (Política Monetaria Expansiva).")

    with col_grafico:
        st.subheader("📈 Equilibrio Ms = Md")
        r_range = np.linspace(0, r_equilibrio * 2 if r_equilibrio > 0 else 0.1, 50)
        L_demand = k * Y_val - h * r_range
        
        df_grafico = pd.DataFrame({
            "Demanda de Dinero (L)": L_demand,
            "Tasa de Interés (r)": r_range
        }).set_index("Demanda de Dinero (L)")
        
        st.line_chart(df_grafico, color="#F44336")
        st.caption("La oferta monetaria real es una línea vertical en M/P (no dibujada aquí para simplificar el eje r).")

    # ====== ANÁLISIS MARGINAL (PENDIENTE LM) ======
    st.divider()
    st.subheader("🧮 Análisis Marginal (Derivadas y Pendiente LM)")
    st.markdown("La curva LM representa todas las combinaciones de Y y r que equilibran este mercado. ¿Cómo cambia 'r' cuando cambia el ingreso 'Y'?")
    
    M_sym, P_sym, Y_sym, k_sym, h_sym, r_sym = sp.symbols('M P Y k h r')
    # Despejamos r simbólicamente
    funcion_r = (k_sym * Y_sym - (M_sym / P_sym)) / h_sym
    
    opciones_dinero = {"Ingreso (Y)": Y_sym, "Oferta Monetaria (M)": M_sym}
    simbolo_derivar = opciones_dinero[st.selectbox("Derivar Tasa de Interés (r) respecto a:", list(opciones_dinero.keys()))]
    
    derivada_r = sp.diff(funcion_r, simbolo_derivar)
    valor_derivada = derivada_r.subs({k_sym: k, h_sym: h, M_sym: M, P_sym: P, Y_sym: Y_val})
    
    c1_der, c2_der = st.columns(2)
    with c1_der: st.latex(f"\\frac{{\\partial r}}{{\\partial {simbolo_derivar}}} = {sp.latex(derivada_r)}")
    with c2_der: st.latex(f"\\frac{{\\partial r}}{{\\partial {simbolo_derivar}}} = {float(valor_derivada):.6f}")
    
    with st.expander(f"🔍 Ver el paso a paso algebraico de la derivada"):
        if simbolo_derivar == Y_sym:
            st.markdown("Esta es la **Pendiente de la curva LM**:")
            st.latex(f"\\frac{{\\partial r}}{{\\partial Y}} = \\frac{{\\partial}}{{\\partial Y}} \\left( \\frac{{kY}}{{h}} - \\frac{{M/P}}{{h}} \\right) = \\frac{{k}}{{h}}")
            st.write(f"Con tus datos, por cada unidad que suba el PIB, la tasa de interés debe subir {float(valor_derivada):.6f} para mantener el mercado en equilibrio.")
# ==========================================
# MÓDULO 6: MODELO IS-LM (EQUILIBRIO GENERAL)
# ==========================================
elif tema_seleccionado == "Modelo IS-LM":
    st.title("Laboratorio de Macroeconomía 📊")
    tema = datos["macroeconomia_1"]["is_lm"]
    st.header(tema["nombre"])

    st.subheader("Sistema de Ecuaciones Simultáneas")
    col_form1, col_form2 = st.columns(2)
    with col_form1:
        st.markdown("**Curva IS (Mercado de Bienes):**")
        st.latex("Y = C_0 + c_1(Y - T) + I_0 - b \\cdot r + G")
    with col_form2:
        st.markdown("**Curva LM (Mercado de Dinero):**")
        st.latex("\\frac{M}{P} = kY - h \\cdot r")

    st.divider()
    st.subheader("Configuración de Variables")
    col_input1, col_input2, col_input3 = st.columns(3)
    valores_ingresados = {}

    # Generar inputs divididos en 3 columnas para que no ocupe tanta pantalla
    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        if i % 3 == 0: col = col_input1
        elif i % 3 == 1: col = col_input2
        else: col = col_input3
        
        with col:
            paso = 0.01 if simbolo in ["c1", "k"] else 10.0
            valores_ingresados[simbolo] = st.number_input(f"{simbolo}: {info['nombre']}", value=float(info['valor_defecto']), step=paso)

    C0, c1, T, I0, b, G = [valores_ingresados[x] for x in ["C0", "c1", "T", "I0", "b", "G"]]
    M, P, k, h = [valores_ingresados[x] for x in ["M", "P", "k", "h"]]

    # ====== MOTOR MATEMÁTICO SYMPY (SISTEMA 2x2) ======
    Y_sym, r_sym = sp.symbols('Y r')
    
    eq_IS = sp.Eq(Y_sym, C0 + c1*(Y_sym - T) + I0 - b*r_sym + G)
    eq_LM = sp.Eq(M/P, k*Y_sym - h*r_sym)
    
    # Resolver el sistema
    solucion = sp.solve((eq_IS, eq_LM), (Y_sym, r_sym))
    Y_eq = float(solucion[Y_sym])
    r_eq = float(solucion[r_sym])

    st.divider()
    col_res, col_grafico = st.columns(2)

    with col_res:
        st.subheader("🎯 Equilibrio General")
        st.markdown("Al resolver el sistema de ecuaciones, encontramos el único punto donde ambos mercados están en paz:")
        st.latex(f"Y^* = {Y_eq:,.2f}")
        st.latex(f"r^* = {r_eq:.4f} \\quad ({r_eq*100:.2f}\\%)")
        
        st.info("💡 **Prueba de Interacción:** Sube el Gasto Público ($G$). Verás que el PIB ($Y$) crece, pero la tasa de interés ($r$) también sube. A esto se le llama **Efecto Expulsión (Crowding Out)**, porque el alza en $r$ destruye parte de la Inversión privada.")

    with col_grafico:
        st.subheader("📈 Gráfico IS-LM")
        # Rango de PIB alrededor del equilibrio para graficar las cruces
        Y_range = np.linspace(Y_eq * 0.7, Y_eq * 1.3, 100)
        
        # Despejamos 'r' de ambas ecuaciones para graficar
        r_IS = (C0 - c1*T + I0 + G - (1 - c1)*Y_range) / b
        r_LM = (k*Y_range - (M/P)) / h
        
        df_grafico = pd.DataFrame({
            "Curva IS (Bienes)": r_IS,
            "Curva LM (Dinero)": r_LM,
            "PIB (Y)": Y_range
        }).set_index("PIB (Y)")
        
        st.line_chart(df_grafico)

    # ====== ANÁLISIS MARGINAL (MULTIPLICADORES) ======
    st.divider()
    st.subheader("🧮 Análisis Marginal (Multiplicadores de Política)")
    st.markdown("¿Qué pasa si el Gobierno o el Banco Central intervienen? Encontremos el impacto de sus políticas.")
    
    C0_s, c1_s, T_s, I0_s, b_s, G_s, M_s, P_s, k_s, h_s = sp.symbols('C_0 c_1 T I_0 b G M P k h')
    
    # Fórmula analítica del PIB (Y) resuelta del sistema IS-LM
    Y_formula_general = (h_s*(C0_s - c1_s*T_s + I0_s + G_s) + b_s*(M_s/P_s)) / (h_s*(1 - c1_s) + b_s*k_s)
    
    opciones_islm = {
        "Política Fiscal (Gasto G)": G_s,
        "Política Monetaria (Oferta M)": M_s,
        "Política Tributaria (Impuestos T)": T_s
    }
    
    simbolo_derivar = opciones_islm[st.selectbox("Evaluar impacto en el PIB (Y) ante cambios en:", list(opciones_islm.keys()))]
    
    derivada_islm = sp.diff(Y_formula_general, simbolo_derivar)
    valor_derivada = derivada_islm.subs({
        C0_s: C0, c1_s: c1, T_s: T, I0_s: I0, b_s: b, G_s: G, 
        M_s: M, P_s: P, k_s: k, h_s: h
    })
    
    c1_der, c2_der = st.columns(2)
    with c1_der:
        st.markdown(f"**Multiplicador Teórico:**")
        st.latex(f"\\frac{{\\partial Y}}{{\\partial {simbolo_derivar}}} = {sp.latex(derivada_islm)}")
    with c2_der:
        st.markdown("**Efecto Numérico Real:**")
        st.latex(f"\\frac{{\\partial Y}}{{\\partial {simbolo_derivar}}} = {float(valor_derivada):.4f}")
        
    with st.expander("🔍 Entender este Multiplicador"):
        if simbolo_derivar == G_s:
            st.markdown("Este es el **multiplicador fiscal con mercado de dinero**. Es menor que el multiplicador keynesiano simple $\\frac{1}{1-c_1}$ porque asume que al subir el gasto, sube la demanda de dinero, lo que sube la tasa de interés y reduce la inversión privada.")
        elif simbolo_derivar == M_s:
            st.markdown("Este es el **multiplicador de la política monetaria**. Muestra cuánto crece el PIB si el Banco de la República inyecta liquidez. Funciona porque al haber más dinero, baja la tasa de interés y se estimula la inversión empresarial.")
        elif simbolo_derivar == T_s:
            st.markdown("El multiplicador de los **impuestos** es negativo. Si el gobierno sube impuestos, la renta disponible de las familias cae, consumen menos, y el PIB se contrae.")
# ==========================================
# MÓDULO 7: GOBIERNO Y POLÍTICA FISCAL (EL JEFE FINAL)
# ==========================================
elif tema_seleccionado == "Gobierno y Política Fiscal":
    st.title("Laboratorio de Macroeconomía 📊")
    tema = datos["macroeconomia_1"]["gobierno"]
    st.header(tema["nombre"])

    st.subheader("Estructura de las Finanzas Públicas")
    col_f1, col_f2 = st.columns(2)
    with col_f1:
        st.markdown("**1. Función de Recaudación:**")
        st.latex("T = T_0 + t \\cdot Y")
    with col_f2:
        st.markdown("**2. Balance Presupuestario (BS):**")
        st.latex("BS = T - G")

    st.divider()
    st.subheader("Configuración de Política Fiscal")
    col_in1, col_in2 = st.columns(2)
    val = {}

    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        with col_in1 if i % 2 == 0 else col_in2:
            with st.container(border=True):
                paso = 0.01 if simbolo == "t" else 100.0
                val[simbolo] = st.number_input(f"{info['nombre']} ({simbolo})", value=float(info['valor_defecto']), step=paso)
                with st.expander("📖 Info"): st.markdown(info['ayuda_real'])

    G, T0, t, Y_act = val["G"], val["T0"], val["t"], val["Y"]

    # ====== CÁLCULOS ======
    recaudo_total = T0 + (t * Y_act)
    balance = recaudo_total - G

    st.divider()
    c_res1, c_res2 = st.columns(2)

    with c_res1:
        st.subheader("💰 Resultado Fiscal")
        st.write(f"Recaudación Total (T): **{recaudo_total:,.2f}**")
        st.write(f"Gasto Público (G): **{G:,.2f}**")
        
        if balance > 0:
            st.success(f"### Superávit Fiscal: `{balance:,.2f}`")
            st.markdown("El gobierno está ahorrando. Esto puede usarse para reducir deuda pública.")
        elif balance < 0:
            st.error(f"### Déficit Fiscal: `{balance:,.2f}`")
            st.markdown("El gobierno gasta más de lo que recibe. Requiere financiamiento (deuda o emisión).")
        else:
            st.warning(f"### Presupuesto Equilibrado: `0.00`平衡")

    with c_res2:
        st.subheader("📈 Análisis de Sostenibilidad")
        # Gráfico del Balance respecto al PIB (Y)
        y_range = np.linspace(Y_act * 0.5, Y_act * 1.5, 50)
        bs_range = (T0 + t * y_range) - G
        
        df_fiscal = pd.DataFrame({"Balance (BS)": bs_range, "PIB (Y)": y_range}).set_index("PIB (Y)")
        st.line_chart(df_fiscal, color="#FF5722")
        st.caption("La pendiente de esta línea es 't'. Muestra cómo el balance mejora automáticamente cuando la economía crece.")

    # ====== ANÁLISIS MARGINAL (ESTABILIZADORES) ======
    st.divider()
    st.subheader("🧮 Análisis Marginal (Estabilizadores Automáticos)")
    st.markdown("Según De Gregorio, la tasa impositiva 't' actúa como un estabilizador. Derivemos el Balance para ver qué tan sensible es al ciclo económico.")
    
    T0_s, t_s, Y_s, G_s = sp.symbols('T_0 t Y G')
    funcion_BS = (T0_s + t_s * Y_s) - G_s
    
    derivada_BS = sp.diff(funcion_BS, Y_s) # Sensibilidad ante el ingreso
    
    col_d1, col_d2 = st.columns(2)
    with col_d1:
        st.markdown("**Sensibilidad del Balance ante el PIB:**")
        st.latex(f"\\frac{{\\partial BS}}{{\\partial Y}} = {sp.latex(derivada_BS)}")
    with col_d2:
        st.markdown("**Valor con tus datos:**")
        st.latex(f"\\frac{{\\partial BS}}{{\\partial Y}} = {t}")
        st.info(f"💡 Esto significa que por cada peso que sube el PIB, el déficit se reduce en {t} pesos de forma automática.")

    with st.expander("🔍 Interpretación para el Examen"):
        st.markdown(f"""
        **¿Por qué es importante esta derivada?**
        Si la tasa impositiva $t$ es alta (como tu valor de {t*100}%), el gobierno recauda mucho más rápido cuando la economía crece, frenando un posible recalentamiento. 
        Al mismo tiempo, si la economía cae, el recaudo cae rápido, dejando más dinero en el bolsillo de la gente. 
        **Conclusión:** Una 't' mayor suaviza los ciclos económicos pero reduce el multiplicador keynesiano.
        """)