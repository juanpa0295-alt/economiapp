import streamlit as st
import json
import pandas as pd
import sympy as sp
import numpy as np
import google.generativeai as genai
import math
import streamlit.components.v1 as components

st.set_page_config(page_title="App Econ", layout="wide")

# # ====== MENÚ LATERAL (ARQUITECTURA CURRICULAR EXACTA) ======
with st.sidebar:
    st.markdown("<h1><i class='fas fa-graduation-cap' style='color:#00FFAA;'></i> Navegación</h1>", unsafe_allow_html=True)
    
    materia_seleccionada = st.selectbox(
        "Selecciona la Materia:", 
        [
            "Principios de Macroeconomía", 
            "Macroeconomía 1", 
            "Teoría de Juegos", 
            "Matemáticas 1", 
            "Matemáticas 2", 
            "Matemáticas 3", 
            "Estadística 2"
        ]
    )
    
    if materia_seleccionada == "Principios de Macroeconomía":
        st.markdown("<h3><i class='fas fa-chart-line' style='color:#00FFAA;'></i> Temas Activos</h3>", unsafe_allow_html=True)
        tema_seleccionado = st.radio("Selecciona el Tema:", ["PIB (Enfoque Gasto)", "Mercado de Dinero", "Modelo IS-LM"])
        
    elif materia_seleccionada == "Macroeconomía 1":
        st.markdown("<h3><i class='fas fa-exchange-alt' style='color:#00FFAA;'></i> Temas Activos</h3>", unsafe_allow_html=True)
        tema_seleccionado = st.radio("Selecciona el Tema:", ["Teoría del Consumo", "Consumo Intertemporal", "Inversión", "Gobierno y Política Fiscal"])
        
    elif materia_seleccionada == "Teoría de Juegos":
        st.markdown("<h3><i class='fas fa-chess-knight' style='color:#00FFAA;'></i> Preparación Parcial</h3>", unsafe_allow_html=True)
        tema_seleccionado = st.radio("Selecciona el Tema:", [
            "Módulo 11: Equilibrios de Nash (Puras)",
            "Módulo 12: Estrategias Mixtas (Cálculo p y q)",
            "Módulo 13: Forma Extensiva y Dominancia"
        ])
        
    elif materia_seleccionada == "Matemáticas 1":
        st.markdown("<h3><i class='fas fa-infinity' style='color:#00FFAA;'></i> Álgebra y Límites</h3>", unsafe_allow_html=True)
        tema_seleccionado = st.radio("Selecciona el Tema:", ["Módulo 14: Cálculo de Límites y Continuidad"])
        
    elif materia_seleccionada == "Matemáticas 2":
        st.markdown("<h3><i class='fas fa-subscript' style='color:#00FFAA;'></i> Cálculo Diferencial</h3>", unsafe_allow_html=True)
        tema_seleccionado = st.radio("Selecciona el Tema:", ["Módulo 15: Optimización de 1 Variable"])
        
    elif materia_seleccionada == "Matemáticas 3":
        st.markdown("<h3><i class='fas fa-chart-area' style='color:#00FFAA;'></i> Cálculo Integral</h3>", unsafe_allow_html=True)
        tema_seleccionado = st.radio("Selecciona el Tema:", ["Módulo 16: Áreas e Integrales"])
        
    else: # Estadística 2 (Siempre al final)
        st.markdown("<h3><i class='fas fa-chart-pie' style='color:#00FFAA;'></i> Temas Activos</h3>", unsafe_allow_html=True)
        tema_seleccionado = st.radio("Selecciona el Tema:", ["Estimadores Estadísticos", "Intervalos y Tamaño de Muestra", "Pruebas de Hipótesis"])
    
    st.divider()
    tipo_cuenta = st.radio("Suscripción (Monetización):", ["Básica (Gratis)", "Premium (Pago)"], index=0)

# ====== CARGA DE DATOS ======
with open('datos_materias.json', 'r', encoding='utf-8') as f:
    datos = json.load(f)

# ====== LÓGICA DE FONDOS DINÁMICOS POR MATERIA ======
fondos_materias = {
    "Principios de Macroeconomía": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop", 
    "Macroeconomía 1": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop", 
    "Estadística 2": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
}

fondo_actual = fondos_materias.get(materia_seleccionada, fondos_materias["Principios de Macroeconomía"])

# ====== DISEÑO PREMIUM EVOLUCIONADO (CSS LIMPIO Y UNIFICADO) ======
st.markdown(f"""
<style>
    /* 1. Fuentes e Iconos */
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
    
    html, body, [class*="css"], .stMarkdown, .stText {{ font-family: 'Montserrat', sans-serif !important; }}

    /* 2. Softer Dark Mode + Fondo Dinámico */
    .stApp, [data-testid="stAppViewContainer"] {{
        background-color: #0a192f !important; 
        background-image: 
            linear-gradient(rgba(10, 25, 47, 0.90), rgba(10, 25, 47, 0.95)), 
            url("{fondo_actual}") !important;
        background-size: cover !important;
        background-position: center !important;
        background-attachment: fixed !important;
    }}

    /* 3. Títulos Neón */
    h1, h2 {{
        color: #00FFAA !important;
        text-shadow: 0px 2px 4px rgba(0,0,0,0.5);
        font-weight: 800 !important;
    }}

    /* 4. Glassmorphism (Cartas Suaves) */
    div[data-testid="stVerticalBlock"] div[style*="border"] {{
        border-radius: 12px !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important; 
        background-color: rgba(17, 34, 64, 0.7) !important; 
        backdrop-filter: blur(4px) !important; 
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3) !important;
        transition: all 0.3s ease;
    }}
    
    div[data-testid="stVerticalBlock"] div[style*="border"]:hover {{
        border-color: #00FFAA !important;
        box-shadow: 0 0 15px rgba(0, 255, 170, 0.15) !important;
        transform: translateY(-2px);
    }}

    /* 5. Botones Estilo Quant */
    .stButton > button {{
        background: linear-gradient(90deg, #00FFAA 0%, #00b377 100%) !important;
        color: #000000 !important;
        border: none !important;
        border-radius: 25px !important;
        font-weight: 800 !important;
        letter-spacing: 0.5px;
        transition: all 0.3s ease !important;
    }}
    
    .stButton > button:hover {{
        transform: scale(1.05) !important;
        box-shadow: 0 0 20px rgba(0, 255, 170, 0.4) !important;
    }}

    /* 6. Expanders y Alertas */
    .streamlit-expanderHeader {{
        background-color: rgba(17, 34, 64, 0.9) !important;
        color: #00FFAA !important;
        font-weight: 600;
        border-radius: 8px !important;
    }}
    
    div[data-testid="stAlert"] {{
        border-radius: 10px;
        background-color: rgba(17, 34, 64, 0.9) !important;
        color: #E6F1FF !important;
    }}
</style>
""", unsafe_allow_html=True)

# ==========================================
# MÓDULO 1: PIB (ENFOQUE GASTO)
# ==========================================
if tema_seleccionado == "PIB (Enfoque Gasto)":
    st.title("Laboratorio de Macroeconomía 📊")
    tema = datos["macroeconomia_1"]["pib_gasto"]
    st.markdown(f"<h2><i class='fas fa-chart-line' style='color:#00FFAA;'></i> {tema['nombre']}</h2>", unsafe_allow_html=True)

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

    C0 = valores_ingresados["C0"]
    c1 = valores_ingresados["c1"]
    Y_val = valores_ingresados["Y"]
    T_val = valores_ingresados["T"]

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
        # Aquí aplicamos la "carpintería" pedagógica
        st.subheader("📝 Resolución Paso a Paso")
        
        st.markdown("**1. Calculamos el Ingreso Disponible ($Y_d$):**")
        st.latex(f"Y_d = Y - T")
        st.latex(f"Y_d = {Y_val} - {T_val} = {Y_val - T_val}")
        
        st.markdown("**2. Sustituimos en la función de consumo:**")
        st.latex(f"C = C_0 + c_1(Y_d)")
        st.latex(f"C = {C0} + {c1}({Y_val - T_val})")
        
        st.markdown("**3. Calculamos el Consumo Inducido:**")
        consumo_inducido = c1 * (Y_val - T_val)
        st.latex(f"C = {C0} + {consumo_inducido}")
        
        st.markdown("**4. Consumo Total:**")
        st.latex(f"C = {float(C_total):,.2f}")

    with col_grafico:
        # Mejora: Gráfica de Función de Consumo vs Recta de 45°
        st.subheader("📈 Función de Consumo")
        st.markdown("Visualización del consumo frente a diferentes niveles de ingreso.")
        
        # Generamos un rango de ingresos para la gráfica (desde 0 hasta el doble del ingreso actual)
        # Asegúrate de importar numpy como np al inicio de tu código
        import numpy as np 
        rango_Y = np.linspace(0, Y_val * 2 if Y_val > 0 else 1000, 20)
        rango_C = [C0 + c1 * (y - T_val) for y in rango_Y]
        
        datos_grafico = pd.DataFrame({
            "Ingreso (Y)": rango_Y,
            "Consumo (C)": rango_C,
            "Recta 45° (Y=C)": rango_Y
        }).set_index("Ingreso (Y)")
        
        # Usamos st.line_chart para una gráfica macroeconómica estándar
        st.line_chart(datos_grafico, color=["#FF9800", "#555555"])

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
        
    # Integración del concepto Freemium/Premium
    with st.expander(f"⭐ [Premium] Ver la carpintería algebraica de la derivada respecto a {simbolo_derivar}"):
        st.info("💡 En la versión gratuita el estudiante ve el resultado. En la Premium, ve este paso a paso detallado para estudiar para sus parciales.")
        if simbolo_derivar == Y_sym:
            st.markdown("**Regla de la Suma y Cadena:**")
            st.latex(f"\\frac{{\\partial C}}{{\\partial Y}} = \\frac{{\\partial}}{{\\partial Y}} (C_0) + \\frac{{\\partial}}{{\\partial Y}} [c_1(Y - T)]")
            st.markdown("1. La derivada del Consumo Autónomo ($C_0$) respecto a $Y$ es **$0$**, ya que es una constante.")
            st.markdown("2. Distribuimos la propensión marginal ($c_1$): $c_1 Y - c_1 T$.")
            st.markdown("3. La derivada de $c_1 Y$ respecto a $Y$ es **$c_1$**. La derivada de $-c_1 T$ es **$0$**.")
            st.latex(f"= 0 + c_1 - 0 = c_1")
        elif simbolo_derivar == T_sym:
            st.markdown("**Regla de la Suma y Cadena:**")
            st.latex(f"\\frac{{\\partial C}}{{\\partial T}} = \\frac{{\\partial}}{{\\partial T}} (C_0 + c_1 Y - c_1 T)")
            st.markdown("1. La derivada de las constantes $C_0$ y $c_1 Y$ respecto a los impuestos ($T$) es **$0$**.")
            st.markdown("2. La derivada de $-c_1 T$ respecto a $T$ es **$-c_1$**.")
            st.latex(f"= 0 + 0 - c_1 = -c_1")
            st.caption("Nota económica: Por eso un aumento en los impuestos reduce el consumo en una proporción igual a la propensión marginal a consumir.")

# ==========================================
# MÓDULO 3: CONSUMO INTERTEMPORAL 
# ==========================================
elif tema_seleccionado == "Consumo Intertemporal":
    st.title("Laboratorio de Macroeconomía 📊")
    tema = datos["macroeconomia_1"]["consumo_intertemporal"]
    st.header(tema["nombre"])
    
    # Creamos pestañas para separar el modelo básico del avanzado
    tab_basico, tab_n_periodos = st.tabs(["📘 2 Períodos (Básico)", "🚀 N Períodos (Avanzado - Premium)"])

    # ==========================================
    # PESTAÑA 1: MODELO DE 2 PERÍODOS
    # ==========================================
    with tab_basico:
        st.subheader("Modelo Matemático (2 Períodos)")
        col_form1, col_form2 = st.columns(2)
        with col_form1:
            st.markdown("**1. Restricción Presupuestaria (Valor Presente):**")
            st.latex(r"W = Y_1 + \frac{Y_2}{1 + r}")
            st.markdown("**2. Función de Utilidad (Cobb-Douglas):**")
            st.latex(r"U(C_1, C_2) = C_1^\alpha \cdot C_2^\beta")

        st.divider()
        st.subheader("Configuración de Variables")
        col_input1, col_input2 = st.columns(2)
        valores_ingresados = {}

        for i, (simbolo, info) in enumerate(tema["variables"].items()):
            with col_input1 if i % 2 == 0 else col_input2:
                with st.container(border=True):
                    # Agregamos un key único a los inputs básicos para evitar colisiones
                    valores_ingresados[simbolo] = st.number_input(f"{info['nombre']} ({simbolo})", value=float(info['valor_defecto']), step=0.01, key=f"basic_input_{simbolo}")

        # Extracción segura de variables
        Y1 = float(valores_ingresados.get("Y1", 1000.0))
        Y2 = float(valores_ingresados.get("Y2", 1100.0))
        r = float(valores_ingresados.get("r", 0.10))
        alpha = float(valores_ingresados.get("alpha", 0.5))
        beta = float(valores_ingresados.get("beta", 0.5))

        # ====== CÁLCULOS ======
        W = Y1 + (Y2 / (1 + r))
        C2_max = W * (1 + r)
        
        C1_optimo = (alpha / (alpha + beta)) * W
        C2_optimo = (beta / (alpha + beta)) * W * (1 + r)
        Utilidad_optima = (C1_optimo**alpha) * (C2_optimo**beta)

        with col_form2:
            st.markdown("**Tu Riqueza Total (Valor Presente - W):**")
            st.latex(rf"W = {Y1} + \frac{{{Y2}}}{{1 + {r}}}")
            st.markdown(f"### ➡️ W = `{W:,.2f}`")
            st.markdown("**Canasta Óptima Calculada:**")
            st.latex(rf"C_1^* = {C1_optimo:,.2f} \quad | \quad C_2^* = {C2_optimo:,.2f}")

        st.divider()
        col_pasos, col_grafico = st.columns(2)

        with col_pasos:
            st.subheader("📝 Resolución Paso a Paso")
            
            st.markdown("**1. Cálculo de la Riqueza ($W$):**")
            st.latex(rf"W = {Y1} + \frac{{{Y2}}}{{1 + {r}}} = {W:,.2f}")
            
            st.markdown("**2. Proporciones de Consumo:**")
            fraccion_c1 = alpha / (alpha + beta)
            fraccion_c2 = beta / (alpha + beta)
            st.latex(rf"\text{{Fracción }} C_1 = \frac{{{alpha}}}{{{alpha} + {beta}}} = {fraccion_c1:,.2f}")
            
            st.markdown("**3. Consumo Óptimo Presente ($C_1^*$):**")
            st.latex(rf"C_1^* = {fraccion_c1:,.2f} \cdot {W:,.2f} = {C1_optimo:,.2f}")
            
            st.markdown("**4. Consumo Óptimo Futuro ($C_2^*$):**")
            st.latex(rf"C_2^* = {fraccion_c2:,.2f} \cdot {W:,.2f} \cdot (1 + {r}) = {C2_optimo:,.2f}")

        with col_grafico:
            st.subheader("📈 Restricción y Curva de Indiferencia")
            # Prevención de error por división por cero o arreglos vacíos
            limite_superior = W if W > 1 else 100
            c1_array = np.linspace(1, limite_superior, 100)
            
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
        
        var_seleccionada = st.selectbox("Selecciona qué análisis marginal deseas realizar:", list(opciones_fisher.keys()), key="select_marginal_2p")
        funcion_str, simbolo_derivar, funcion_elegida = opciones_fisher[var_seleccionada]
        
        derivada_elegida = sp.diff(funcion_elegida, simbolo_derivar)
        
        # Sustitución y evaluación segura
        if funcion_str == "W":
            valor_derivada = derivada_elegida.subs({Y1_sym: Y1, Y2_sym: Y2, r_sym: r})
        else:
            valor_derivada = derivada_elegida.subs({C1_sym: C1_optimo, C2_sym: C2_optimo, alpha_sym: alpha, beta_sym: beta})
        
        # Forzamos a float para evitar que SymPy rompa Streamlit
        valor_derivada_num = float(valor_derivada.evalf())
        
        col_der1, col_der2 = st.columns(2)
        with col_der1:
            st.markdown(f"**Derivada respecto a ${simbolo_derivar}$:**")
            st.latex(rf"\frac{{\partial {funcion_str}}}{{\partial {simbolo_derivar}}} = {sp.latex(derivada_elegida)}")
        
        with col_der2:
            st.markdown("**Resultado numérico en el punto actual/óptimo:**")
            st.latex(rf"\frac{{\partial {funcion_str}}}{{\partial {simbolo_derivar}}} = {valor_derivada_num:,.2f}")
            
        with st.expander(f"⭐ [Premium] Ver la carpintería algebraica respecto a {simbolo_derivar}"):
            if simbolo_derivar == r_sym:
                st.markdown("**Regla de la Cadena y Exponentes:**")
                st.latex(r"W = Y_1 + Y_2(1+r)^{-1}")
                st.markdown("1. La derivada de $Y_1$ (constante) es $0$.")
                st.markdown("2. Bajamos el exponente $-1$ multiplicando y restamos $1$ al exponente ($-1 - 1 = -2$).")
                st.markdown("3. Multiplicamos por la derivada interna de $(1+r)$, que es $1$.")
                st.latex(r"\frac{\partial W}{\partial r} = 0 + (-1) \cdot Y_2(1+r)^{-2} \cdot (1) = -\frac{Y_2}{(1+r)^2}")
            elif simbolo_derivar == Y2_sym:
                st.markdown("**Regla de la Constante Multiplicativa:**")
                st.latex(r"W = Y_1 + \left( \frac{1}{1+r} \right) Y_2")
                st.markdown("1. La derivada de $Y_1$ es $0$.")
                st.markdown("2. Derivamos $Y_2$ dejando su coeficiente constante intacto.")
                st.latex(r"\frac{\partial W}{\partial Y_2} = 0 + \frac{1}{1+r} \cdot 1 = \frac{1}{1+r}")
            elif simbolo_derivar == C1_sym:
                st.markdown("**Regla de la Potencia:**")
                st.markdown("1. Tratamos a $C_2^\beta$ como una constante.")
                st.markdown("2. Derivamos $C_1^\alpha$: bajamos el exponente $\alpha$ y le restamos 1.")
                st.latex(r"= \alpha \cdot C_1^{\alpha - 1} \cdot C_2^\beta")
            elif simbolo_derivar == C2_sym:
                st.markdown("**Regla de la Potencia:**")
                st.markdown("1. Tratamos a $C_1^\alpha$ como una constante.")
                st.markdown("2. Derivamos $C_2^\beta$: bajamos el exponente $\beta$ y le restamos 1.")
                st.latex(r"= \beta \cdot C_1^\alpha \cdot C_2^{\beta - 1}")

    # ==========================================
    # PESTAÑA 2: MODELO N PERÍODOS (GENERALIZACIÓN)
    # ==========================================
    with tab_n_periodos:
        st.subheader("Generalización a $N$ Períodos 🚀")
        st.info("💡 **Módulo Premium:** Comprende el impacto del Valor Presente a lo largo de múltiples períodos. Ideal para parciales de macroeconomía avanzada o matemáticas financieras.")
        
        st.markdown("**Ecuación de Riqueza en Valor Presente (Generalizada):**")
        st.latex(r"W = \sum_{t=1}^{N} \frac{Y_t}{(1+r)^{t-1}}")
        
        # --- 1. CONFIGURACIÓN CON TOOLTIPS ---
        col_n1, col_n2 = st.columns([1, 2])
        
        with col_n1:
            st.markdown("### Parámetros Globales")
            N_periodos = st.number_input(
                "Número de Períodos ($N$)", 
                min_value=2, max_value=10, value=3, step=1, key="n_per_input",
                help="El horizonte temporal del modelo. ¿Cuántos períodos de ingresos vas a evaluar?"
            )
            r_n = st.number_input(
                "Tasa de Interés ($r$)", 
                value=0.05, step=0.01, format="%.2f", key="r_n_input",
                help="El costo de oportunidad del dinero. Una tasa mayor descuenta más fuerte los ingresos futuros."
            )
        
        with col_n2:
            st.markdown("### Flujos de Ingreso ($Y_t$)")
            cols_ingresos = st.columns(3)
            ingresos_N = {}
            for t in range(1, int(N_periodos) + 1):
                with cols_ingresos[(t-1) % 3]:
                    ingresos_N[f"Y_{t}"] = st.number_input(
                        f"Ingreso Período {t}", 
                        value=1000.0, step=100.0, key=f"Y_N_{t}_input",
                        help=f"Ingreso nominal que se recibe en el momento t={t}."
                    )

        # ====== MOTOR MATEMÁTICO DINÁMICO (SYMPY) ======
        r_sym_n = sp.Symbol('r')
        Y_syms_dict = {f"Y_{t}": sp.Symbol(f"Y_{t}") for t in range(1, int(N_periodos) + 1)}
        
        W_expr_n = 0
        valores_presentes = [] # Para la gráfica
        
        for t in range(1, int(N_periodos) + 1):
            termino = Y_syms_dict[f"Y_{t}"] / (1 + r_sym_n)**(t - 1)
            W_expr_n += termino
            
            # Calculamos el valor presente de este flujo específico para la gráfica
            vp_flujo = float((ingresos_N[f"Y_{t}"] / (1 + r_n)**(t - 1)))
            valores_presentes.append(vp_flujo)
            
        sustituciones = {r_sym_n: r_n}
        sustituciones.update({Y_syms_dict[k]: v for k, v in ingresos_N.items()})
        
        W_num_n_sym = W_expr_n.subs(sustituciones)
        W_num_n = float(W_num_n_sym.evalf())
        
        st.divider()
        st.markdown(f"### ➡️ Riqueza Total Calculada ($W$) = `{W_num_n:,.2f}`")

        # --- 2. MEJORAS VISUALES: GRÁFICAS PEDAGÓGICAS ---
        col_graf_bar, col_graf_lin = st.columns(2)
        
        with col_graf_bar:
            st.subheader("📊 Efecto del Descuento ($Y_t$ vs Valor Presente)")
            st.markdown("Observa cómo la inflación/tasa de interés erosiona el valor real de los ingresos futuros.")
            
            df_flujos = pd.DataFrame({
                "Período": [f"t={t}" for t in range(1, int(N_periodos) + 1)],
                "Valor Nominal ($Y_t$)": list(ingresos_N.values()),
                "Valor Presente ($PV$)": valores_presentes
            }).set_index("Período")
            
            # Mostramos un gráfico de barras superpuesto o agrupado
            st.bar_chart(df_flujos, color=["#FF9800", "#4CAF50"])

        with col_graf_lin:
            st.subheader("📉 Sensibilidad a la Tasa ($W$ vs $r$)")
            st.markdown("Si la tasa de interés del mercado cambia, tu riqueza total reacciona así:")
            
            # Rango de tasas de interés de 0% a 20%
            r_rango = np.linspace(0.0, 0.20, 20)
            W_rango = []
            for r_sim in r_rango:
                sustituciones_sim = {r_sym_n: r_sim}
                sustituciones_sim.update({Y_syms_dict[k]: v for k, v in ingresos_N.items()})
                W_rango.append(float(W_expr_n.subs(sustituciones_sim).evalf()))
                
            df_sensibilidad = pd.DataFrame({
                "Tasa de Interés (r)": r_rango,
                "Riqueza Total (W)": W_rango
            }).set_index("Tasa de Interés (r)")
            
            st.line_chart(df_sensibilidad, color="#2196F3")

        # --- 3. ANÁLISIS MARGINAL Y CARPINTERÍA DINÁMICA ---
        st.divider()
        st.subheader("🧮 Derivadas Parciales (La Carpintería Premium)")
        st.markdown("Elige una variable para evaluar su impacto marginal exacto sobre tu riqueza.")
        
        opciones_derivar_n = ["Tasa de interés (r)"] + list(ingresos_N.keys())
        var_a_derivar_n = st.selectbox("Derivar Riqueza ($W$) respecto a:", opciones_derivar_n, key="select_dyn_n")
        
        if var_a_derivar_n == "Tasa de interés (r)":
            simbolo_obj = r_sym_n
            nombre_var = "r"
        else:
            simbolo_obj = Y_syms_dict[var_a_derivar_n]
            nombre_var = var_a_derivar_n
            
        derivada_dinamica = sp.diff(W_expr_n, simbolo_obj)
        valor_derivada_din_sym = derivada_dinamica.subs(sustituciones)
        valor_derivada_dinamica = float(valor_derivada_din_sym.evalf())
        
        col_dyn1, col_dyn2 = st.columns(2)
        with col_dyn1:
            st.markdown(f"**Expresión Algebraica de la Derivada:**")
            st.latex(rf"\frac{{\partial W}}{{\partial {nombre_var}}} = {sp.latex(derivada_dinamica)}")
        with col_dyn2:
            st.markdown("**Resultado Numérico:**")
            st.latex(rf"\frac{{\partial W}}{{\partial {nombre_var}}} = {valor_derivada_dinamica:,.4f}")
            
        # Carpintería paso a paso
        with st.expander(f"⭐ Ver paso a paso de la derivada respecto a {nombre_var}"):
            if var_a_derivar_n == "Tasa de interés (r)":
                st.markdown("**Paso 1: Identificar la regla.**")
                st.markdown("La Riqueza ($W$) es una suma de términos. Derivamos cada término usando la Regla de la Cadena y la Regla de la Potencia. El primer término ($Y_1$) no depende de $r$, por lo que su derivada es $0$.")
                
                st.markdown("**Paso 2: Derivación término a término.**")
                paso_a_paso_r = r"\frac{\partial W}{\partial r} = 0 "
                for t in range(2, int(N_periodos) + 1):
                    exponente = t - 1
                    paso_a_paso_r += rf"+ Y_{{{t}}} \cdot (-{exponente})(1+r)^{{-{exponente}-1}} \cdot (1) "
                st.latex(paso_a_paso_r)
                
                st.markdown("**Paso 3: Simplificación Algebraica.**")
                st.latex(rf"\frac{{\partial W}}{{\partial r}} = {sp.latex(derivada_dinamica)}")
                
                st.markdown("**Paso 4: Sustitución de valores (Tu escenario actual).**")
                st.markdown(f"Reemplazamos $r = {r_n}$ y los valores de $Y_t$ correspondientes:")
                st.latex(rf"\frac{{\partial W}}{{\partial r}} \approx {valor_derivada_dinamica:,.4f}")
                
                st.success("📝 **Conclusión Económica:** Un valor negativo confirma que al aumentar el costo del dinero (tasa de interés), el valor de tus flujos futuros pierde poder adquisitivo hoy.")
                
            else:
                t_val = int(nombre_var.split('_')[1])
                st.markdown("**Paso 1: Aislamiento de la variable.**")
                st.markdown(f"Queremos ver cómo un cambio aislado en el ingreso del período {t_val} ($Y_{{{t_val}}}$) afecta la riqueza. Matemáticamente, tratamos todos los demás ingresos ($Y_t$) como constantes. Su derivada será $0$.")
                
                st.markdown("**Paso 2: Regla del coeficiente constante.**")
                st.markdown(f"La ecuación general contiene el término: $\\frac{{Y_{{{t_val}}}}}{{(1+r)^{{{t_val}-1}}}}$. Podemos reescribirlo separando la variable de su coeficiente:")
                st.latex(rf"\left[ \frac{{1}}{{(1+r)^{{{t_val}-1}}}} \right] \cdot Y_{{{t_val}}}")
                
                st.markdown("**Paso 3: Derivación.**")
                st.markdown(f"La derivada de una constante multiplicada por una variable de grado 1 es simplemente la constante:")
                st.latex(rf"\frac{{\partial W}}{{\partial Y_{{{t_val}}}}} = \frac{{1}}{{(1+r)^{{{t_val}-1}}}}")
                
                st.markdown("**Paso 4: Sustitución Numérica.**")
                st.latex(rf"\frac{{\partial W}}{{\partial Y_{{{t_val}}}}} = \frac{{1}}{{(1 + {r_n})^{{{t_val}-1}}}} = {valor_derivada_dinamica:,.4f}")
                
                st.info(f"📝 **Conclusión Económica:** Por cada $1 adicional que proyectes recibir en el período {t_val}, tu riqueza en Valor Presente aumenta exactamente en ${valor_derivada_dinamica:,.4f}.")
                
# ==========================================
# MÓDULO 4: INVERSIÓN (DE GREGORIO & TOBIN)
# ==========================================
elif tema_seleccionado == "Inversión":
    st.title("Laboratorio de Macroeconomía 📊")
    tema = datos["macroeconomia_1"]["inversion"]
    st.markdown(f"<h2><i class='fas fa-exchange-alt' style='color:#00FFAA;'></i> <i class='fas fa-bullhorn' style='color:#00FFAA;'></i> {tema['nombre']}</h2>", unsafe_allow_html=True)

    st.subheader("Configuración de Variables")
    col_input1, col_input2 = st.columns(2)
    valores_ingresados = {}

    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        with col_input1 if i % 2 == 0 else col_input2:
            with st.container(border=True):
                # Validación de pasos y asignación de key único
                paso = 0.01 if simbolo in ["r", "delta", "alpha"] else 100.0
                valores_ingresados[simbolo] = st.number_input(
                    f"{info['nombre']} ({simbolo})", 
                    value=float(info['valor_defecto']), 
                    step=paso, 
                    key=f"inv_input_{simbolo}"
                )
                with st.expander("📖 Info"):
                    st.markdown(info['ayuda_real'])

    # Extracción segura
    Y_val = float(valores_ingresados.get("Y", 5000.0))
    alpha = float(valores_ingresados.get("alpha", 0.3))
    r = float(valores_ingresados.get("r", 0.05))
    delta = float(valores_ingresados.get("delta", 0.10))
    K_prev = float(valores_ingresados.get("K_prev", 800.0))
    VM = float(valores_ingresados.get("VM", 150000.0))
    CR = float(valores_ingresados.get("CR", 100000.0))

    st.divider()
    
    tab_neoclasico, tab_tobin = st.tabs(["🏛️ Modelo Neoclásico (Optimización)", "📈 Teoría de la 'q' de Tobin"])

    # ==========================================
    # PESTAÑA 1: MODELO NEOCLÁSICO
    # ==========================================
    with tab_neoclasico:
        st.subheader("Costo de Uso y Stock de Capital Óptimo ($K^*$)")
        col_form, col_res = st.columns(2)
        
        # Cálculos Económicos
        uc = r + delta  # Asumimos Precio del Capital (Pk) = 1 para simplificar
        K_optimo = alpha * (Y_val / uc) if uc != 0 else 0
        Inversion_bruta = K_optimo - (1 - delta) * K_prev
        Inversion_neta = K_optimo - K_prev
        
        with col_form:
            st.markdown("**1. Costo de Uso del Capital ($uc$):**")
            st.latex(rf"uc = r + \delta = {r} + {delta} = {uc:.2f}")
            st.markdown("**2. Capital Óptimo ($K^*$):**")
            st.latex(rf"K^* = \alpha \frac{{Y}}{{uc}} = {alpha} \cdot \frac{{{Y_val:,.0f}}}{{{uc:.2f}}}")
        
        with col_res:
            st.markdown(f"### ➡️ $K^*$ = `{K_optimo:,.2f}`")
            st.markdown(f"### ➡️ Inversión Bruta ($I_t$) = `{Inversion_bruta:,.2f}`")
            st.info(f"💡 **Decisión de la Empresa:** El capital deseado es **{K_optimo:,.0f}** y el previo es **{K_prev:,.0f}**. Tu inversión neta (crecimiento real) es **{Inversion_neta:,.0f}**. La inversión bruta ({Inversion_bruta:,.0f}) incluye además reponer lo que se depreció.")

        # --- CARPINTERÍA Y GRÁFICA (NUEVO) ---
        st.divider()
        col_pasos, col_grafico = st.columns(2)
        
        with col_pasos:
            st.subheader("📝 ¿De dónde sale esta fórmula?")
            st.markdown("Según la teoría neoclásica, la empresa maximiza beneficios cuando el aporte de una máquina extra iguala su costo.")
            st.markdown("**1. Productividad Marginal del Capital ($PMgK$):**")
            st.markdown("Derivando la función Cobb-Douglas $Y = A K^\\alpha N^{1-\\alpha}$ respecto a $K$:")
            st.latex(r"PMgK = \alpha \frac{Y}{K}")
            
            st.markdown("**2. Condición de Optimización:**")
            st.latex(r"PMgK = uc \implies \alpha \frac{Y}{K} = r + \delta")
            
            st.markdown("**3. Despejando $K$:**")
            st.latex(r"K^* = \alpha \frac{Y}{r + \delta}")

        with col_grafico:
            st.subheader("📉 Equilibrio del Mercado de Capitales")
            st.markdown("El punto donde la curva $PMgK$ cruza el costo de uso define $K^*$.")
            
            # Generar datos para la gráfica
            rango_K = np.linspace(K_optimo * 0.2, K_optimo * 2, 50)
            pmgk_valores = [alpha * (Y_val / k) for k in rango_K]
            uc_valores = [uc] * len(rango_K)
            
            df_k = pd.DataFrame({
                "Capital (K)": rango_K,
                "PMgK (Beneficio Marginal)": pmgk_valores,
                "Costo de Uso (r + δ)": uc_valores
            }).set_index("Capital (K)")
            
            st.line_chart(df_k, color=["#4CAF50", "#F44336"])

        # --- ANÁLISIS MARGINAL ---
        st.divider()
        st.subheader("🧮 Análisis Marginal (Sensibilidad del Capital Óptimo)")
        
        Y_sym, alpha_sym, r_sym, delta_sym = sp.symbols('Y \\alpha r \\delta')
        funcion_K = alpha_sym * (Y_sym / (r_sym + delta_sym))
        
        opciones_k = {
            "Tasa de Interés (r)": r_sym,
            "Tasa de Depreciación (δ)": delta_sym,
            "Producción Esperada (Y)": Y_sym
        }
        
        simbolo_derivar = opciones_k[st.selectbox("¿Qué variable deseas derivar con respecto a K*?", list(opciones_k.keys()), key="sel_der_inv")]
        
        derivada_K = sp.diff(funcion_K, simbolo_derivar)
        valor_derivada_sym = derivada_K.subs({Y_sym: Y_val, alpha_sym: alpha, r_sym: r, delta_sym: delta})
        valor_derivada_num = float(valor_derivada_sym.evalf())
        
        c1_der, c2_der = st.columns(2)
        with c1_der:
            st.markdown(f"**Derivada respecto a ${simbolo_derivar}$:**")
            st.latex(rf"\frac{{\partial K^*}}{{\partial {simbolo_derivar}}} = {sp.latex(derivada_K)}")
        with c2_der:
            st.markdown("**Resultado numérico actual:**")
            st.latex(rf"\frac{{\partial K^*}}{{\partial {simbolo_derivar}}} = {valor_derivada_num:,.2f}")
            
        with st.expander(f"⭐ [Premium] Ver la carpintería algebraica de la derivada respecto a {simbolo_derivar}"):
            if simbolo_derivar == r_sym or simbolo_derivar == delta_sym:
                st.markdown("**Regla de la Cadena y Exponentes:**")
                st.latex(r"K^* = \alpha Y (r + \delta)^{-1}")
                st.markdown("1. Tratamos $\\alpha Y$ como una constante multiplicativa.")
                st.markdown("2. Por regla de la cadena, bajamos el exponente $-1$ a multiplicar y le restamos $1$ (queda $-2$).")
                st.markdown(f"3. La derivada interna de $(r + \\delta)$ respecto a ${simbolo_derivar}$ es $1$.")
                st.latex(rf"\frac{{\partial K^*}}{{\partial {simbolo_derivar}}} = -\alpha Y (r + \delta)^{-2} \cdot (1) = -\frac{{\alpha Y}}{{(r + \delta)^2}}")
                st.warning("📉 **Intuición:** Un encarecimiento en el costo de financiar máquinas (sube $r$) o en su desgaste (sube $\\delta$) reduce el stock de capital deseado por la empresa.")
            elif simbolo_derivar == Y_sym:
                st.markdown("**Regla de la Constante:**")
                st.markdown(r"En la fórmula $K^* = \left( \frac{\alpha}{r+\delta} \right) Y$, el término entre paréntesis actúa como una constante que multiplica a la variable de grado 1 ($Y$).")
                st.latex(r"\frac{\partial K^*}{\partial Y} = \frac{\alpha}{r + \delta}")
                st.success("📈 **Intuición:** Si la economía se expande y se espera vender más ($Y$ sube), las empresas demandarán más maquinaria proporcionalmente.")

    # ==========================================
    # PESTAÑA 2: TEORÍA DE LA 'Q' DE TOBIN (AVANZADA)
    # ==========================================
    with tab_tobin:
        st.subheader("Teoría de la 'q' de Tobin y Costos de Ajuste")
        st.markdown("James Tobin propuso que las empresas deciden invertir basándose en la relación entre cómo las valora el mercado de valores (bolsa) y cuánto costaría reconstruirlas desde cero.")
        
        col_form_t, col_res_t = st.columns(2)
        q_resultado = VM / CR if CR != 0 else 0
        
        with col_form_t:
            st.markdown("**1. La 'q' Media (Fórmula Bursátil):**")
            st.latex(r"q_{media} = \frac{Valor\ de\ Mercado\ (VM)}{Costo\ de\ Reposición\ (CR)}")
            st.latex(rf"q = \frac{{{VM:,.0f}}}{{{CR:,.0f}}}")
            
        with col_res_t:
            st.markdown(f"### ➡️ Índice $q$ = `{q_resultado:,.2f}`")
            if q_resultado > 1:
                st.success("✅ **$q > 1$ (Inversión Favorable):** El mercado valora a la empresa por más de lo que cuestan sus máquinas físicas. Decisión: ¡Invertir!")
            elif q_resultado < 1:
                st.error("❌ **$q < 1$ (Inversión Desfavorable):** El capital existente es más barato que instalar máquinas nuevas. Decisión: No invertir.")
            else:
                st.warning("⚖️ **$q = 1$:** Equilibrio.")

        st.divider()
        st.subheader("📊 Análisis Intertemporal (La 'q' Marginal)")
        st.markdown("En la teoría avanzada, acumular capital es costoso ($C(I_t)$). La inversión es una decisión intertemporal donde se maximiza el Valor Presente ($V$) de la firma.")
        
        # --- LA CARPINTERÍA COMPLEJA QUE RECORDABA EL USUARIO ---
        with st.expander("⭐ [Premium] Ver la demostración de la Derivada Intertemporal (Regla de la Cadena)"):
            st.markdown("**1. El Problema de Maximización (Valor Presente):**")
            st.latex(r"V = \sum_{j=0}^{\infty} \frac{Y_{t+j} - I_{t+j} - WN_{t+j}}{(1+r)^j}")
            
            st.markdown("**2. La Condición de Primer Orden respecto a $K_{t+1}$:**")
            st.markdown("Al derivar el Valor Presente respecto al capital del mañana ($K_{t+1}$), nos encontramos con el Costo de Ajuste $C(I_t)$. Aquí aplicamos la **Regla de la Cadena**:")
            st.latex(r"\frac{\partial C(I_{t+1})}{\partial K_{t+1}} = \frac{\partial C(I_{t+1})}{\partial I_{t+1}} \cdot \frac{\partial I_{t+1}}{\partial K_{t+1}}")
            st.markdown("Como $\\frac{\partial I_{t+1}}{\partial K_{t+1}} = 1$, la derivada del costo de ajuste es simplemente el costo marginal de invertir: $C'(I_{t+1})$.")
            
            st.markdown("**3. Ecuación de Euler para la Inversión:**")
            st.latex(r"\frac{\partial V}{\partial K_{t+1}} = -1 - C'(I_t) + \frac{PmgK_{t+1} + (1-\delta) - C'(I_{t+1})}{1+r} = 0")
            
            st.markdown("**4. El Resultado Final (El significado de $q_t$):**")
            st.markdown("Reorganizando, obtenemos que el costo marginal de invertir hoy debe igualar al valor presente de los beneficios de esa máquina mañana:")
            st.latex(r"1 + C'(I_t) = \frac{f'(K_{t+1}) + (1-\delta) - C'(I_{t+1})}{1+r}")
            st.info("💡 **Aporte Económico:** A ese término $(1 + C'(I_t))$ se le conoce como la **'q' marginal**. Mide cuánto le cuesta realmente a la empresa instalar una unidad extra de capital, incluyendo las interrupciones en la fábrica.")        
        # Gráfica de comparación visual para Tobin
        st.divider()
        st.subheader("📊 Comparativa Visual de Valoración")
        df_tobin = pd.DataFrame({
            "Métricas": ["Valor de Mercado (VM)", "Costo de Reposición (CR)"],
            "Monto ($)": [VM, CR]
        }).set_index("Métricas")
        
        # Un gráfico de barras ayuda a ver de inmediato por qué q > 1 o q < 1
        st.bar_chart(df_tobin, color="#9C27B0")
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

    # --- PESTAÑAS PARA ORGANIZAR EL FLUJO ---
    tab_actual, tab_estructural = st.tabs(["💰 Balance Actual", "🏛️ Análisis de Sostenibilidad (De Gregorio)"])

    with tab_actual:
        st.subheader("Configuración de Política Fiscal")
        col_in1, col_in2 = st.columns(2)
        val = {}

        for i, (simbolo, info) in enumerate(tema["variables"].items()):
            with col_in1 if i % 2 == 0 else col_in2:
                with st.container(border=True):
                    paso = 0.005 if simbolo == "t" else 100.0
                    # Agregamos help (tooltips) y keys únicas
                    val[simbolo] = st.number_input(
                        f"{info['nombre']} ({simbolo})", 
                        value=float(info['valor_defecto']), 
                        step=paso,
                        key=f"gov_input_{simbolo}",
                        help=info['ayuda_real']
                    )

        G = val["G"]
        T0 = val["T0"]
        t = val["t"]
        Y_act = val["Y"]

        # ====== MOTOR MATEMÁTICO ======
        recaudo_total = T0 + (t * Y_act)
        balance = recaudo_total - G
        
        # Multiplicador con impuestos (De Gregorio Cap. 3)
        # Asumiendo una propensión marginal al consumo c = 0.8 por defecto
        c_pge = 0.8
        multiplicador_t = 1 / (1 - c_pge * (1 - t))

        st.divider()
        c_res1, c_res2 = st.columns(2)

        with c_res1:
            st.subheader("📝 Resultado del Ejercicio")
            st.write(f"Recaudación Total ($T$): **{recaudo_total:,.2f}**")
            st.write(f"Gasto Público ($G$): **{G:,.2f}**")
            
            if balance > 0:
                st.success(f"### Superávit Fiscal: `{balance:,.2f}`")
                st.markdown("✅ El gobierno tiene espacio fiscal. Puede ahorrar o invertir.")
            elif balance < 0:
                st.error(f"### Déficit Fiscal: `{balance:,.2f}`")
                st.markdown("⚠️ El gobierno requiere deuda. Impacto en la tasa de interés (Crowding out).")
            else:
                st.warning("### Presupuesto Equilibrado")

        with c_res2:
            st.subheader("📈 Función de Superávit")
            y_range = np.linspace(Y_act * 0.5, Y_act * 1.5, 50)
            bs_range = (T0 + t * y_range) - G
            
            df_fiscal = pd.DataFrame({"Balance (BS)": bs_range}, index=y_range)
            st.line_chart(df_fiscal, color="#FF5722")
            st.caption("La línea muestra cómo el balance mejora automáticamente con el PIB.")

        # ====== LA CARPINTERÍA (PASO A PASO) ======
        st.divider()
        st.subheader("🧮 La Carpintería: Estabilizadores Automáticos")
        
        with st.expander("⭐ [Premium] Ver derivación del Balance respecto al ciclo"):
            st.markdown("**1. Definición de la función de Balance Presupuestario ($BS$):**")
            st.latex(r"BS = (T_0 + t \cdot Y) - G")
            
            st.markdown("**2. Derivamos respecto al Ingreso ($Y$):**")
            st.markdown("Como $T_0$ y $G$ son constantes respecto a $Y$, sus derivadas son $0$:")
            st.latex(rf"\frac{{\partial BS}}{{\partial Y}} = 0 + t - 0 = {t}")
            
            st.markdown("**3. Interpretación Económica:**")
            st.info(f"Por cada unidad que sube el PIB, el balance fiscal mejora en **{t}** unidades. Este es el 'estabilizador automático': el gobierno recauda más sin cambiar las leyes cuando la economía va bien.")

    with tab_estructural:
        st.subheader("Balance Estructural vs. Cíclico")
        st.markdown("""
        De Gregorio explica que el balance observado puede ser engañoso. Si la economía está en auge, el balance parece bueno pero es transitorio.
        """)
        
        # Input adicional para PIB Potencial
        Y_pot = st.number_input("PIB Potencial o de Pleno Empleo ($Y^*$)", value=Y_act * 0.95, key="y_pot_input")
        
        balance_estructural = (T0 + t * Y_pot) - G
        componente_ciclico = balance - balance_estructural

        col_est1, col_est2 = st.columns(2)
        
        with col_est1:
            st.metric("Balance Estructural ($BS^*$)", f"{balance_estructural:,.2f}")
            st.caption("Lo que el gobierno recaudaría si estuviéramos en pleno empleo.")
            
        with col_est2:
            color_delta = "normal" if componente_ciclico > 0 else "inverse"
            st.metric("Componente Cíclico", f"{componente_ciclico:,.2f}", delta_color=color_delta)
            st.caption("Parte del balance que se debe únicamente al estado actual del ciclo.")

        st.divider()
        st.subheader("⚡ Impacto en el Multiplicador")
        st.latex(rf"m = \frac{{1}}{{1 - c(1 - t)}}")
        st.markdown(f"""
        Con una tasa $t = {t}$, el multiplicador de la economía es **{multiplicador_t:.2f}**. 
        * Si subes $t$, el multiplicador baja, haciendo que la economía sea más estable ante shocks externos, pero menos potente ante estímulos de gasto.
        """)
# ==========================================
# MÓDULO 8: ESTADÍSTICA 2 - ESTIMADORES, MÉTODOS Y PROPIEDADES
# ==========================================
elif tema_seleccionado == "Estimadores Estadísticos":
    st.markdown("<h2><i class='fas fa-bullseye' style='color:#00FFAA;'></i> Laboratorio de Estadística 2</h2>", unsafe_allow_html=True)
    tema = datos["estadistica_2"]["estimadores"]
    st.header(tema["nombre"])

    st.info("💡 **Nota Académica:** 'Insesgadez' y 'Consistencia' son *propiedades* que evalúan la calidad de un estimador. 'Momentos' y 'Máxima Verosimilitud' son los *métodos matemáticos* que usamos para encontrar dichos estimadores.")

    st.subheader("Configuración Poblacional")
    col_in1, col_in2, col_in3 = st.columns(3)
    val = {}

    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        if i % 3 == 0: col = col_in1
        elif i % 3 == 1: col = col_in2
        else: col = col_in3
        
        with col:
            with st.container(border=True):
                # SOLUCIÓN AL WARNING: Forzamos a 'n' a ser un entero real en Python
                if simbolo == "n":
                    valor_inicial = int(float(info['valor_defecto']))
                    val[simbolo] = st.number_input(f"{info['nombre']} ({simbolo})", value=valor_inicial, step=1, format="%d")
                else:
                    val[simbolo] = st.number_input(f"{info['nombre']} ({simbolo})", value=float(info['valor_defecto']), step=1.0, format="%.2f")
                
                with st.expander("📖 Info"): st.markdown(info['ayuda_real'])

    mu, sigma, n = val["mu"], val["sigma"], val["n"]

    st.divider()
    
    # ====== SELECTOR DE ENFOQUE ESTADÍSTICO ======
    enfoque = st.selectbox("Selecciona el Área de Estudio:", [
        "1. Propiedades: Insesgadez y Consistencia (Simulación)",
        "2. Método de Momentos (MM) - Demostración",
        "3. Máxima Verosimilitud (MLE) - Demostración"
    ])

    if enfoque == "1. Propiedades: Insesgadez y Consistencia (Simulación)":
        if st.button("🎲 Extraer Nueva Muestra Aleatoria", type="primary"):
            muestra = np.random.normal(loc=mu, scale=sigma, size=n)
            
            media_muestral = np.mean(muestra)
            var_insesgada = np.var(muestra, ddof=1)
            var_sesgada = np.var(muestra, ddof=0)
            
            error_media = abs(media_muestral - mu)
            
            st.subheader("📊 Resultados de la Extracción Muestral")
            col_res1, col_res2 = st.columns(2)
            with col_res1:
                st.markdown("**1. Estimador de la Media ($\\bar{x}$)**")
                st.metric(label="Media Muestral Calculada", value=f"{media_muestral:.2f}", delta=f"Error: {error_media:.2f}", delta_color="inverse")
                
            with col_res2:
                st.markdown("**2. Estimadores de la Varianza ($S^2$ y $\\sigma^2$)**")
                st.markdown(f"* **Insesgada (n-1):** `{var_insesgada:.2f}` ✅")
                st.markdown(f"* **Sesgada (n):** `{var_sesgada:.2f}` ❌")

            st.divider()
            st.markdown("### Demostraciones de Propiedades")
            tab1, tab2, tab3 = st.tabs(["🎯 Insesgadez de la Media", "📉 Varianza de la Media (Consistencia)", "⚖️ Insesgadez de la Varianza (n-1)"])

            with tab1:
                st.markdown("**Objetivo:** Demostrar que $E[\\bar{x}] = \\mu$.")
                st.latex("E[\\bar{x}] = E\\left[ \\frac{1}{n} \\sum_{i=1}^{n} x_i \\right] = \\frac{1}{n} \\sum_{i=1}^{n} E[x_i] = \\frac{1}{n} (n \\cdot \\mu) = \\mu \\quad \\blacksquare")

            with tab2:
                st.markdown("**Objetivo:** Encontrar $V(\\bar{x})$ para probar convergencia.")
                st.latex("V(\\bar{x}) = V\\left( \\frac{1}{n} \\sum_{i=1}^{n} x_i \\right) = \\frac{1}{n^2} \\sum_{i=1}^{n} V(x_i) = \\frac{1}{n^2} (n \\cdot \\sigma^2) = \\frac{\\sigma^2}{n} \\quad \\blacksquare")

            with tab3:
                st.markdown("**Objetivo:** Por qué el estimador insesgado divide por $n-1$.")
                st.latex("E\\left[ \\sum (x_i - \\bar{x})^2 \\right] = (n-1)\\sigma^2 \\implies E\\left[ \\frac{\\sum (x_i - \\bar{x})^2}{n-1} \\right] = \\sigma^2 \\quad \\blacksquare")

    elif enfoque == "2. Método de Momentos (MM) - Demostración":
        st.subheader("Demostración: Método de Momentos para una Distribución Normal")
        st.markdown("El Método de Momentos consiste en igualar los momentos poblacionales teóricos con los momentos muestrales empíricos para despejar los parámetros desconocidos.")
        
        st.markdown("**Paso 1: Primer Momento (Para hallar $\\mu$)**")
        st.markdown("Igualamos el primer momento poblacional $E[X]$ con el primer momento muestral $M_1$.")
        st.latex("E[X] = \\mu \\quad \\text{y} \\quad M_1 = \\frac{1}{n} \\sum_{i=1}^n X_i")
        st.latex("\\hat{\\mu}_{MM} = \\bar{X} \\quad \\blacksquare")
        
        st.markdown("**Paso 2: Segundo Momento (Para hallar $\\sigma^2$)**")
        st.markdown("Sabemos por definición de varianza que $V(X) = E[X^2] - (E[X])^2$. Despejamos $E[X^2]$:")
        st.latex("E[X^2] = \\sigma^2 + \\mu^2")
        st.markdown("Igualamos este segundo momento poblacional con el segundo momento muestral $M_2$:")
        st.latex("\\sigma^2 + \\mu^2 = \\frac{1}{n} \\sum_{i=1}^n X_i^2")
        st.markdown("Sustituimos $\\mu$ por el estimador que ya hallamos ($\\bar{X}$) y despejamos $\\sigma^2$:")
        st.latex("\\hat{\\sigma}^2_{MM} = \\left( \\frac{1}{n} \\sum_{i=1}^n X_i^2 \\right) - \\bar{X}^2")
        st.markdown("Factorizando, obtenemos el resultado final. Nota que el método de momentos **arroja el estimador sesgado** de la varianza (divide sobre $n$, no sobre $n-1$).")
        st.latex("\\hat{\\sigma}^2_{MM} = \\frac{1}{n} \\sum_{i=1}^n (X_i - \\bar{X})^2 \\quad \\blacksquare")

    elif enfoque == "3. Máxima Verosimilitud (MLE) - Demostración":
        st.subheader("Demostración: Máxima Verosimilitud para una Distribución Normal")
        st.markdown("La idea fundamental de MLE es encontrar los parámetros que maximizan la probabilidad conjunta (verosimilitud) de haber obtenido exactamente la muestra que observamos.")
        
        st.markdown("**Paso 1: La Función de Verosimilitud $L(\\mu, \\sigma^2)$**")
        st.markdown("Como la muestra es aleatoria e independiente, la probabilidad conjunta es la multiplicatoria de las funciones de densidad individuales de la Normal.")
        st.latex("L(\\mu, \\sigma^2) = \\prod_{i=1}^n \\frac{1}{\\sqrt{2\\pi\\sigma^2}} e^{-\\frac{(x_i - \\mu)^2}{2\\sigma^2}}")
        st.latex("L(\\mu, \\sigma^2) = (2\\pi\\sigma^2)^{-n/2} \\cdot e^{-\\frac{1}{2\\sigma^2} \\sum_{i=1}^n (x_i - \\mu)^2}")
        
        st.markdown("**Paso 2: Log-Verosimilitud ($\\ln L$)**")
        st.markdown("Maximizar $L$ es lo mismo que maximizar $\\ln L$, y aplicar el logaritmo facilita enormemente derivar.")
        st.latex("\\ln L = -\\frac{n}{2} \\ln(2\\pi) - \\frac{n}{2} \\ln(\\sigma^2) - \\frac{1}{2\\sigma^2} \\sum_{i=1}^n (x_i - \\mu)^2")
        
        st.markdown("**Paso 3: Maximizar respecto a $\\mu$**")
        st.markdown("Derivamos parcialmente respecto a $\\mu$ e igualamos a cero (condición de primer orden).")
        st.latex("\\frac{\\partial \\ln L}{\\partial \\mu} = \\frac{1}{\\sigma^2} \\sum_{i=1}^n (x_i - \\mu) = 0")
        st.latex("\\sum x_i - n\\mu = 0 \\implies \\hat{\\mu}_{MLE} = \\frac{\\sum x_i}{n} = \\bar{x} \\quad \\blacksquare")
        
        st.markdown("**Paso 4: Maximizar respecto a $\\sigma^2$**")
        st.markdown("Derivamos la Log-Verosimilitud parcialmente respecto a $\\sigma^2$ (tratándola como una sola variable) e igualamos a cero.")
        st.latex("\\frac{\\partial \\ln L}{\\partial \\sigma^2} = -\\frac{n}{2\\sigma^2} + \\frac{1}{2(\\sigma^2)^2} \\sum_{i=1}^n (x_i - \\mu)^2 = 0")
        st.markdown("Multiplicamos todo por $2(\\sigma^2)^2$ y despejamos. Nuevamente, MLE nos entrega el estimador **sesgado**.")
        st.latex("n\\sigma^2 = \\sum (x_i - \\bar{x})^2 \\implies \\hat{\\sigma}^2_{MLE} = \\frac{1}{n} \\sum_{i=1}^n (x_i - \\bar{x})^2 \\quad \\blacksquare")
# ==========================================
# MÓDULO 9: ESTADÍSTICA 2 - INTERVALOS Y MUESTRA
# ==========================================
elif tema_seleccionado == "Intervalos y Tamaño de Muestra":
    import math # Importamos math para redondear el tamaño de muestra hacia arriba
    
    st.markdown("<h2><i class='fas fa-arrows-alt-h' style='color:#00FFAA;'></i> Intervalos y Tamaño de Muestra</h2>", unsafe_allow_html=True)
    tema = datos["estadistica_2"]["intervalos_muestra"]
    
    st.subheader("Modelos Matemáticos")
    col_f1, col_f2 = st.columns(2)
    with col_f1:
        st.markdown("**1. Intervalo de Confianza (Varianza Conocida / n > 30):**")
        st.latex("IC = \\bar{x} \\pm Z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}")
    with col_f2:
        st.markdown("**2. Tamaño de Muestra Requerido:**")
        st.latex("n = \\left(\\frac{Z_{\\alpha/2} \\cdot \\sigma}{E}\\right)^2")

    st.divider()
    st.subheader("Configuración del Estudio")
    
    # Selector de Nivel de Confianza (Asigna automáticamente el valor Z)
    niveles_z = {"90% (Z = 1.645)": 1.645, "95% (Z = 1.960)": 1.96, "99% (Z = 2.576)": 2.576}
    nc_seleccionado = st.selectbox("Nivel de Confianza (1 - α):", list(niveles_z.keys()), index=1)
    Z = niveles_z[nc_seleccionado]
    
    col_in1, col_in2 = st.columns(2)
    val = {}
    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        with col_in1 if i % 2 == 0 else col_in2:
            with st.container(border=True):
                # SOLUCIÓN AL WARNING DE n_actual
                if simbolo == "n_actual":
                    valor_inicial = int(float(info['valor_defecto']))
                    val[simbolo] = st.number_input(f"{info['nombre']} ({simbolo})", value=valor_inicial, step=1, format="%d")
                elif simbolo == "E":
                    val[simbolo] = st.number_input(f"{info['nombre']} ({simbolo})", value=float(info['valor_defecto']), step=0.5, format="%.2f")
                else:
                    val[simbolo] = st.number_input(f"{info['nombre']} ({simbolo})", value=float(info['valor_defecto']), step=1.0, format="%.2f")
                
                with st.expander("📖 Info"): st.markdown(info['ayuda_real'])

    x_bar, sigma, n_actual, E_deseado = val["x_bar"], val["sigma"], int(val["n_actual"]), val["E"]

    # ====== CÁLCULOS ESTADÍSTICOS ======
    # 1. Intervalo de Confianza
    error_estandar = sigma / np.sqrt(n_actual)
    margen_error_actual = Z * error_estandar
    lim_inf = x_bar - margen_error_actual
    lim_sup = x_bar + margen_error_actual
    
    # 2. Tamaño de Muestra
    n_requerido = math.ceil(((Z * sigma) / E_deseado)**2)

    st.divider()
    tab1, tab2 = st.tabs(["📊 Intervalo de Confianza", "🎯 Cálculo de Tamaño de Muestra"])
    
    with tab1:
        c_res1, c_res2 = st.columns([1, 2])
        with c_res1:
            st.markdown("### Resultados del IC")
            st.metric(label="Límite Inferior", value=f"{lim_inf:.2f}")
            st.metric(label="Media Puntual (x̄)", value=f"{x_bar:.2f}")
            st.metric(label="Límite Superior", value=f"{lim_sup:.2f}")
            st.info(f"**Interpretación:** Estamos {nc_seleccionado[:3]} seguros de que el verdadero promedio de la población se encuentra entre **{lim_inf:.2f}** y **{lim_sup:.2f}**.")
            
        with c_res2:
            st.markdown("### Visualización del Intervalo")
            # Crear una curva normal teórica alrededor de la media
            eje_x = np.linspace(x_bar - 4*error_estandar, x_bar + 4*error_estandar, 100)
            eje_y = (1/(error_estandar * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((eje_x - x_bar)/error_estandar)**2)
            
            df_curva = pd.DataFrame({"Densidad": eje_y, "Valor": eje_x}).set_index("Valor")
            
            # Graficar
            st.line_chart(df_curva, color="#00FFAA")
            st.caption(f"La curva representa la distribución de las medias muestrales. El área bajo la curva entre {lim_inf:.2f} y {lim_sup:.2f} equivale al {nc_seleccionado[:3]} de probabilidad.")

    with tab2:
        c_mu1, c_mu2 = st.columns(2)
        with c_mu1:
            st.markdown("### Optimización del Estudio")
            st.markdown(f"Si tu objetivo es que tu estimación no falle por más de **±{E_deseado}** unidades manteniendo un {nc_seleccionado[:3]} de confianza, necesitas encuestar/medir a esta cantidad de individuos:")
            st.latex(f"n = \\left(\\frac{{{Z} \\cdot {sigma}}}{{{E_deseado}}}\\right)^2")
            
        with c_mu2:
            st.markdown("<br>", unsafe_allow_html=True)
            st.metric(label="Tamaño de Muestra Requerido (n)", value=f"{n_requerido} observaciones")
            
            if n_requerido > n_actual:
                st.warning(f"⚠️ Te faltan **{n_requerido - n_actual}** observaciones para alcanzar esa precisión.")
            else:
                st.success(f"✅ ¡Tu muestra actual ({n_actual}) ya es suficientemente grande para ese margen de error!")

# ==========================================
# MÓDULO 10: ESTADÍSTICA 2 - PRUEBAS DE HIPÓTESIS
# ==========================================
elif tema_seleccionado == "Pruebas de Hipótesis":
    import math
    
    # Función para calcular la probabilidad acumulada (CDF) de una Normal Estándar
    def norm_cdf(x):
        return (1.0 + math.erf(x / math.sqrt(2.0))) / 2.0

    st.markdown("<h2><i class='fas fa-balance-scale' style='color:#00FFAA;'></i> Pruebas de Hipótesis</h2>", unsafe_allow_html=True)
    tema = datos["estadistica_2"]["pruebas_hipotesis"]
    
    st.markdown("La prueba de hipótesis es el método formal para decidir si los datos de nuestra muestra tienen suficiente evidencia para desmentir una creencia previa (el Status Quo).")
    
    st.subheader("Configuración del Test")
    
    # Tipo de Prueba
    tipo_prueba = st.selectbox("Tipo de Prueba (Cola):", [
        "Dos Colas (Diferente a: ≠)",
        "Cola Derecha (Mayor que: >)",
        "Cola Izquierda (Menor que: <)"
    ])
    
    col_in1, col_in2, col_in3 = st.columns(3)
    val = {}
    
    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        if i % 3 == 0: col = col_in1
        elif i % 3 == 1: col = col_in2
        else: col = col_in3
        
        with col:
            with st.container(border=True):
                if simbolo == "n":
                    valor_inicial = int(float(info['valor_defecto']))
                    val[simbolo] = st.number_input(f"{info['nombre']}", value=valor_inicial, step=1, format="%d")
                elif simbolo == "alpha":
                    val[simbolo] = st.number_input(f"{info['nombre']}", value=float(info['valor_defecto']), step=0.01, format="%.3f")
                else:
                    val[simbolo] = st.number_input(f"{info['nombre']}", value=float(info['valor_defecto']), step=1.0, format="%.2f")
                
    mu_0, x_bar, sigma, n, alpha = val["mu_0"], val["x_bar"], val["sigma"], val["n"], val["alpha"]

    # ====== MOTOR MATEMÁTICO: Z-TEST ======
    error_estandar = sigma / math.sqrt(n)
    z_calc = (x_bar - mu_0) / error_estandar
    
    # Cálculos dependiendo de las colas
    if "Dos Colas" in tipo_prueba:
        p_valor = 2 * (1 - norm_cdf(abs(z_calc)))
        z_critico = 1.96 if alpha == 0.05 else 1.645 if alpha == 0.10 else 2.576 # Aproximaciones estándar
        rechazo = abs(z_calc) > z_critico
    elif "Cola Derecha" in tipo_prueba:
        p_valor = 1 - norm_cdf(z_calc)
        z_critico = 1.645 if alpha == 0.05 else 1.28 if alpha == 0.10 else 2.33
        rechazo = z_calc > z_critico
    else: # Cola Izquierda
        p_valor = norm_cdf(z_calc)
        z_critico = -1.645 if alpha == 0.05 else -1.28 if alpha == 0.10 else -2.33
        rechazo = z_calc < z_critico

    st.divider()
    
    tab1, tab2 = st.tabs(["⚖️ Veredicto del Test", "🔗 Dualidad con Intervalos de Confianza"])
    
    with tab1:
        st.subheader("Planteamiento y Veredicto")
        
        # Mostrar H0 y H1 según la cola elegida
        c_h1, c_h2 = st.columns(2)
        with c_h1:
            st.markdown("**Hipótesis Nula ($H_0$):**")
            operador_h0 = "=" if "Dos" in tipo_prueba else "≤" if "Derecha" in tipo_prueba else "≥"
            st.latex(f"H_0: \\mu {operador_h0} {mu_0}")
        with c_h2:
            st.markdown("**Hipótesis Alternativa ($H_1$):**")
            operador_h1 = "\\neq" if "Dos" in tipo_prueba else ">" if "Derecha" in tipo_prueba else "<"
            st.latex(f"H_1: \\mu {operador_h1} {mu_0}")
            
        st.markdown(f"**1. Estadístico de Prueba ($Z_{{calc}}$):** `{z_calc:.3f}`")
        st.latex(f"Z = \\frac{{{x_bar} - {mu_0}}}{{{sigma} / \\sqrt{{{n}}}}} = {z_calc:.3f}")
        
        st.markdown(f"**2. P-Valor:** `{p_valor:.4f}`")
        st.info("💡 **¿Qué es el P-Valor?** Es la probabilidad de haber obtenido una muestra tan extrema como la nuestra, asumiendo que el Status Quo ($H_0$) fuera real. Si es muy bajita (menor que $\\alpha$), el Status Quo es insostenible y lo rechazamos.")
        
        # Conclusión
        if p_valor < alpha:
            st.error(f"🚨 **CONCLUSIÓN:** Como P-Valor ({p_valor:.4f}) < $\\alpha$ ({alpha}), **RECHAZAMOS $H_0$**.")
            st.markdown(f"Hay evidencia estadística suficiente para afirmar que la media poblacional es {operador_h1.replace('\\neq', 'diferente de').replace('>', 'mayor que').replace('<', 'menor que')} {mu_0}.")
        else:
            st.success(f"✅ **CONCLUSIÓN:** Como P-Valor ({p_valor:.4f}) ≥ $\\alpha$ ({alpha}), **NO RECHAZAMOS $H_0$**.")
            st.markdown(f"La diferencia entre tu muestra ({x_bar}) y la hipótesis ({mu_0}) no es estadísticamente significativa; puede deberse simplemente al azar del muestreo.")

    with tab2:
        st.subheader("La Conexión con los Intervalos de Confianza")
        if "Dos Colas" in tipo_prueba:
            margen = z_critico * error_estandar
            ic_inf = x_bar - margen
            ic_sup = x_bar + margen
            
            st.markdown(f"Toda prueba de hipótesis de dos colas con nivel de significancia $\\alpha$ es matemáticamente equivalente a construir un Intervalo de Confianza al $(1-\\alpha)$%.")
            st.latex(f"IC_{{{(1-alpha)*100}\\%}} = [{ic_inf:.2f} \\ , \\ {ic_sup:.2f}]")
            
            if mu_0 >= ic_inf and mu_0 <= ic_sup:
                st.markdown(f"Como tu valor hipotético ($\\mu_0 = {mu_0}$) **ESTÁ DENTRO** del rango de este intervalo, es un valor razonable y posible. Por lo tanto, **No podemos rechazar $H_0$**.")
            else:
                st.markdown(f"Como tu valor hipotético ($\\mu_0 = {mu_0}$) **CAE AFUERA** de este intervalo, es altamente improbable que sea el verdadero promedio. Por lo tanto, **Rechazamos $H_0$**.")
        else:
            st.warning("⚠️ La dualidad exacta y simétrica con los intervalos de confianza estándar se visualiza mejor en pruebas de Dos Colas. Estás usando una prueba de una sola cola.")
# ==========================================
# MÓDULO 11: TEORÍA DE JUEGOS - EQUILIBRIOS PURAS (MATRIZ N x M)
# ==========================================
elif tema_seleccionado == "Equilibrios de Nash (Puras)":
    st.markdown("<h2><i class='fas fa-bullseye' style='color:#00FFAA;'></i> Módulo 11: Nash en Estrategias Puras</h2>", unsafe_allow_html=True)
    st.markdown("Selecciona el tamaño de la matriz e ingresa los pagos. El sistema construirá el diagrama del juego y calculará las Mejores Respuestas.")
    
    # 1. Selectores de dimensión
    c_dim1, c_dim2 = st.columns(2)
    filas = c_dim1.number_input("Estrategias Jugador 1 (Filas)", min_value=2, max_value=5, value=2, key="dim_f")
    columnas = c_dim2.number_input("Estrategias Jugador 2 (Columnas)", min_value=2, max_value=5, value=2, key="dim_c")

    st.divider()
    
    # 2. Creación de DataFrames editables
    st.markdown("### 📥 Ingreso de Pagos")
    c_m1, c_m2 = st.columns(2)
    with c_m1:
        st.markdown("<h5 style='color:#2196F3;'>Pagos Jugador 1 (Azul)</h5>", unsafe_allow_html=True)
        df_j1 = pd.DataFrame(0.0, index=[f"F{i+1}" for i in range(filas)], columns=[f"C{j+1}" for j in range(columnas)])
        pagos_j1 = st.data_editor(df_j1, key="editor_j1", use_container_width=True)
        
    with c_m2:
        st.markdown("<h5 style='color:#FF9800;'>Pagos Jugador 2 (Naranja)</h5>", unsafe_allow_html=True)
        df_j2 = pd.DataFrame(0.0, index=[f"F{i+1}" for i in range(filas)], columns=[f"C{j+1}" for j in range(columnas)])
        pagos_j2 = st.data_editor(df_j2, key="editor_j2", use_container_width=True)

    # 3. Motor de Cálculo de Equilibrio y Mejores Respuestas
    equilibrios = []
    mejores_respuestas_j1 = [] # Coordenadas (i,j)
    mejores_respuestas_j2 = [] # Coordenadas (i,j)
    
    for j in range(columnas):
        max_j1_columna = pagos_j1.iloc[:, j].max()
        for i in range(filas):
            if pagos_j1.iloc[i, j] == max_j1_columna:
                mejores_respuestas_j1.append((i, j))

    for i in range(filas):
        max_j2_fila = pagos_j2.iloc[i, :].max()
        for j in range(columnas):
            if pagos_j2.iloc[i, j] == max_j2_fila:
                mejores_respuestas_j2.append((i, j))
                
    # Intersección de mejores respuestas = Equilibrio de Nash
    nash_coords = set(mejores_respuestas_j1).intersection(set(mejores_respuestas_j2))
    for (i, j) in nash_coords:
        equilibrios.append(f"{pagos_j1.index[i]}, {pagos_j1.columns[j]}")

    st.divider()

    # 4. DIAGRAMA VISUAL DE LA MATRIZ (MEJORA CLAVE)
    st.subheader("📊 Diagrama de la Matriz de Pagos (Bi-matriz)")
    st.markdown("Así se representa formalmente el juego. Los pagos subrayados indican que son una **Mejor Respuesta**.")
    
    html_matriz = "<table style='width:100%; text-align:center; border-collapse: collapse; margin-bottom: 20px; font-size: 18px;'>"
    # Fila de encabezados de columna
    html_matriz += "<tr><th style='border: none;'></th>"
    for j in range(columnas):
        html_matriz += f"<th style='border: 1px solid white; padding: 10px; background-color: #333;'>{pagos_j1.columns[j]}</th>"
    html_matriz += "</tr>"
    
    # Filas de la matriz
    for i in range(filas):
        html_matriz += f"<tr><th style='border: 1px solid white; padding: 10px; background-color: #333;'>{pagos_j1.index[i]}</th>"
        for j in range(columnas):
            p1 = pagos_j1.iloc[i, j]
            p2 = pagos_j2.iloc[i, j]
            
            # Subrayar si es mejor respuesta
            p1_str = f"<u><b>{p1:g}</b></u>" if (i, j) in mejores_respuestas_j1 else f"{p1:g}"
            p2_str = f"<u><b>{p2:g}</b></u>" if (i, j) in mejores_respuestas_j2 else f"{p2:g}"
            
            # Resaltar la celda completa si es Nash
            bg_color = "#1E3A8A" if (i, j) in nash_coords else "transparent"
            
            html_matriz += f"<td style='border: 1px solid white; padding: 15px; background-color: {bg_color};'>"
            html_matriz += f"(<span style='color:#2196F3;'>{p1_str}</span>, <span style='color:#FF9800;'>{p2_str}</span>)"
            html_matriz += "</td>"
        html_matriz += "</tr>"
    html_matriz += "</table>"
    
    st.markdown(html_matriz, unsafe_allow_html=True)

    # 5. Resultados y Explicación
    st.subheader("🎯 Veredicto del Análisis")
    if len(equilibrios) > 0:
        st.success(f"✅ Se encontraron **{len(equilibrios)}** Equilibrio(s) de Nash en Estrategias Puras:")
        for eq in equilibrios:
            st.markdown(f"### 📍 Perfil: ({eq})")
    else:
        st.error("🚨 No se encontraron Equilibrios de Nash en Estrategias Puras. Este juego requiere un análisis de Estrategias Mixtas.")

    with st.expander("⭐ [Premium] ¿Cómo calculamos esto? (Método de las Mejores Respuestas)"):
        st.markdown("**1. Análisis del Jugador 1 (Azul - Elige Filas):**")
        st.markdown("J1 asume qué columna jugará J2. Si J2 juega la Columna 1, J1 compara sus pagos en esa columna y subraya el mayor. Hace esto para todas las columnas.")
        st.markdown("**2. Análisis del Jugador 2 (Naranja - Elige Columnas):**")
        st.markdown("J2 asume qué fila jugará J1. Si J1 juega la Fila 1, J2 compara sus pagos en esa fila y subraya el mayor. Hace esto para todas las filas.")
        st.markdown("**3. Equilibrio de Nash:**")
        st.info("Cualquier celda (perfil de estrategias) donde **ambos** pagos estén subrayados es un Equilibrio de Nash. Significa que ninguno de los dos jugadores tiene incentivos para desviarse unilateralmente.")

# ==========================================
# MÓDULO 12: TEORÍA DE JUEGOS - ESTRATEGIAS MIXTAS (2x2)
# ==========================================
elif tema_seleccionado == "Estrategias Mixtas (Cálculo p y q)":
    st.markdown("<h2><i class='fas fa-dice' style='color:#00FFAA;'></i> Módulo 12: Estrategias Mixtas (2x2)</h2>", unsafe_allow_html=True)
    st.info("💡 **El Principio de Indiferencia:** En mixtas, un jugador mezcla sus probabilidades de tal forma que hace que su oponente sea *indiferente* entre elegir cualquiera de sus estrategias.")
    
    col_in1, col_in2 = st.columns(2)
    val = {}
    with col_in1:
        st.markdown("<h4 style='color:#2196F3;'>Jugador 1 (Filas)</h4>", unsafe_allow_html=True)
        val["u11"] = st.number_input("Pago J1 (Arriba, Izq)", value=3.0, step=1.0, key="m_u11")
        val["u12"] = st.number_input("Pago J1 (Arriba, Der)", value=0.0, step=1.0, key="m_u12")
        val["u21"] = st.number_input("Pago J1 (Abajo, Izq)", value=0.0, step=1.0, key="m_u21")
        val["u22"] = st.number_input("Pago J1 (Abajo, Der)", value=1.0, step=1.0, key="m_u22")
    with col_in2:
        st.markdown("<h4 style='color:#FF9800;'>Jugador 2 (Columnas)</h4>", unsafe_allow_html=True)
        val["v11"] = st.number_input("Pago J2 (Arriba, Izq)", value=2.0, step=1.0, key="m_v11")
        val["v12"] = st.number_input("Pago J2 (Arriba, Der)", value=1.0, step=1.0, key="m_v12")
        val["v21"] = st.number_input("Pago J2 (Abajo, Izq)", value=0.0, step=1.0, key="m_v21")
        val["v22"] = st.number_input("Pago J2 (Abajo, Der)", value=3.0, step=1.0, key="m_v22")

    # Diagrama de la matriz 2x2 interactiva
    st.divider()
    st.subheader("📊 Matriz de Pagos")
    html_2x2 = f"""
    <table style='width:100%; text-align:center; border-collapse: collapse; margin-bottom: 20px; font-size: 18px;'>
        <tr>
            <th style='border: none;'></th>
            <th style='border: 1px solid white; padding: 10px; background-color: #333;'>Izquierda (q)</th>
            <th style='border: 1px solid white; padding: 10px; background-color: #333;'>Derecha (1-q)</th>
        </tr>
        <tr>
            <th style='border: 1px solid white; padding: 10px; background-color: #333;'>Arriba (p)</th>
            <td style='border: 1px solid white; padding: 15px;'>(<span style='color:#2196F3;'>{val["u11"]:g}</span>, <span style='color:#FF9800;'>{val["v11"]:g}</span>)</td>
            <td style='border: 1px solid white; padding: 15px;'>(<span style='color:#2196F3;'>{val["u12"]:g}</span>, <span style='color:#FF9800;'>{val["v12"]:g}</span>)</td>
        </tr>
        <tr>
            <th style='border: 1px solid white; padding: 10px; background-color: #333;'>Abajo (1-p)</th>
            <td style='border: 1px solid white; padding: 15px;'>(<span style='color:#2196F3;'>{val["u21"]:g}</span>, <span style='color:#FF9800;'>{val["v21"]:g}</span>)</td>
            <td style='border: 1px solid white; padding: 15px;'>(<span style='color:#2196F3;'>{val["u22"]:g}</span>, <span style='color:#FF9800;'>{val["v22"]:g}</span>)</td>
        </tr>
    </table>
    """
    st.markdown(html_2x2, unsafe_allow_html=True)

    # Lógica de indiferencia
    den_p = (val["v11"] - val["v21"] - val["v12"] + val["v22"])
    den_q = (val["u11"] - val["u12"] - val["u21"] + val["u22"])

    if den_p != 0 and den_q != 0:
        p_star = (val["v22"] - val["v12"]) / den_p
        q_star = (val["u22"] - val["u12"]) / den_q
        
        if 0 <= p_star <= 1 and 0 <= q_star <= 1:
            st.divider()
            st.subheader("🎯 Equilibrio en Estrategias Mixtas")
            c1, c2 = st.columns(2)
            with c1:
                st.metric("p* (Probabilidad J1 - Arriba)", f"{p_star:.4f} ({p_star*100:.1f}%)")
            with c2:
                st.metric("q* (Probabilidad J2 - Izquierda)", f"{q_star:.4f} ({q_star*100:.1f}%)")
            
            st.success(f"**Equilibrio:** El Jugador 1 juega Arriba el {p_star*100:.1f}% del tiempo y Abajo el {(1-p_star)*100:.1f}%. El Jugador 2 juega Izquierda el {q_star*100:.1f}% del tiempo y Derecha el {(1-q_star)*100:.1f}%.")
            
            with st.expander("⭐ [Premium] ¿Cómo se calculan estas probabilidades?"):
                st.markdown("**1. Encontrar $p^*$ (Lo que hace el Jugador 1):**")
                st.markdown("J1 elige una probabilidad $p$ para 'Arriba' de modo que J2 gane lo mismo jugando 'Izquierda' o 'Derecha' (lo vuelve indiferente).")
                st.latex(r"PagoEsperado_{J2}(Izquierda) = PagoEsperado_{J2}(Derecha)")
                st.latex(f"p({val['v11']}) + (1-p)({val['v21']}) = p({val['v12']}) + (1-p)({val['v22']})")
                st.markdown("Despejando algebraicamente obtenemos:")
                st.latex(r"p = \frac{v_{22} - v_{12}}{(v_{11} - v_{21}) - (v_{12} - v_{22})}")
                
                st.markdown("**2. Encontrar $q^*$ (Lo que hace el Jugador 2):**")
                st.markdown("J2 elige una probabilidad $q$ para 'Izquierda' de modo que J1 gane lo mismo jugando 'Arriba' o 'Abajo'.")
                st.latex(r"PagoEsperado_{J1}(Arriba) = PagoEsperado_{J1}(Abajo)")
                st.latex(f"q({val['u11']}) + (1-q)({val['u12']}) = q({val['u21']}) + (1-q)({val['u22']})")
        else:
            st.warning("⚠️ Las fórmulas arrojaron probabilidades fuera del rango [0, 1]. Esto significa que uno de los jugadores tiene una **Estrategia Estrictamente Dominante** y el equilibrio se encuentra en Puras.")
    else:
        st.error("🚨 Los pagos ingresados generan una división por cero. Existe dominancia estricta o el juego es trivial.")
# ==========================================
# MÓDULO 13: TEORÍA DE JUEGOS - FORMA EXTENSIVA (ÁRBOL)
# ==========================================
elif tema_seleccionado == "Forma Extensiva (Árboles)":
    st.markdown("<h2><i class='fas fa-sitemap' style='color:#00FFAA;'></i> Módulo 13: De Estratégica a Extensiva</h2>", unsafe_allow_html=True)
    st.info("💡 **Juegos Secuenciales:** En la forma extensiva, los jugadores no deciden al mismo tiempo. El Jugador 1 mueve primero, y el Jugador 2 observa esa jugada antes de decidir.")

    # 1. Ingreso de datos
    st.subheader("Configuración de Pagos (Nodos Finales)")
    col_in1, col_in2 = st.columns(2)
    val = {}
    with col_in1:
        st.markdown("<h5 style='color:#2196F3;'>Jugador 1 (Mueve Primero)</h5>", unsafe_allow_html=True)
        val["u11"] = st.number_input("Pago J1 (Arriba, Izq)", value=3.0, step=1.0, key="ext_u11")
        val["u12"] = st.number_input("Pago J1 (Arriba, Der)", value=0.0, step=1.0, key="ext_u12")
        val["u21"] = st.number_input("Pago J1 (Abajo, Izq)", value=0.0, step=1.0, key="ext_u21")
        val["u22"] = st.number_input("Pago J1 (Abajo, Der)", value=1.0, step=1.0, key="ext_u22")
    with col_in2:
        st.markdown("<h5 style='color:#FF9800;'>Jugador 2 (Mueve Segundo)</h5>", unsafe_allow_html=True)
        val["v11"] = st.number_input("Pago J2 (Arriba, Izq)", value=2.0, step=1.0, key="ext_v11")
        val["v12"] = st.number_input("Pago J2 (Arriba, Der)", value=1.0, step=1.0, key="ext_v12")
        val["v21"] = st.number_input("Pago J2 (Abajo, Izq)", value=0.0, step=1.0, key="ext_v21")
        val["v22"] = st.number_input("Pago J2 (Abajo, Der)", value=3.0, step=1.0, key="ext_v22")

    st.divider()

    # 2. Generación del Árbol (Método Infalible con Base64 e Imagen)
    st.subheader("🌳 Diagrama del Árbol de Juego")
    
    import base64
    
    # Construimos la sintaxis en texto puro (sin comillas invertidas de Markdown)
    mermaid_code = f"""graph LR
    J1(("Jugador 1")) -->|"Arriba"| J2A(("Jugador 2"))
    J1 -->|"Abajo"| J2B(("Jugador 2"))
    
    J2A -->|"Izquierda"| P1["({val['u11']:g}, {val['v11']:g})"]
    J2A -->|"Derecha"| P2["({val['u12']:g}, {val['v12']:g})"]
    
    J2B -->|"Izquierda"| P3["({val['u21']:g}, {val['v21']:g})"]
    J2B -->|"Derecha"| P4["({val['u22']:g}, {val['v22']:g})"]

    style J1 fill:#2196F3,color:#fff,stroke:#fff,stroke-width:2px
    style J2A fill:#FF9800,color:#fff,stroke:#fff,stroke-width:2px
    style J2B fill:#FF9800,color:#fff,stroke:#fff,stroke-width:2px
    style P1 fill:#333,color:#fff,stroke:#4CAF50,stroke-width:2px
    style P2 fill:#333,color:#fff,stroke:#4CAF50,stroke-width:2px
    style P3 fill:#333,color:#fff,stroke:#4CAF50,stroke-width:2px
    style P4 fill:#333,color:#fff,stroke:#4CAF50,stroke-width:2px
    """
    
    # Codificamos el texto a Base64 para que la API de Mermaid Ink lo renderice como imagen
    encoded_mermaid = base64.b64encode(mermaid_code.encode('utf-8')).decode('utf-8')
    image_url = f"https://mermaid.ink/img/{encoded_mermaid}"
    
    # Mostramos la imagen renderizada nativamente en Streamlit
    st.image(image_url, caption="Árbol Secuencial del Juego (Generado Dinámicamente)")

    # 3. Inducción Hacia Atrás (Resolución del Juego)
    st.divider()
    st.subheader("🧮 Inducción Hacia Atrás (Backwards Induction)")
    
    with st.expander("⭐ [Premium] ¿Cómo se resuelve este juego secuencial?"):
        st.markdown("**Paso 1: Empezamos por el final (Jugador 2)**")
        st.markdown("El Jugador 2 observa lo que hizo el Jugador 1 y elige la rama que le dé el mayor pago (el número naranja/derecho).")
        
        # Lógica de J2 si J1 juega Arriba
        eleccion_j2_arriba = "Izquierda" if val["v11"] > val["v12"] else "Derecha"
        pago_j1_arriba = val["u11"] if eleccion_j2_arriba == "Izquierda" else val["u12"]
        st.markdown(f"* Si J1 juega **Arriba**, J2 tiene que elegir entre ganar {val['v11']:g} (Izquierda) o {val['v12']:g} (Derecha). J2 elegirá **{eleccion_j2_arriba}**.")
        
        # Lógica de J2 si J1 juega Abajo
        eleccion_j2_abajo = "Izquierda" if val["v21"] > val["v22"] else "Derecha"
        pago_j1_abajo = val["u21"] if eleccion_j2_abajo == "Izquierda" else val["u22"]
        st.markdown(f"* Si J1 juega **Abajo**, J2 tiene que elegir entre ganar {val['v21']:g} (Izquierda) o {val['v22']:g} (Derecha). J2 elegirá **{eleccion_j2_abajo}**.")
        
        st.markdown("**Paso 2: La decisión del Jugador 1**")
        st.markdown("El Jugador 1 *anticipa* estas decisiones racionales del Jugador 2. Por lo tanto, reduce el árbol en su mente:")
        st.markdown(f"* Sabe que jugar **Arriba** le garantiza un pago de **{pago_j1_arriba:g}**.")
        st.markdown(f"* Sabe que jugar **Abajo** le garantiza un pago de **{pago_j1_abajo:g}**.")
        
        eleccion_final_j1 = "Arriba" if pago_j1_arriba > pago_j1_abajo else "Abajo"
        
        st.success(f"**🎯 Equilibrio Perfecto en Subjuegos:** El Jugador 1 jugará **{eleccion_final_j1}**.")
# ==========================================
# MÓDULO 14: MATEMÁTICAS 1 - ÁLGEBRA, LÍMITES Y CONTINUIDAD
# ==========================================
elif tema_seleccionado == "Módulo 14: Cálculo de Límites y Continuidad":
    st.markdown("<h2><i class='fas fa-infinity' style='color:#00FFAA;'></i> Matemáticas 1: Fundamentos y Límites</h2>", unsafe_allow_html=True)
    
    st.markdown("Antes de entrar al cálculo diferencial, es vital dominar la manipulación algebraica. Aquí tienes las tablas de propiedades esenciales para la economía y una calculadora de límites para analizar la continuidad.")

    # Pestañas para separar Teoría de Práctica
    tab_prop1, tab_prop2, tab_limites = st.tabs([
        "📚 Potencias y Raíces", 
        "📈 Logaritmos y Desigualdades", 
        "🧮 Calculadora de Límites"
    ])

    # --- PESTAÑA 1: POTENCIAS Y RAÍCES ---
    with tab_prop1:
        st.subheader("Propiedades de la Potenciación y Radicación")
        st.markdown("Fundamentales para despejar variables en modelos de crecimiento intertemporal y funciones de producción.")
        
        c_pot, c_raiz = st.columns(2)
        with c_pot:
            st.markdown("**Potenciación**")
            st.markdown("""
            | Regla | Fórmula | Ejemplo |
            | :--- | :--- | :--- |
            | **Producto de bases iguales** | $x^a \\cdot x^b = x^{a+b}$ | $x^2 \\cdot x^3 = x^5$ |
            | **Cociente de bases iguales** | $\\frac{x^a}{x^b} = x^{a-b}$ | $\\frac{x^5}{x^2} = x^3$ |
            | **Potencia de una potencia** | $(x^a)^b = x^{a \\cdot b}$ | $(x^2)^3 = x^6$ |
            | **Exponente negativo** | $x^{-a} = \\frac{1}{x^a}$ | $x^{-2} = \\frac{1}{x^2}$ |
            | **Exponente cero** | $x^0 = 1 \\quad (x \\neq 0)$ | $5^0 = 1$ |
            """)
            
        with c_raiz:
            st.markdown("**Radicación (Exponentes Fraccionarios)**")
            st.markdown("""
            | Regla | Fórmula | Ejemplo |
            | :--- | :--- | :--- |
            | **Raíz como exponente** | $\\sqrt[b]{x^a} = x^{a/b}$ | $\\sqrt{x} = x^{1/2}$ |
            | **Producto de raíces** | $\\sqrt[n]{x \\cdot y} = \\sqrt[n]{x} \\cdot \\sqrt[n]{y}$ | $\\sqrt{4x} = 2\\sqrt{x}$ |
            | **Cociente de raíces** | $\\sqrt[n]{\\frac{x}{y}} = \\frac{\\sqrt[n]{x}}{\\sqrt[n]{y}}$ | $\\sqrt{\\frac{x}{4}} = \\frac{\\sqrt{x}}{2}$ |
            | **Raíz de una raíz** | $\\sqrt[m]{\\sqrt[n]{x}} = \\sqrt[m \\cdot n]{x}$ | $\\sqrt{\\sqrt[3]{x}} = \\sqrt[6]{x}$ |
            """)

    # --- PESTAÑA 2: LOGARITMOS Y DESIGUALDADES ---
    with tab_prop2:
        st.subheader("Logaritmos Naturales (ln) y Desigualdades")
        st.markdown("En economía, el logaritmo natural ($\\ln$) se usa constantemente para linealizar funciones Cobb-Douglas y calcular tasas de crecimiento (elasticidades).")
        
        c_log, c_des = st.columns(2)
        with c_log:
            st.markdown("**Propiedades de los Logaritmos**")
            st.markdown("""
            | Regla | Fórmula | Aplicación Económica |
            | :--- | :--- | :--- |
            | **Producto** | $\\ln(x \\cdot y) = \\ln(x) + \\ln(y)$ | Separar variables (Capital y Trabajo) |
            | **Cociente** | $\\ln(\\frac{x}{y}) = \\ln(x) - \\ln(y)$ | Tasas de crecimiento relativas |
            | **Potencia** | $\\ln(x^a) = a \\cdot \\ln(x)$ | Bajar exponentes para volverlos coeficientes lineales |
            | **Logaritmo de 1** | $\\ln(1) = 0$ | Puntos de equilibrio base |
            | **Inversa Exponencial**| $\\ln(e^x) = x$ | Interés compuesto continuo |
            """)
            
        with c_des:
            st.markdown("**Reglas de Desigualdades (Inecuaciones)**")
            st.markdown("""
            | Acción | Regla (Si $a > b$) | Consecuencia |
            | :--- | :--- | :--- |
            | **Sumar/Restar** | $a \\pm c > b \\pm c$ | La desigualdad se mantiene idéntica. |
            | **Multiplicar por (+)** | $a \\cdot c > b \\cdot c \\quad (c > 0)$ | La desigualdad se mantiene idéntica. |
            | **Multiplicar por (-)** | $a \\cdot (-c) < b \\cdot (-c)$ | 🚨 **¡Atención!** El signo se invierte. |
            | **Inversos** | $\\frac{1}{a} < \\frac{1}{b} \\quad (a,b > 0)$ | 🚨 **¡Atención!** El signo se invierte. |
            """)

    # --- PESTAÑA 3: CALCULADORA DE LÍMITES ---
    with tab_limites:
        st.subheader("Laboratorio de Límites y Continuidad")
        st.markdown("Evalúa si una función presenta singularidades (ej. divisiones por cero) o si el límite existe en un punto.")
        
        try:
            tema = datos["matematicas_1"]["limites"]
            
            with st.container(border=True):
                c_in1, c_in2 = st.columns([2, 1])
                with c_in1:
                    func_str = st.text_input("Función f(x):", value=tema["variables"]["funcion"]["valor_defecto"])
                    st.caption(tema["variables"]["funcion"]["ayuda_real"])
                with c_in2:
                    tendencia_str = st.text_input("x tiende a:", value=tema["variables"]["tendencia"]["valor_defecto"])
                    st.caption(tema["variables"]["tendencia"]["ayuda_real"])

            x = sp.Symbol('x')
            
            # Limpieza de inputs
            clean_func = func_str.replace('^', '**').replace('X', 'x')
            f_x = sp.sympify(clean_func)
            tendencia = sp.sympify(tendencia_str)
            
            # Cálculo de límites (General, Izquierda y Derecha)
            limite_general = sp.limit(f_x, x, tendencia)
            limite_izq = sp.limit(f_x, x, tendencia, dir='-')
            limite_der = sp.limit(f_x, x, tendencia, dir='+')
            
            st.divider()
            st.subheader("📊 Resultados del Límite")
            st.latex(f"\\lim_{{x \\to {sp.latex(tendencia)}}} \\left( {sp.latex(f_x)} \\right)")
            
            c_res1, c_res2 = st.columns(2)
            with c_res1:
                # Validación de continuidad / existencia
                if limite_izq == limite_der:
                    st.success(f"**El límite EXISTE.**")
                    st.latex(f"L = {sp.latex(limite_general)}")
                else:
                    st.error("**El límite NO EXISTE** en ese punto.")
                    st.markdown("Los límites laterales arrojan valores distintos (discontinuidad de salto).")
            
            with c_res2:
                st.markdown("**Límites Laterales:**")
                st.latex(f"\\lim_{{x \\to {sp.latex(tendencia)}^-}} = {sp.latex(limite_izq)}")
                st.latex(f"\\lim_{{x \\to {sp.latex(tendencia)}^+}} = {sp.latex(limite_der)}")

            st.divider()
            st.subheader("🛠️ Carpintería Matemática (Paso a Paso)")
            
            if tipo_cuenta == "Básica (Gratis)":
                st.markdown("""
                <div style="background-color: rgba(255, 68, 68, 0.1); border-left: 5px solid #FF4444; padding: 15px; border-radius: 5px;">
                    <h4 style="color: #FF4444; margin-top: 0;">🔒 Contenido Premium Bloqueado</h4>
                    <p>La resolución algebraica detallada para levantar indeterminaciones (Factorización, Conjugado o L'Hôpital) es exclusiva para usuarios Premium.</p>
                </div>
                """, unsafe_allow_html=True)
            else:
                st.markdown("""
                <div style="background-color: rgba(0, 255, 170, 0.1); border-left: 5px solid #00FFAA; padding: 15px; border-radius: 5px;">
                    <h4 style="color: #00FFAA; margin-top: 0;">🔓 Acceso Premium Concedido</h4>
                </div>
                """, unsafe_allow_html=True)
                st.write("")
                
                # Evaluación directa inicial
                num, den = sp.fraction(sp.cancel(f_x))
                val_num = num.subs(x, tendencia)
                val_den = den.subs(x, tendencia)
                
                st.markdown("**1. Evaluación Directa:**")
                st.latex(f"f({sp.latex(tendencia)}) = \\frac{{{sp.latex(val_num)}}}{{{sp.latex(val_den)}}}")
                
                if val_den == 0 and val_num == 0:
                    st.warning("⚠️ **Indeterminación 0/0 detectada.** Aplicamos simplificación algebraica (factorización):")
                    f_simplificada = sp.simplify(f_x)
                    st.latex(f"f(x) \\rightarrow {sp.latex(f_simplificada)}")
                    st.markdown("**2. Reevaluación del límite:**")
                    st.latex(f"\\lim_{{x \\to {sp.latex(tendencia)}}} {sp.latex(f_simplificada)} = {sp.latex(limite_general)}")
                elif val_den == 0 and val_num != 0:
                    st.info("⚠️ El denominador es cero pero el numerador no. El límite tiende a infinito matemático (asíntota vertical).")
                else:
                    st.success("El límite se resuelve por evaluación directa (No hay singularidad).")

        except Exception as e:
            st.error(f"🚨 Faltan datos en el JSON o hay un error de sintaxis en la función. Detalle técnico: {e}")

# ==========================================
# MÓDULO 15: MATEMÁTICAS 2 - OPTIMIZACIÓN DE 1 VARIABLE
# ==========================================
elif tema_seleccionado == "Módulo 15: Optimización de 1 Variable":
    st.markdown("<h2><i class='fas fa-subscript' style='color:#00FFAA;'></i> Matemáticas 2: Cálculo Diferencial</h2>", unsafe_allow_html=True)
    
    st.markdown("En este curso pasamos de la estática a la dinámica. La derivada nos permite entender el cambio marginal: ¿cómo varía el beneficio si produzco una unidad adicional?")

    # Pestañas: Formulario de "Carpintería" y Calculadora
    tab_reglas, tab_calculadora = st.tabs(["📚 Formulario de Derivadas", "🧮 Optimizador de Funciones"])

    with tab_reglas:
        st.subheader("Reglas de Derivación (Indispensables para el Parcial)")
        st.markdown("Memorizar estas reglas es la base para resolver cualquier ejercicio de optimización económica.")
        
        c_der1, c_der2 = st.columns(2)
        with c_der1:
            st.markdown("**Reglas Básicas**")
            st.latex(r"\frac{d}{dx}[c] = 0")
            st.latex(r"\frac{d}{dx}[x^n] = nx^{n-1}")
            st.latex(r"\frac{d}{dx}[e^x] = e^x")
            st.latex(r"\frac{d}{dx}[\ln(x)] = \frac{1}{x}")
        with c_der2:
            st.markdown("**Reglas Compuestas**")
            st.latex(r"\text{Producto: } (f \cdot g)' = f'g + fg'")
            st.latex(r"\text{Cociente: } (\frac{f}{g})' = \frac{f'g - fg'}{g^2}")
            st.latex(r"\text{Cadena: } \frac{d}{dx}[f(g(x))] = f'(g(x)) \cdot g'(x)")

    with tab_calculadora:
        st.subheader("Optimizador de 1 Variable")
        try:
            # Cargamos los datos del JSON (Asegúrate que la llave sea matematicas_2)
            tema = datos["matematicas_2"]["optimizacion_1v"]
            
            with st.container(border=True):
                func_str = st.text_input("Ingresa f(x):", value=tema["variables"]["funcion"]["valor_defecto"])
                st.caption("Usa '^' o '**' para potencias. Ejemplo: `-x^2 + 40*x - 100`")

            x = sp.Symbol('x')
            # Limpiamos la función para que SymPy no sufra
            clean_func = func_str.replace('^', '**').replace('X', 'x').replace(' ', '')
            f_x = sp.sympify(clean_func)
            
            # Cálculo de Derivadas
            derivada = sp.diff(f_x, x)
            segunda_derivada = sp.diff(derivada, x)
            
            # Hallar Puntos Críticos Reales
            puntos_criticos_crudos = sp.solve(derivada, x)
            puntos_criticos = [p for p in puntos_criticos_crudos if sp.im(p) == 0]

            st.divider()
            st.latex(f"f(x) = {sp.latex(f_x)}")
            
            col_res, col_graf = st.columns([1, 1.5])
            
            with col_res:
                if not puntos_criticos:
                    st.warning("No hay puntos críticos reales.")
                    centro = 0
                else:
                    st.success(f"Puntos críticos: {len(puntos_criticos)}")
                    for p in puntos_criticos:
                        st.metric("Punto Óptimo x*", f"{float(p.evalf()):.2f}")
                    centro = float(puntos_criticos[0].evalf())
            
            with col_graf:
                # Gráfica
                f_np = sp.lambdify(x, f_x, 'numpy')
                x_vals = np.linspace(centro - 15, centro + 15, 200)
                df_graf = pd.DataFrame({"x": x_vals, "f(x)": f_np(x_vals)}).set_index("x")
                st.line_chart(df_graf, color="#00FFAA")

            # ====== PAYWALL DE MONETIZACIÓN ======
            st.divider()
            st.subheader("🛠️ Desarrollo de la Carpintería")
            
            if tipo_cuenta == "Básica (Gratis)":
                st.error("🔒 **CONTENIDO PREMIUM:** El paso a paso analítico (CPO, CSO y clasificación) está bloqueado para usuarios gratuitos.")
                st.button("Actualizar a Premium 🚀", type="primary", key="paywall_m2")
            else:
                st.success("🔓 **ACCESO PREMIUM:** Resolución analítica:")
                st.markdown("**1. Condición de Primer Orden (CPO):**")
                st.latex(f"f'(x) = {sp.latex(derivada)} = 0")
                
                st.markdown("**2. Condición de Segundo Orden (CSO):**")
                st.latex(f"f''(x) = {sp.latex(segunda_derivada)}")
                
                for p in puntos_criticos:
                    cso_val = segunda_derivada.subs(x, p).evalf()
                    if cso_val < 0:
                        st.info(f"Para $x^*={p}$, $f'' < 0$: Es un **MÁXIMO** (Cóncava $\\cap$).")
                    elif cso_val > 0:
                        st.info(f"Para $x^*={p}$, $f'' > 0$: Es un **MÍNIMO** (Convexa $\\cup$).")

        except Exception as e:
            st.error(f"Error en la entrada matemática o en la llave del JSON. Verifica que en tu JSON diga 'matematicas_2'. Detalle: {e}")
# ==========================================
# MÓDULO 16: MATEMÁTICAS 3 - ÁREAS E INTEGRALES
# ==========================================
elif tema_seleccionado == "Módulo 16: Áreas e Integrales":
    st.markdown("<h2><i class='fas fa-chart-area' style='color:#00FFAA;'></i> Matemáticas 3: Cálculo Integral</h2>", unsafe_allow_html=True)
    
    st.markdown("Mientras la derivada encuentra valores marginales, la **Integral** acumula. Se usa para hallar el Excedente del Consumidor, el Costo Total a partir del Costo Marginal, o el Valor Presente de un flujo de caja continuo.")
    
    tab_reglas, tab_calculadora = st.tabs(["📚 Formulario y Métodos", "🧮 Calculadora de Áreas"])

    with tab_reglas:
        st.subheader("Tabla de Integrales y Métodos de Integración")
        st.markdown("Estas son las herramientas fundamentales para revertir el proceso de derivación (encontrar la antiderivada).")
        
        c_int1, c_int2 = st.columns(2)
        with c_int1:
            st.markdown("**Integrales Inmediatas Básicas**")
            st.latex(r"1.\; \text{Constante: } \int k \ dx = kx + C")
            st.latex(r"2.\; \text{Potencia: } \int x^n \ dx = \frac{x^{n+1}}{n+1} + C \quad (n \neq -1)")
            st.latex(r"3.\; \text{Logarítmica: } \int \frac{1}{x} \ dx = \ln|x| + C")
            st.latex(r"4.\; \text{Exponencial: } \int e^x \ dx = e^x + C")
            
        with c_int2:
            st.markdown("**Propiedades de Linealidad**")
            st.latex(r"\text{Suma/Resta: } \int [f(x) \pm g(x)] dx = \int f(x) dx \pm \int g(x) dx")
            st.latex(r"\text{Múltiplo Constante: } \int k \cdot f(x) dx = k \int f(x) dx")
            st.markdown("**Evaluación (Teorema Fundamental)**")
            st.latex(r"\text{Regla de Barrow: } \int_a^b f(x) dx = F(b) - F(a)")

        st.divider()
        st.markdown("**Técnicas Avanzadas de Integración**")
        c_met1, c_met2 = st.columns(2)
        with c_met1:
            st.markdown("**1. Integración por Sustitución**")
            st.markdown("Se usa cuando identificas una función y su derivada dentro de la misma integral (Regla de la Cadena inversa).")
            st.latex(r"\int f(g(x))g'(x) dx = \int f(u) du")
            st.caption("Donde $u = g(x)$ y $du = g'(x)dx$.")
        with c_met2:
            st.markdown("**2. Integración por Partes**")
            st.markdown("Ideal para productos de funciones (ej. $x \cdot e^x$). Se usa la regla nemotécnica de la vaca: *\"Un Día Vi Una Vaca Menos Vestida De Uniforme\"*.")
            st.latex(r"\int u \ dv = u \cdot v - \int v \ du")
            st.caption("Usa ILATE (Inversas, Logarítmicas, Algebraicas, Trigonométricas, Exponenciales) para elegir la variable $u$.")

    with tab_calculadora:
        st.subheader("Optimizador de Áreas Bajo la Curva")
        try:
            tema = datos["matematicas_3"]["integrales"]

            with st.container(border=True):
                st.markdown("### ⚙️ Parámetros de Integración")
                c_in1, c_in2, c_in3 = st.columns([2, 1, 1])
                with c_in1:
                    func_str = st.text_input("Función Marginal f(x):", value=tema["variables"]["funcion"]["valor_defecto"])
                with c_in2:
                    lim_a = st.number_input("Límite Inferior (a):", value=float(tema["variables"]["lim_inf"]["valor_defecto"]), step=1.0)
                with c_in3:
                    lim_b = st.number_input("Límite Superior (b):", value=float(tema["variables"]["lim_sup"]["valor_defecto"]), step=1.0)

            x = sp.Symbol('x')
            
            # Limpieza de input inteligente
            clean_func = func_str.replace('^', '**').replace('X', 'x')
            f_x = sp.sympify(clean_func)
            
            # Cálculos
            integral_indefinida = sp.integrate(f_x, x)
            area_total = sp.integrate(f_x, (x, lim_a, lim_b))
            
            st.divider()
            st.subheader("📊 Resultado Final")
            
            col_res, col_graf = st.columns([1, 1.5])
            
            with col_res:
                st.latex(f"\\int_{{{lim_a}}}^{{{lim_b}}} \\left( {sp.latex(f_x)} \\right) dx")
                st.metric(label="Área Total Acumulada", value=f"{float(area_total.evalf()):.4f}")
                
            with col_graf:
                st.markdown("**Visualización del Área (Sombreada)**")
                f_np = sp.lambdify(x, f_x, 'numpy')
                x_vals = np.linspace(lim_a, lim_b, 100)
                y_vals = f_np(x_vals)
                
                # Prevenir errores si la función es una constante
                if isinstance(y_vals, (int, float)): 
                    y_vals = np.full_like(x_vals, y_vals)
                    
                df_grafica = pd.DataFrame({"x": x_vals, "Área": y_vals}).set_index("x")
                st.area_chart(df_grafica, color="#00FFAA")

            st.divider()
            
            # ====== PAYWALL DE MONETIZACIÓN ======
            st.subheader("🛠️ Carpintería: Teorema Fundamental del Cálculo")
            
            if tipo_cuenta == "Básica (Gratis)":
                st.markdown("""
                <div style="background-color: rgba(255, 68, 68, 0.1); border-left: 5px solid #FF4444; padding: 15px; border-radius: 5px;">
                    <h4 style="color: #FF4444; margin-top: 0;">🔒 Contenido Premium Bloqueado</h4>
                    <p>Ya conoces el área final para verificar tu resultado, pero la <b>Antiderivada $F(x)$</b> y la evaluación algebraica paso a paso $(F(b) - F(a))$ están bloqueadas en la versión gratuita.</p>
                </div>
                """, unsafe_allow_html=True)
                st.write("")
                st.button("⭐ Desbloquear Paso a Paso por $4.99/mes", type="primary", key="btn_int")
            else:
                st.markdown("""
                <div style="background-color: rgba(0, 255, 170, 0.1); border-left: 5px solid #00FFAA; padding: 15px; border-radius: 5px;">
                    <h4 style="color: #00FFAA; margin-top: 0;">🔓 Acceso Premium Concedido</h4>
                </div>
                """, unsafe_allow_html=True)
                st.write("")
                
                st.markdown("**1. Integral Indefinida (Antiderivada):**")
                st.markdown("Integramos la función usando las reglas de la tabla y agregamos la constante de integración $C$.")
                st.latex(f"F(x) = \\int {sp.latex(f_x)} \\ dx = {sp.latex(integral_indefinida)} + C")
                
                st.markdown("**2. Evaluación de Límites (Regla de Barrow):**")
                st.markdown("Evaluamos la antiderivada en el límite superior y le restamos la evaluación en el límite inferior: $F(b) - F(a)$")
                
                eval_b = integral_indefinida.subs(x, lim_b)
                eval_a = integral_indefinida.subs(x, lim_a)
                
                st.latex(f"F({lim_b}) = {sp.latex(eval_b)}")
                st.latex(f"F({lim_a}) = {sp.latex(eval_a)}")
                
                st.markdown("**3. Resultado Analítico:**")
                st.latex(f"\\int_{{{lim_a}}}^{{{lim_b}}} f(x) dx = \\left[ {sp.latex(eval_b)} \\right] - \\left[ {sp.latex(eval_a)} \\right] = {sp.latex(area_total)}")

        except Exception as e:
            st.error(f"🚨 Error en la función matemática. Recuerda usar '*' para multiplicar y '**' para potencias. Detalle: {e}")