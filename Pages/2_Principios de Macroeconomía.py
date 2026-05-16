import json
import streamlit as st
import pandas as pd
import numpy as np
import sympy as sp
import google.generativeai as genai
import diseno

diseno.cargar_estilos_premium()
# ==========================================
# 1. CARGAR DATOS ESPECÍFICOS DE LA MATERIA
# ==========================================
with open('datos/principios_macro.json', 'r', encoding='utf-8') as file:
    datos = json.load(file)

# ==========================================
# 2. SELECTOR DE TEMA
# ==========================================
# Extraemos los nombres de los módulos directamente del JSON de forma automática
opciones_temas = [datos["modulos"][modulo]["nombre"] for modulo in datos["modulos"]]
tema_seleccionado = st.sidebar.selectbox("Selecciona un tema", opciones_temas)

# ==========================================
# MÓDULO 1: PIB (ENFOQUE GASTO)
# ==========================================
if tema_seleccionado == "PIB (Enfoque Gasto)":
    st.title("Laboratorio de Macroeconomía 📊")
    # Conexión actualizada a la nueva estructura JSON
    tema = datos["modulos"]["pib_gasto"]
    st.markdown(f"<h2><i class='fas fa-chart-line' style='color:#00FFAA;'></i> {tema['nombre']}</h2>", unsafe_allow_html=True)

    st.subheader("Modelo Matemático")
    col_form1, col_form2 = st.columns(2)
    with col_form1:
        st.markdown("**Fórmula General Estándar:**")
        st.latex(tema.get("formula_general", "Y = C + I + G + (X - M)"))

    st.divider()
    st.subheader("Configuración de Variables")
    col_input1, col_input2 = st.columns(2)
    valores_ingresados = {}

    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        with col_input1 if i % 2 == 0 else col_input2:
            with st.container(border=True):
                # Saltos de 500,000 para el dinero, 0.05 para la propensión
                paso_v = 0.05 if simbolo == "c1" else 500000.0
                valores_ingresados[simbolo] = st.number_input(
                    f"{info.get('nombre', simbolo)} ({simbolo})", 
                    value=float(info.get('valor_defecto', 0)),
                    step=paso_v,
                    key=f"pib_mult_input_{simbolo}"
                )
                with st.expander("💡 Info"):
                    st.markdown(info.get('ayuda_real', 'Información no disponible.'))

    # Extracción segura
    C0 = valores_ingresados.get("C0", 800000.0)
    c1 = valores_ingresados.get("c1", 0.8)
    T = valores_ingresados.get("T", 200000.0)
    I = valores_ingresados.get("I", 1000000.0)
    G = valores_ingresados.get("G", 1500000.0)

    if c1 != 1:
        multiplicador = 1 / (1 - c1)
        gasto_autonomo_interno = C0 - (c1 * T) + I + G
        Y_resultado = multiplicador * gasto_autonomo_interno
        C_real = C0 + (c1 * (Y_resultado - T))
    else:
        multiplicador, Y_resultado, C_real = 0, 0, 0

    with col_form2:
        st.markdown("**Fórmula con tus Valores Actuales:**")
        st.latex(rf"Y = \frac{{1}}{{1 - {c1}}} \cdot [{C0} - {c1}({T}) + {I} + {G}]")
        st.metric(label="PIB de Equilibrio (Y*)", value=f"${Y_resultado:,.2f}")

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
    
    var_seleccionada = st.radio("¿Qué variable deseas derivar con respecto a Y?", list(opciones_pib.keys()), horizontal=True, key="sel_der_pib")
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
# MÓDULO 3: MERCADO DE DINERO (CURVA LM)
# ==========================================
elif tema_seleccionado == "Mercado de Dinero":
    st.title("Laboratorio de Macroeconomía 📊")
    # Conexión actualizada
    tema = datos["modulos"]["mercado_dinero"]
    st.header(tema["nombre"])

    st.subheader("Modelo Matemático de Liquidez")
    col_form1, col_form2 = st.columns(2)
    with col_form1:
        st.markdown("**Condición de Equilibrio:**")
        st.latex(tema.get("formula_general", "\\frac{M}{P} = L(r, Y)"))

    st.divider()
    st.subheader("Configuración de Variables")
    col_input1, col_input2 = st.columns(2)
    valores_ingresados = {}

    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        with col_input1 if i % 2 == 0 else col_input2:
            with st.container(border=True):
                paso = 0.01 if simbolo in ["k", "h"] else 100.0
                valores_ingresados[simbolo] = st.number_input(
                    f"{info.get('nombre', simbolo)} ({simbolo})", 
                    value=float(info.get('valor_defecto', 0)), 
                    step=paso
                )
                with st.expander("📖 Info"): 
                    st.markdown(info.get('ayuda_real', 'Información no disponible.'))

    M, P, Y_val, k, h = valores_ingresados["M"], valores_ingresados["P"], valores_ingresados["Y"], valores_ingresados["k"], valores_ingresados["h"]

    # ====== CÁLCULOS ======
    oferta_real = M / P
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
    funcion_r = (k_sym * Y_sym - (M_sym / P_sym)) / h_sym
    
    opciones_dinero = {"Ingreso (Y)": Y_sym, "Oferta Monetaria (M)": M_sym}
    simbolo_derivar = opciones_dinero[st.radio("Derivar Tasa de Interés (r) respecto a:", list(opciones_dinero.keys()), horizontal=True)]
    
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
# MÓDULO 4: MODELO IS-LM (EQUILIBRIO GENERAL)
# ==========================================
elif tema_seleccionado == "Modelo IS-LM":
    st.title("Laboratorio de Macroeconomía 📊")
    # Conexión actualizada (asegúrate que en tu JSON la llave sea "is_lm" o "is_lm_basico")
    tema = datos["modulos"]["is_lm_basico"] if "is_lm_basico" in datos["modulos"] else datos["modulos"]["is_lm"]
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

    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        if i % 3 == 0: col = col_input1
        elif i % 3 == 1: col = col_input2
        else: col = col_input3
        
        with col:
            paso = 0.01 if simbolo in ["c1", "k"] else 10.0
            valores_ingresados[simbolo] = st.number_input(
                f"{simbolo}: {info.get('nombre', simbolo)}", 
                value=float(info.get('valor_defecto', 0)), 
                step=paso
            )

    C0, c1, T, I0, b, G = [valores_ingresados[x] for x in ["C0", "c1", "T", "I0", "b", "G"]]
    M, P, k, h = [valores_ingresados[x] for x in ["M", "P", "k", "h"]]

    # ====== MOTOR MATEMÁTICO SYMPY (SISTEMA 2x2) ======
    Y_sym, r_sym = sp.symbols('Y r')
    
    eq_IS = sp.Eq(Y_sym, C0 + c1*(Y_sym - T) + I0 - b*r_sym + G)
    eq_LM = sp.Eq(M/P, k*Y_sym - h*r_sym)
    
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
        Y_range = np.linspace(Y_eq * 0.7, Y_eq * 1.3, 100)
        
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
    
    Y_formula_general = (h_s*(C0_s - c1_s*T_s + I0_s + G_s) + b_s*(M_s/P_s)) / (h_s*(1 - c1_s) + b_s*k_s)
    
    opciones_islm = {
        "Política Fiscal (Gasto G)": G_s,
        "Política Monetaria (Oferta M)": M_s,
        "Política Tributaria (Impuestos T)": T_s
    }
    
    simbolo_derivar = opciones_islm[st.radio("Evaluar impacto en el PIB (Y) ante cambios en:", list(opciones_islm.keys()), horizontal=True)]
    
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