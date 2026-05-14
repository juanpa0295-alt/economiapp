import json
import streamlit as st
import pandas as pd
import numpy as np
import sympy as sp
import google.generativeai as genai

# ==========================================
# 1. CONFIGURACIÓN DE PÁGINA
# ==========================================
st.set_page_config(page_title="Cifras Claras | Educación", page_icon="🧭", layout="wide")

# ==========================================
# 2. CARGA DE DATOS BASE
# ==========================================
try:
    with open('datos_materias.json', 'r', encoding='utf-8') as f:
        datos = json.load(f)
except FileNotFoundError:
    st.error("🚨 No se encontró el archivo 'datos_materias.json'. Verifica que esté en la misma carpeta.")
    st.stop()

# ==========================================
# 3. CSS PERSONALIZADO (DISEÑO INSTITUCIONAL PREMIUM)
# ==========================================
st.markdown("""
<style>
    /* 1. Fuentes e Iconos */
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
    
    html, body, [class*="css"], .stMarkdown, .stText { 
        font-family: 'Montserrat', sans-serif !important; 
    }

    /* 2. Fondo Base Claro (Gris Perla) */
    .stApp, [data-testid="stAppViewContainer"] {
        background-color: #F8FAFC !important; 
    }

    /* 3. Títulos Corporativos (Azul Marino Cifras Claras) */
    h1, h2 {
        color: #1E3A8A !important;
        font-weight: 800 !important;
        letter-spacing: -0.5px;
    }
    h3, h4 {
        color: #2563EB !important;
        font-weight: 600 !important;
    }

    /* 4. Tarjetas Suaves (Glassmorphism Light) */
    div[data-testid="stVerticalBlock"] div[style*="border"] {
        border-radius: 12px !important;
        border: 1px solid #E2E8F0 !important; 
        background-color: #FFFFFF !important; 
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03) !important;
        transition: all 0.3s ease;
    }
    
    /* Efecto Hover en las tarjetas */
    div[data-testid="stVerticalBlock"] div[style*="border"]:hover {
        border-color: #93C5FD !important;
        box-shadow: 0 10px 25px rgba(37, 99, 235, 0.1) !important;
        transform: translateY(-2px);
    }

    /* 5. Botones Estilo SaaS (Degradado Azul/Verde) */
    .stButton > button {
        background: linear-gradient(90deg, #2563EB 0%, #059669 100%) !important;
        color: #FFFFFF !important;
        border: none !important;
        border-radius: 8px !important;
        font-weight: 600 !important;
        letter-spacing: 0.5px;
        transition: all 0.3s ease !important;
    }
    
    .stButton > button:hover {
        transform: scale(1.02) !important;
        box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3) !important;
    }

    /* 6. Expanders y Alertas */
    .streamlit-expanderHeader {
        background-color: #EFF6FF !important;
        color: #1E3A8A !important;
        font-weight: 600;
        border-radius: 8px !important;
    }
    
    div[data-testid="stAlert"] {
        border-radius: 10px;
        border: none !important;
    }

    /* Ocultar elementos pero rescatar la flecha del menú */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {background-color: transparent !important;}
    [data-testid="stHeader"]::before {content: none;}
    .stDeployButton {display: none !important;}
</style>
""", unsafe_allow_html=True)

# ==========================================
# 4. MENÚ LATERAL (IDENTIDAD CORPORATIVA)
# ==========================================
with st.sidebar:
    # 4.1 Cargar el logo de Cifras Claras
    try:
        # ¡AQUÍ ESTÁ EL CAMBIO! Ponemos el nombre sencillo
        st.image("Logo.jpg", use_container_width=True)
    except:
        st.warning("⚠️ Logo no encontrado. Verifica que se llame 'Logo.jpg'.")
    
    st.markdown("<hr style='margin-top: 0; margin-bottom: 15px;'>", unsafe_allow_html=True)
    
    # 4.2 Navegación Principal
    materia_seleccionada = st.radio(
        "📚 Selecciona la Materia:", 
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
    
    # 4.3 Submenús por Materia
    if materia_seleccionada == "Principios de Macroeconomía":
        st.markdown("<h3><i class='fas fa-chart-line' style='color:#00FFAA;'></i> Temas Activos</h3>", unsafe_allow_html=True)
        tema_seleccionado = st.radio("Selecciona el Tema:", ["PIB (Enfoque Gasto)", "Mercado de Dinero", "Modelo IS-LM"])
        
    elif materia_seleccionada == "Macroeconomía 1":
        st.markdown("<h3><i class='fas fa-exchange-alt' style='color:#1E3A8A;'></i> Temas Activos</h3>", unsafe_allow_html=True)
        tema_seleccionado = st.radio("Selecciona el Tema:", [
            "Teoría del Consumo", 
            "Consumo Intertemporal", 
            "Inversión", 
            "Gobierno y Política Fiscal",
            "Microfundamentos: El Problema de la Firma",
            "Equilibrio General Dinámico"
        ])
        
    elif materia_seleccionada == "Teoría de Juegos":
        st.markdown("<h3><i class='fas fa-chess-knight' style='color:#1E3A8A;'></i> Preparación Parcial</h3>", unsafe_allow_html=True)
        tema_seleccionado = st.radio("Selecciona el Tema:", [
            "Equilibrios de Nash (Puras)",
            "Estrategias Mixtas (Cálculo p y q)",
            "Forma Extensiva y Dominancia",
            "Arbitraje de Oferta Final" 
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
        
    else: # Estadística 2
        st.markdown("<h3><i class='fas fa-chart-pie' style='color:#00FFAA;'></i> Temas Activos</h3>", unsafe_allow_html=True)
        tema_seleccionado = st.radio("Selecciona el Tema:", ["Estimadores Estadísticos", "Intervalos y Tamaño de Muestra", "Pruebas de Hipótesis", "Pruebas de Hipótesis Avanzadas"])
    
    st.divider()
    
    # 4.4 Monetización (Duplicado corregido)
    st.markdown("### 👑 Suscripción")
    tipo_cuenta = st.radio("Nivel de Acceso:", ["Básica (Gratis)", "Premium (Pago)"], index=0)

    st.divider()

    # 4.5 Mensaje de Valor (Tip Económico del Día)
    st.markdown("""
    <div style="background-color: #E6FFFA; border-left: 4px solid #319795; padding: 12px; border-radius: 4px;">
        <p style="color: #285E61; margin: 0; font-size: 0.9em;">
        <strong>💡 Tip de Estudio:</strong><br>
        En Teoría de Juegos, recuerda que el equilibrio de Nash no siempre es el resultado óptimo de Pareto (ej. Dilema del Prisionero). ¡Analiza los incentivos!
        </p>
    </div>
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
                # Saltos de 500,000 para el dinero, 0.05 para la propensión
                paso_v = 0.05 if simbolo == "c1" else 500000.0
                valores_ingresados[simbolo] = st.number_input(
                    f"{info['nombre']} ({simbolo})", 
                    value=float(info['valor_defecto']),
                    step=paso_v,
                    key=f"pib_mult_input_{simbolo}"
                )
                with st.expander("💡 Info"):
                    st.markdown(info['ayuda_real'])

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

    # Aquí generamos los inputs con el 'step' dinámico
    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        with col_input1 if i % 2 == 0 else col_input2:
            with st.container(border=True):
                
                # --- LÓGICA DE SALTOS INTELIGENTES ---
                if simbolo == "c1": # Propensión marginal a consumir
                    salto = 0.05
                else:               # Ingreso, Impuestos, Consumo Autónomo
                    salto = 100.0
                    
                valores_ingresados[simbolo] = st.number_input(f"{info['nombre']} ({simbolo})", value=float(info['valor_defecto']), step=salto)
                
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
    # Cálculo de la Tasa de Consumo (PMeC) para cumplir con la nota 1.4
    pmec = float(C_total) / Y_val if Y_val > 0 else 0
    ahorro = (Y_val - T_val) - C_total

    with col_form2:
        st.markdown("**Fórmula con tus Valores Actuales:**")
        st.latex(sp.latex(ecuacion_sustituida))
        st.markdown(f"### ➡️ Consumo Total (C) = `{float(C_total):,.2f}`")
        
        st.divider()
        st.markdown("**Cálculo de Propensiones (Tasas):**")
        
        # Mostramos explícitamente la matemática de dónde salen
        st.latex(rf"PMeC = \frac{{C}}{{Y}} = \frac{{{float(C_total):,.0f}}}{{{Y_val:,.0f}}} = {pmec:.3f}")
        st.latex(rf"PMgC = c_1 = {c1}")
        
        # Explicación de la Convergencia
        if pmec > c1:
            st.info(f"💡 **Convergencia:** Fíjate en el cálculo matemático superior. Tu Propensión Media ({pmec:.2f}) es mayor a la Marginal ({c1}). La teoría indica que a medida que tu ingreso ($Y$) crezca, ese denominador se hará más grande, haciendo que la PMeC caiga lentamente hasta igualar a tu PMgC ({c1}).")
    st.divider()
    col_pasos, col_grafico = st.columns(2)

    with col_pasos:
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
        st.subheader("📈 Función de Consumo")
        st.markdown("Visualización del consumo frente a diferentes niveles de ingreso.")
        
        import numpy as np 
        rango_Y = np.linspace(0, Y_val * 2 if Y_val > 0 else 1000, 20)
        rango_C = [C0 + c1 * (y - T_val) for y in rango_Y]
        
        datos_grafico = pd.DataFrame({
            "Ingreso (Y)": rango_Y,
            "Consumo (C)": rango_C,
            "Recta 45° (Y=C)": rango_Y
        }).set_index("Ingreso (Y)")
        
        st.line_chart(datos_grafico, color=["#2563EB", "#9CA3AF"]) # Ajusté los colores al tema azul de Cifras Claras

    # ====== ANÁLISIS MARGINAL (CONSUMO) ======
    st.divider()
    st.subheader("🧮 Análisis Marginal e Impacto")
    
    funcion_C = C_0_sym + c_1_sym * (Y_sym - T_sym)
    
    opciones_consumo = {
        "Ingreso (Y)": Y_sym,
        "Impuestos (T)": T_sym
    }
    
    var_seleccionada = st.radio("¿Qué variable deseas derivar con respecto a C?", list(opciones_consumo.keys()), horizontal=True, key="sel_der_consumo")
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
                    # Saltos inteligentes: decimales para tasas (r, rho, theta) y millones para sueldos (Y)
                    paso_v = 0.01 if simbolo in ["r", "rho", "theta"] else 100000.0
                    valores_ingresados[simbolo] = st.number_input(
                        f"{info['nombre']}", 
                        value=float(info['valor_defecto']), 
                        step=paso_v, 
                        key=f"basic_input_{simbolo}"
                    )

        # Extracción segura de variables
        Y1 = float(valores_ingresados.get("Y1", 1000.0))
        Y2 = float(valores_ingresados.get("Y2", 1100.0))
        r = float(valores_ingresados.get("r", 0.10))
        alpha = float(valores_ingresados.get("alpha", 0.5))
        beta = float(valores_ingresados.get("beta", 0.5))

        # ====== CÁLCULOS ======
        r = valores_ingresados.get("r", 0.05)
        rho = valores_ingresados.get("rho", 0.08)
        theta = valores_ingresados.get("theta", 1.5)
        
        # Riqueza Intertemporal: Y1 + Y2/(1+r)
        W = Y1 + (Y2 / (1 + r))
        
        # Ecuación de Euler (Trade-off óptimo entre hoy y mañana)
        factor_euler = ((1 + r) / (1 + rho))**(1 / theta)
        
        # Consumo Óptimo (Sustitución de Euler en la Restricción)
        C1_optimo = W / (1 + (factor_euler / (1 + r)))
        C2_optimo = C1_optimo * factor_euler
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
            st.subheader("📝 Resolución Macro (Euler)")
            
            st.markdown("**1. Riqueza Intertemporal ($W$):**")
            st.latex(rf"W = Y_1 + \frac{{Y_2}}{{1+r}} = {W:,.2f}")
            
            st.markdown("**2. Condición de Euler (Consumo futuro en función del presente):**")
            st.latex(rf"C_2 = C_1 \left( \frac{{1+r}}{{1+\rho}} \right)^{{\frac{{1}}{{\theta}}}}")
            st.latex(rf"C_2 = C_1 \cdot {factor_euler:.4f}")
            
            st.markdown("**3. Canasta Óptima:**")
            st.latex(rf"C_1^* = {C1_optimo:,.2f} \quad | \quad C_2^* = {C2_optimo:,.2f}")

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
        
        var_seleccionada = st.radio(
            "Selecciona qué efecto deseas evaluar:", 
            list(opciones_fisher.keys()), 
            horizontal=True, 
            key="radio_marginal_intertemporal"
        )
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
        var_a_derivar_n = st.radio("Derivar Riqueza ($W$) respecto a:", opciones_derivar_n, horizontal=True, key="select_dyn_n")
        
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
    st.title("Laboratorio de Macroeconomía y Negocios 📊")
    tema = datos["macroeconomia_1"]["inversion"]
    st.markdown(f"<h2><i class='fas fa-exchange-alt' style='color:#2563EB;'></i> {tema['nombre']}</h2>", unsafe_allow_html=True)

    st.subheader("Configuración de Variables de la Empresa")
    col_input1, col_input2 = st.columns(2)
    valores_ingresados = {}

    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        with col_input1 if i % 2 == 0 else col_input2:
            with st.container(border=True):
                # --- LÓGICA DE SALTOS PARA MILLONES DE PESOS ---
                if simbolo in ["r", "delta", "alpha"]:
                    paso = 0.01
                else:
                    paso = 5000000.0 # Salto de 5 millones de COP para el dinero
                    
                valores_ingresados[simbolo] = st.number_input(
                    f"{info['nombre']}", 
                    value=float(info['valor_defecto']), 
                    step=paso, 
                    key=f"inv_input_{simbolo}"
                )
                with st.expander("💡 ¿Qué pongo aquí?"):
                    st.markdown(info['ayuda_real'])

    # Extracción segura con los nuevos valores en millones
    Y_val = float(valores_ingresados.get("Y", 500000000.0))
    alpha = float(valores_ingresados.get("alpha", 0.33))
    r = float(valores_ingresados.get("r", 0.12))
    delta = float(valores_ingresados.get("delta", 0.10))
    K_prev = float(valores_ingresados.get("K_prev", 1000000000.0))
    VM = float(valores_ingresados.get("VM", 1500000000.0))
    CR = float(valores_ingresados.get("CR", 1200000000.0))

    st.divider()
    
    tab_neoclasico, tab_tobin = st.tabs(["🏛️ Decisión de Compra (Neoclásico)", "📈 Valoración de Empresa (Tobin)"])

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
        
        simbolo_derivar = opciones_k[st.radio(
            "¿Qué variable deseas derivar con respecto a K*?", 
            list(opciones_k.keys()), 
            horizontal=True, # ¡Esta es la magia que lo vuelve una barra!
            key="sel_der_inv"
        )]
        
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
    enfoque = st.radio("Selecciona el Área de Estudio:", [
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
    nc_seleccionado = st.radio("Nivel de Confianza (1 - α):", list(niveles_z.keys()), index=1, horizontal=True)
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
    import scipy.stats as stats # Necesario para la distribución T y Z exacta

    st.markdown("<h2><i class='fas fa-balance-scale' style='color:#00FFAA;'></i> Pruebas de Hipótesis</h2>", unsafe_allow_html=True)
    
    st.markdown("La prueba de hipótesis es el método formal para decidir si los datos de nuestra muestra tienen suficiente evidencia para desmentir una creencia previa (el Status Quo).")
    
    st.subheader("Configuración del Test")

    # 1. Selección del tipo de parámetro y estadístico
    tipo_parametro = st.selectbox("Parámetro y Estadístico a evaluar:", [
        "Media Poblacional - Varianza Conocida (Test Z)",
        "Media Poblacional - Varianza Desconocida (Test T)",
        "Proporción Poblacional (Test Z)"
    ])
    
    # 2. Tipo de Prueba (Colas)
    tipo_prueba = st.radio("Tipo de Prueba (Cola):", [
        "Dos Colas (Diferente a: ≠)",
        "Cola Derecha (Mayor que: >)",
        "Cola Izquierda (Menor que: <)"
    ], horizontal=True)
    
    # 3. Entradas dinámicas según el tipo de parámetro
    st.markdown("**Ingresa los parámetros de la muestra y la hipótesis:**")
    col_in1, col_in2, col_in3 = st.columns(3)
    val = {}
    
    # Configuramos los inputs para no depender exclusivamente de un JSON fijo y evitar errores
    if "Proporción" in tipo_parametro:
        inputs_config = {
            "p_0": {"nombre": "Prop. Hipotética (p₀)", "def": 0.5, "step": 0.01},
            "p_hat": {"nombre": "Prop. Muestral (p̂)", "def": 0.6, "step": 0.01},
            "n": {"nombre": "Tamaño Muestral (n)", "def": 100, "step": 1},
            "alpha": {"nombre": "Significancia (α)", "def": 0.05, "step": 0.01}
        }
    elif "Test T" in tipo_parametro:
        inputs_config = {
            "mu_0": {"nombre": "Media Hipotética (μ₀)", "def": 50.0, "step": 1.0},
            "x_bar": {"nombre": "Media Muestral (x̄)", "def": 52.0, "step": 1.0},
            "s": {"nombre": "Desv. Est. Muestral (s)", "def": 5.5, "step": 0.5},
            "n": {"nombre": "Tamaño Muestral (n)", "def": 20, "step": 1},
            "alpha": {"nombre": "Significancia (α)", "def": 0.05, "step": 0.01}
        }
    else:
        inputs_config = {
            "mu_0": {"nombre": "Media Hipotética (μ₀)", "def": 50.0, "step": 1.0},
            "x_bar": {"nombre": "Media Muestral (x̄)", "def": 52.0, "step": 1.0},
            "sigma": {"nombre": "Desv. Est. Poblacional (σ)", "def": 5.0, "step": 0.5},
            "n": {"nombre": "Tamaño Muestral (n)", "def": 30, "step": 1},
            "alpha": {"nombre": "Significancia (α)", "def": 0.05, "step": 0.01}
        }

    # Renderizado dinámico de los inputs
    for i, (simbolo, info) in enumerate(inputs_config.items()):
        if i % 3 == 0: col = col_in1
        elif i % 3 == 1: col = col_in2
        else: col = col_in3
        
        with col:
            with st.container(border=True):
                if simbolo == "n":
                    val[simbolo] = st.number_input(info['nombre'], value=int(info['def']), step=info['step'], format="%d")
                elif simbolo == "alpha":
                    val[simbolo] = st.number_input(info['nombre'], value=float(info['def']), step=info['step'], format="%.3f")
                else:
                    val[simbolo] = st.number_input(info['nombre'], value=float(info['def']), step=info['step'], format="%.2f")
    
    alpha = val["alpha"]
    n = val["n"]

    # ====== MOTOR MATEMÁTICO UNIVERSAL ======
    if "Proporción" in tipo_parametro:
        p_0, p_hat = val["p_0"], val["p_hat"]
        param_simbolo, valor_hipotetico, valor_muestral = "p", p_0, p_hat
        
        # Para pruebas de hipótesis de proporción se usa p_0 en el error estándar
        error_estandar = math.sqrt((p_0 * (1 - p_0)) / n)
        stat_calc = (p_hat - p_0) / error_estandar
        dist = stats.norm
        stat_name = "Z"
        
    elif "Test T" in tipo_parametro:
        mu_0, x_bar, s = val["mu_0"], val["x_bar"], val["s"]
        param_simbolo, valor_hipotetico, valor_muestral = "\\mu", mu_0, x_bar
        
        error_estandar = s / math.sqrt(n)
        stat_calc = (x_bar - mu_0) / error_estandar
        df = n - 1 # Grados de libertad
        dist = stats.t(df)
        stat_name = "T"
        
    else: # Test Z Clásico
        mu_0, x_bar, sigma = val["mu_0"], val["x_bar"], val["sigma"]
        param_simbolo, valor_hipotetico, valor_muestral = "\\mu", mu_0, x_bar
        
        error_estandar = sigma / math.sqrt(n)
        stat_calc = (x_bar - mu_0) / error_estandar
        dist = stats.norm
        stat_name = "Z"

    # Cálculos dependiendo de las colas utilizando scipy
    if "Dos Colas" in tipo_prueba:
        p_valor = 2 * (1 - dist.cdf(abs(stat_calc)))
        stat_critico = dist.ppf(1 - alpha/2)
        rechazo = abs(stat_calc) > stat_critico
        operador_h0, operador_h1 = "=", "\\neq"
    elif "Cola Derecha" in tipo_prueba:
        p_valor = 1 - dist.cdf(stat_calc)
        stat_critico = dist.ppf(1 - alpha)
        rechazo = stat_calc > stat_critico
        operador_h0, operador_h1 = "\\leq", ">"
    else: # Cola Izquierda
        p_valor = dist.cdf(stat_calc)
        stat_critico = dist.ppf(alpha)
        rechazo = stat_calc < stat_critico
        operador_h0, operador_h1 = "\\geq", "<"

    st.divider()
    
    tab1, tab2 = st.tabs(["⚖️ Veredicto del Test", "🔗 Dualidad con Intervalos de Confianza"])
    
    with tab1:
        st.subheader("Planteamiento y Veredicto")
        
        # Mostrar H0 y H1
        c_h1, c_h2 = st.columns(2)
        with c_h1:
            st.markdown("**Hipótesis Nula ($H_0$):**")
            st.latex(f"H_0: {param_simbolo} {operador_h0} {valor_hipotetico}")
        with c_h2:
            st.markdown("**Hipótesis Alternativa ($H_1$):**")
            st.latex(f"H_1: {param_simbolo} {operador_h1} {valor_hipotetico}")
            
        st.markdown(f"**1. Estadístico de Prueba (${stat_name}_{{calc}}$):** `{stat_calc:.3f}`")
        
        # Imprimir la fórmula correcta según el tipo de prueba
        if "Proporción" in tipo_parametro:
            st.latex(f"Z = \\frac{{\\hat{{p}} - p_0}}{{\\sqrt{{\\frac{{p_0(1-p_0)}}{{n}}}}}} = \\frac{{{p_hat} - {p_0}}}{{\\sqrt{{\\frac{{{p_0}({1-p_0})}}{{{n}}}}}}} = {stat_calc:.3f}")
        elif "Test T" in tipo_parametro:
            st.latex(f"T = \\frac{{\\bar{{x}} - \\mu_0}}{{s / \\sqrt{{n}}}} = \\frac{{{x_bar} - {mu_0}}}{{{s} / \\sqrt{{{n}}}}} = {stat_calc:.3f}")
        else:
            st.latex(f"Z = \\frac{{\\bar{{x}} - \\mu_0}}{{\\sigma / \\sqrt{{n}}}} = \\frac{{{x_bar} - {mu_0}}}{{{sigma} / \\sqrt{{{n}}}}} = {stat_calc:.3f}")
        
        st.markdown(f"**2. P-Valor:** `{p_valor:.4f}`")
        st.info("💡 **¿Qué es el P-Valor?** Es la probabilidad de haber obtenido una muestra tan extrema asumiendo que el Status Quo ($H_0$) es real. Si es menor que $\\alpha$, el Status Quo es insostenible.")
        
        # Conclusión
        if p_valor < alpha:
            st.error(f"🚨 **CONCLUSIÓN:** Como P-Valor ({p_valor:.4f}) < $\\alpha$ ({alpha}), **RECHAZAMOS $H_0$**.")
            st.markdown(f"Hay evidencia estadística suficiente para afirmar que el parámetro poblacional es {operador_h1.replace('\\neq', 'diferente de').replace('>', 'mayor que').replace('<', 'menor que')} {valor_hipotetico}.")
        else:
            st.success(f"✅ **CONCLUSIÓN:** Como P-Valor ({p_valor:.4f}) ≥ $\\alpha$ ({alpha}), **NO RECHAZAMOS $H_0$**.")
            st.markdown(f"La diferencia entre tu muestra ({valor_muestral}) y la hipótesis ({valor_hipotetico}) no es estadísticamente significativa; puede deberse simplemente al azar del muestreo.")

    with tab2:
        st.subheader("La Conexión con los Intervalos de Confianza")
        if "Dos Colas" in tipo_prueba:
            # Nota técnica: El intervalo de confianza para la proporción usa p_hat en el error estándar
            if "Proporción" in tipo_parametro:
                se_ic = math.sqrt((p_hat * (1 - p_hat)) / n)
            elif "Test T" in tipo_parametro:
                se_ic = s / math.sqrt(n)
            else:
                se_ic = sigma / math.sqrt(n)
                
            margen = stat_critico * se_ic
            ic_inf = valor_muestral - margen
            ic_sup = valor_muestral + margen
            
            st.markdown(f"Toda prueba de hipótesis de dos colas con nivel de significancia $\\alpha$ es matemáticamente equivalente a construir un Intervalo de Confianza al $(1-\\alpha)$%.")
            st.latex(f"IC_{{{(1-alpha)*100:.0f}\\%}} = [{ic_inf:.4f} \\ , \\ {ic_sup:.4f}]")
            
            if valor_hipotetico >= ic_inf and valor_hipotetico <= ic_sup:
                st.markdown(f"Como tu valor hipotético (${param_simbolo}_0 = {valor_hipotetico}$) **ESTÁ DENTRO** del rango de este intervalo, es un valor razonable y posible. Por lo tanto, **No podemos rechazar $H_0$**.")
            else:
                st.markdown(f"Como tu valor hipotético (${param_simbolo}_0 = {valor_hipotetico}$) **CAE AFUERA** de este intervalo, es altamente improbable que sea el verdadero valor. Por lo tanto, **Rechazamos $H_0$**.")
        else:
            st.warning("⚠️ La dualidad exacta y simétrica con los intervalos de confianza estándar se visualiza mejor en pruebas de Dos Colas. Estás usando una prueba de una sola cola.")
# ==========================================
# MÓDULO: CLASE 15 - PRUEBAS DE HIPÓTESIS AVANZADAS
# ==========================================
elif tema_seleccionado == "Clase 15":
    import math
    import scipy.stats as stats

    st.markdown("<h2><i class='fas fa-chart-bar' style='color:#00FFAA;'></i> Clase 15: Pruebas de Hipótesis</h2>", unsafe_allow_html=True)
    
    # 1. Selección del tipo de prueba
    tipo_parametro = st.selectbox("Selecciona la prueba a realizar:", [
        "Diferencia de Proporciones",
        "Una Varianza",
        "Cociente de Varianzas"
    ])
    
    # 2. Tipo de Prueba (Colas)
    tipo_prueba = st.radio("Tipo de Prueba (Cola):", [
        "Dos Colas (Diferente a: ≠)",
        "Cola Derecha (Mayor que: >)",
        "Cola Izquierda (Menor que: <)"
    ], horizontal=True)
    
    st.divider()
    st.markdown("**Ingresa los parámetros de la(s) muestra(s) y la hipótesis:**")
    
    col1, col2, col3 = st.columns(3)
    val = {}

    # --- ENTRADAS DINÁMICAS SEGÚN LA PRUEBA ---
    if tipo_parametro == "Diferencia de Proporciones":
        with col1:
            val["x1"] = st.number_input("Éxitos Muestra 1 (x₁)", value=45, step=1)
            val["n1"] = st.number_input("Tamaño Muestra 1 (n₁)", value=100, step=1)
        with col2:
            val["x2"] = st.number_input("Éxitos Muestra 2 (x₂)", value=30, step=1)
            val["n2"] = st.number_input("Tamaño Muestra 2 (n₂)", value=80, step=1)
        with col3:
            val["d0"] = st.number_input("Diferencia Hipotética (d₀)", value=0.0, step=0.01)
            val["alpha"] = st.number_input("Significancia (α)", value=0.05, step=0.01)

    elif tipo_parametro == "Una Varianza":
        with col1:
            val["n"] = st.number_input("Tamaño Muestral (n)", value=30, step=1)
        with col2:
            val["s2"] = st.number_input("Varianza Muestral (S²)", value=12.5, step=0.1)
        with col3:
            val["sigma2_0"] = st.number_input("Varianza Hipotética (σ²₀)", value=10.0, step=0.1)
            val["alpha"] = st.number_input("Significancia (α)", value=0.05, step=0.01)

    elif tipo_parametro == "Cociente de Varianzas":
        with col1:
            val["n1"] = st.number_input("Tamaño Muestra 1 (n₁)", value=25, step=1)
            val["s2_1"] = st.number_input("Varianza Muestral 1 (S²₁)", value=15.0, step=0.1)
        with col2:
            val["n2"] = st.number_input("Tamaño Muestra 2 (n₂)", value=20, step=1)
            val["s2_2"] = st.number_input("Varianza Muestral 2 (S²₂)", value=10.0, step=0.1)
        with col3:
            val["alpha"] = st.number_input("Significancia (α)", value=0.05, step=0.01)

    st.divider()
    
    alpha = val["alpha"]
    
    # Determinar operadores para H0 y H1
    if "Dos Colas" in tipo_prueba:
        operador_h0, operador_h1 = "=", "\\neq"
    elif "Cola Derecha" in tipo_prueba:
        operador_h0, operador_h1 = "\\leq", ">"
    else: 
        operador_h0, operador_h1 = "\\geq", "<"

    st.subheader("⚖️ Veredicto del Test")

    # --- MOTOR MATEMÁTICO Y RENDERIZADO ---
    if tipo_parametro == "Diferencia de Proporciones":
        x1, n1, x2, n2, d0 = val["x1"], val["n1"], val["x2"], val["n2"], val["d0"]
        
        p_hat1 = x1 / n1
        p_hat2 = x2 / n2
        p_star = (x1 + x2) / (n1 + n2)
        
        # Cálculo del estadístico Z_c
        numerador = (p_hat1 - p_hat2) - d0
        denominador = math.sqrt((p_star * (1 - p_star) / n1) + (p_star * (1 - p_star) / n2))
        stat_calc = numerador / denominador
        
        # P-Valor
        if "Dos Colas" in tipo_prueba:
            p_valor = 2 * (1 - stats.norm.cdf(abs(stat_calc)))
        elif "Cola Derecha" in tipo_prueba:
            p_valor = 1 - stats.norm.cdf(stat_calc)
        else:
            p_valor = stats.norm.cdf(stat_calc)

        # Planteamiento
        c1, c2 = st.columns(2)
        c1.markdown("**Hipótesis Nula ($H_0$):**")
        c1.latex(f"H_0: p_1 - p_2 {operador_h0} {d0}")
        c2.markdown("**Hipótesis Alternativa ($H_1$):**")
        c2.latex(f"H_1: p_1 - p_2 {operador_h1} {d0}")
        
        st.markdown("**Proporción agrupada ($p^*$):**")
        st.latex(f"p^* = \\frac{{{x1} + {x2}}}{{{n1} + {n2}}} = {p_star:.4f}")
        
        st.markdown(f"**1. Estadístico de Prueba ($Z_c$):**")
        st.latex(f"Z_c = \\frac{{(\\hat{{p}}_1 - \\hat{{p}}_2) - d_0}}{{\\sqrt{{\\frac{{p^*(1-p^*)}}{{n_1}} + \\frac{{p^*(1-p^*)}}{{n_2}}}}}} = {stat_calc:.4f}")

    elif tipo_parametro == "Una Varianza":
        n, s2, sigma2_0 = val["n"], val["s2"], val["sigma2_0"]
        df = n - 1
        
        # Cálculo del estadístico Chi-cuadrado
        stat_calc = (df * s2) / sigma2_0
        
        # P-Valor
        cdf_val = stats.chi2.cdf(stat_calc, df)
        if "Dos Colas" in tipo_prueba:
            p_valor = min(2 * cdf_val, 2 * (1 - cdf_val))
        elif "Cola Derecha" in tipo_prueba:
            p_valor = 1 - cdf_val
        else:
            p_valor = cdf_val

        # Planteamiento
        c1, c2 = st.columns(2)
        c1.markdown("**Hipótesis Nula ($H_0$):**")
        c1.latex(f"H_0: \\sigma^2 {operador_h0} {sigma2_0}")
        c2.markdown("**Hipótesis Alternativa ($H_1$):**")
        c2.latex(f"H_1: \\sigma^2 {operador_h1} {sigma2_0}")
        
        st.markdown(f"**1. Estadístico de Prueba ($\\chi^2_c$):**")
        st.latex(f"\\chi^2_c = \\frac{{({n}-1){s2}}}{{{sigma2_0}}} = {stat_calc:.4f}")

    elif tipo_parametro == "Cociente de Varianzas":
        n1, s2_1, n2, s2_2 = val["n1"], val["s2_1"], val["n2"], val["s2_2"]
        df1 = n1 - 1
        df2 = n2 - 1
        
        # Cálculo del estadístico F
        stat_calc = s2_1 / s2_2
        
        # P-Valor
        cdf_val = stats.f.cdf(stat_calc, df1, df2)
        if "Dos Colas" in tipo_prueba:
            p_valor = min(2 * cdf_val, 2 * (1 - cdf_val))
        elif "Cola Derecha" in tipo_prueba:
            p_valor = 1 - cdf_val
        else:
            p_valor = cdf_val

        # Planteamiento
        c1, c2 = st.columns(2)
        c1.markdown("**Hipótesis Nula ($H_0$):**")
        c1.latex(f"H_0: \\sigma_1^2 {operador_h0} \\sigma_2^2")
        c2.markdown("**Hipótesis Alternativa ($H_1$):**")
        c2.latex(f"H_1: \\sigma_1^2 {operador_h1} \\sigma_2^2")
        
        st.markdown(f"**1. Estadístico de Prueba ($F_c$):**")
        st.latex(f"F_c = \\frac{{{s2_1}}}{{{s2_2}}} = {stat_calc:.4f}")

    # --- CONCLUSIÓN GENERAL ---
    st.markdown(f"**2. P-Valor:** `{p_valor:.4f}`")
    
    if p_valor < alpha:
        st.error(f"🚨 **CONCLUSIÓN:** Como P-Valor ({p_valor:.4f}) < $\\alpha$ ({alpha}), **RECHAZAMOS $H_0$**.")
    else:
        st.success(f"✅ **CONCLUSIÓN:** Como P-Valor ({p_valor:.4f}) ≥ $\\alpha$ ({alpha}), **NO RECHAZAMOS $H_0$**.")
# ==========================================
# MODULO 11: TEORÍA DE JUEGOS - EQUILIBRIOS PURAS
# ==========================================
elif tema_seleccionado == "Equilibrios de Nash (Puras)":
    st.markdown("<h2><i class='fas fa-bullseye' style='color:#00FFAA;'></i> Nash en Estrategias Puras</h2>", unsafe_allow_html=True)
    st.markdown("Selecciona el tamaño de la matriz. Ingresa los pagos directamente en las tablas estilo Excel para calcular las Mejores Respuestas.")
    
    # 1. Selectores de dimensión
    c_dim1, c_dim2 = st.columns(2)
    filas = c_dim1.number_input("Número de Estrategias Jugador 1 (Filas)", min_value=2, max_value=5, value=2)
    columnas = c_dim2.number_input("Número de Estrategias Jugador 2 (Columnas)", min_value=2, max_value=5, value=2)

    st.divider()
    
    # 2. Creación de DataFrames editables
    c_m1, c_m2 = st.columns(2)
    with c_m1:
        st.markdown("<h4 style='color:#00FFAA;'>Pagos Jugador 1</h4>", unsafe_allow_html=True)
        df_j1 = pd.DataFrame(0.0, index=[f"F{i+1}" for i in range(filas)], columns=[f"C{j+1}" for j in range(columnas)])
        pagos_j1 = st.data_editor(df_j1, key="editor_j1", use_container_width=True)
        
    with c_m2:
        st.markdown("<h4 style='color:#00FFAA;'>Pagos Jugador 2</h4>", unsafe_allow_html=True)
        df_j2 = pd.DataFrame(0.0, index=[f"F{i+1}" for i in range(filas)], columns=[f"C{j+1}" for j in range(columnas)])
        pagos_j2 = st.data_editor(df_j2, key="editor_j2", use_container_width=True)

    # 3. Motor de Cálculo de Equilibrio de Nash (N x M)
    equilibrios = []
    
    for i in range(filas):
        for j in range(columnas):
            pago_actual_j1 = pagos_j1.iloc[i, j]
            pago_actual_j2 = pagos_j2.iloc[i, j]
            
            # ¿Es Mejor Respuesta para J1?
            max_j1_columna = pagos_j1.iloc[:, j].max()
            es_br1 = (pago_actual_j1 == max_j1_columna)
            
            # ¿Es Mejor Respuesta para J2?
            max_j2_fila = pagos_j2.iloc[i, :].max()
            es_br2 = (pago_actual_j2 == max_j2_fila)
            
            if es_br1 and es_br2:
                nombre_fila = pagos_j1.index[i]
                nombre_col = pagos_j1.columns[j]
                equilibrios.append(f"{nombre_fila}, {nombre_col}")

    st.divider()
    
    # 4. Resultados
    st.subheader("🎯 Veredicto del Análisis")
    if len(equilibrios) > 0:
        st.success(f"Se encontraron **{len(equilibrios)}** Equilibrio(s) de Nash en Estrategias Puras:")
        for eq in equilibrios:
            st.markdown(f"### 📍 Perfil: ({eq})")
    else:
        st.error("🚨 No se encontraron Equilibrios de Nash en Estrategias Puras. Este juego requiere un análisis de Estrategias Mixtas.")

# ==========================================
# MÓDULO 12: TEORÍA DE JUEGOS - ESTRATEGIAS MIXTAS (2x2)
# ==========================================
elif tema_seleccionado == "Estrategias Mixtas (Cálculo p y q)":
    st.markdown("<h2><i class='fas fa-dice' style='color:#00FFAA;'></i> Estrategias Mixtas (2x2)</h2>", unsafe_allow_html=True)
    st.info("💡 **Nota:** El cálculo algebraico de probabilidades exactas ($p$ y $q$) se aplica a juegos 2x2. Si tienes una matriz mayor, primero debes aplicar Eliminación Iterada de Estrategias Dominadas.")
    
    col_in1, col_in2 = st.columns(2)
    val = {}
    with col_in1:
        st.markdown("### Jugador 1 (Filas)")
        val["u11"] = st.number_input("Pago J1 (Arriba, Izq)", value=3.0, step=1.0)
        val["u12"] = st.number_input("Pago J1 (Arriba, Der)", value=0.0, step=1.0)
        val["u21"] = st.number_input("Pago J1 (Abajo, Izq)", value=0.0, step=1.0)
        val["u22"] = st.number_input("Pago J1 (Abajo, Der)", value=1.0, step=1.0)
    with col_in2:
        st.markdown("### Jugador 2 (Columnas)")
        val["v11"] = st.number_input("Pago J2 (Arriba, Izq)", value=2.0, step=1.0)
        val["v12"] = st.number_input("Pago J2 (Arriba, Der)", value=1.0, step=1.0)
        val["v21"] = st.number_input("Pago J2 (Abajo, Izq)", value=0.0, step=1.0)
        val["v22"] = st.number_input("Pago J2 (Abajo, Der)", value=3.0, step=1.0)

    # Lógica de indiferencia
    den_p = (val["v11"] - val["v21"] - val["v12"] + val["v22"])
    den_q = (val["u11"] - val["u12"] - val["u21"] + val["u22"])

    if den_p != 0 and den_q != 0:
        p_star = (val["v22"] - val["v12"]) / den_p
        q_star = (val["u22"] - val["u12"]) / den_q
        
        # Validar que las probabilidades existan lógicamente (entre 0 y 1)
        if 0 <= p_star <= 1 and 0 <= q_star <= 1:
            st.divider()
            c1, c2 = st.columns(2)
            with c1:
                st.metric("p* (Probabilidad J1 - Arriba)", f"{p_star:.4f}")
                st.latex(f"p = \\frac{{v_{{22}} - v_{{12}}}}{{(v_{{11}} - v_{{21}}) - (v_{{12}} - v_{{22}})}}")
            with c2:
                st.metric("q* (Probabilidad J2 - Izquierda)", f"{q_star:.4f}")
                st.latex(f"q = \\frac{{u_{{22}} - u_{{12}}}}{{(u_{{11}} - u_{{21}}) - (u_{{12}} - u_{{22}})}}")
            
            st.success(f"Para el equilibrio, **J1** juega Arriba el **{p_star*100:.1f}%** de las veces, y **J2** juega Izquierda el **{q_star*100:.1f}%** de las veces.")
        else:
            st.warning("⚠️ Las fórmulas arrojaron probabilidades fuera del rango [0, 1]. Esto significa que uno de los jugadores tiene una **Estrategia Estrictamente Dominante** y el equilibrio se encuentra en Puras, no en Mixtas.")
    else:
        st.error("🚨 Los pagos ingresados generan una división por cero. El juego es completamente simétrico sin incentivo a desviar, o existe dominancia estricta.")
# ==========================================
# MÓDULO 13: TEORÍA DE JUEGOS - FORMA EXTENSIVA (ÁRBOL)
# ==========================================
elif tema_seleccionado == "Forma Extensiva y Dominancia":
    st.markdown("<h2><i class='fas fa-sitemap' style='color:#00FFAA;'></i> Forma Extensiva y Dominancia</h2>", unsafe_allow_html=True)
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
# TEORÍA DE JUEGOS - ARBITRAJE DE OFERTA FINAL
# ==========================================
elif tema_seleccionado == "Arbitraje de Oferta Final":
    st.markdown("<h2><i class='fas fa-balance-scale' style='color:#1E3A8A;'></i> Arbitraje de Oferta Final (Farber, 1980)</h2>", unsafe_allow_html=True)
    
    tab_teoria, tab_simulador = st.tabs(["📚 Teoría e Intuición", "🧮 Laboratorio y Desglose Matemático"])
    
    with tab_teoria:
        st.markdown("### El Dilema del Negociador")
        st.info("💡 **Compensación (Trade-off):** Una oferta más agresiva (muy baja por la empresa o muy alta por los trabajadores) produce una mejor recompensa si el árbitro la elige, pero es menos probable que sea elegida.")
        
        c_t1, c_t2 = st.columns(2)
        with c_t1:
            st.markdown("**Reglas del Juego:**")
            st.markdown("- La Empresa ($f$) y el Sindicato ($g$) proponen salarios $w_f$ y $w_g$.")
            st.markdown("- El árbitro tiene en mente un salario justo $x$, pero es un secreto. Solo sabemos que se distribuye normal: $x \sim N(m, \sigma^2)$.")
            st.markdown("- El árbitro elige mecánicamente la oferta que esté más cerca de $x$.")
        with c_t2:
            st.markdown("**El Papel de la Incertidumbre ($\\sigma$):**")
            st.markdown("- Si $\\sigma$ es bajo (poca incertidumbre), todos saben qué quiere el árbitro. Las partes no pueden desviarse mucho de la media $m$ o perderán.")
            st.markdown("- Si $\\sigma$ es alto, la ignorancia permite a las partes arriesgarse con ofertas agresivas.")

    with tab_simulador:
        st.subheader("Simulador de Equilibrio de Nash")
        tema = datos["teoria_juegos"]["arbitraje_oferta"]
        
        with st.container(border=True):
            col_in1, col_in2 = st.columns(2)
            m_val = col_in1.number_input(tema["variables"]["m"]["nombre"], value=float(tema["variables"]["m"]["valor_defecto"]), step=50.0)
            sigma_val = col_in2.number_input(tema["variables"]["sigma"]["nombre"], value=float(tema["variables"]["sigma"]["valor_defecto"]), step=10.0, min_value=1.0)
            col_in1.caption(tema["variables"]["m"]["ayuda_real"])
            col_in2.caption(tema["variables"]["sigma"]["ayuda_real"])

        # Cálculos del Equilibrio
        # wg* = m + sqrt((pi * sigma^2) / 2)
        # wf* = m - sqrt((pi * sigma^2) / 2)
        distancia = np.sqrt((np.pi * sigma_val**2) / 2)
        w_f = m_val - distancia
        w_g = m_val + distancia

        st.divider()
        col_res1, col_res2 = st.columns([1, 1.5])
        
        with col_res1:
            st.markdown("### Ofertas Óptimas (Nash)")
            st.success(f"**Oferta Sindicato ($w_g^*$):** ${w_g:,.2f}")
            st.error(f"**Oferta Empresa ($w_f^*$):** ${w_f:,.2f}")
            st.metric("Brecha Salarial", f"${(w_g - w_f):,.2f}")
            
        with col_res2:
            st.markdown("**Distribución de Probabilidad del Árbitro**")
            # Graficar la campana de Gauss
            x_axis = np.linspace(m_val - 4*sigma_val, m_val + 4*sigma_val, 200)
            # Función de densidad Normal manual
            pdf = (1 / (sigma_val * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x_axis - m_val) / sigma_val)**2)
            
            df_plot = pd.DataFrame({"Salario Ideal del Árbitro (x)": x_axis, "Probabilidad": pdf}).set_index("Salario Ideal del Árbitro (x)")
            st.line_chart(df_plot, color="#2563EB")
            st.caption("Los extremos de la campana representan dónde terminan ubicándose $w_f^*$ y $w_g^*$. ¡Juega con la Incertidumbre (σ) para ver cómo se ensancha la brecha!")

        # ==========================================
        # CARPINTERÍA MATEMÁTICA (PAYWALL)
        # ==========================================
        st.divider()
        st.subheader("🛠️ Carpintería Matemática (Desglose del Parcial)")
        
        if tipo_cuenta == "Básica (Gratis)":
            st.markdown("""
            <div style="background-color: #FEF2F2; border-left: 5px solid #EF4444; padding: 15px; border-radius: 5px;">
                <h4 style="color: #B91C1C; margin-top: 0;">🔒 Contenido Premium</h4>
                <p>El desarrollo de las Condiciones de Primer Orden (CPO), la igualación de densidades y el despeje algebraico del equilibrio de Farber están bloqueados.</p>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown("""
            <div style="background-color: #F0FDF4; border-left: 5px solid #10B981; padding: 15px; border-radius: 5px;">
                <h4 style="color: #047857; margin-top: 0;">🔓 Acceso Premium: Análisis Analítico</h4>
            </div>
            """, unsafe_allow_html=True)
            
            st.markdown("**1. Función Objetivo de la Empresa:**")
            st.markdown("La empresa quiere minimizar el salario esperado. El árbitro elige la oferta de la empresa ($w_f$) si su ideal cae a la izquierda del punto medio, probabilidad que es $F(\\frac{w_f + w_g}{2})$:")
            st.latex(r"\min_{w_f} \{ w_f F\left(\frac{w_f + w_g}{2}\right) + w_g \left[1 - F\left(\frac{w_f + w_g}{2}\right)\right] \}")
            
            st.markdown("**2. Condición de Primer Orden (CPO) Empresa:**")
            st.markdown("Derivando respecto a $w_f$ y usando la regla de la cadena (donde $F'$ es la densidad $f$):")
            st.latex(r"(w_g^* - w_f^*) \frac{1}{2} f\left(\frac{w_f^* + w_g^*}{2}\right) = F\left(\frac{w_f^* + w_g^*}{2}\right) \quad \text{--- (Ec. 1)}")
            
            st.markdown("**3. Condición de Primer Orden (CPO) Sindicato:**")
            st.markdown("El sindicato maximiza su pago esperado. Siguiendo el mismo proceso de derivación:")
            st.latex(r"(w_g^* - w_f^*) \frac{1}{2} f\left(\frac{w_f^* + w_g^*}{2}\right) = \left[1 - F\left(\frac{w_f^* + w_g^*}{2}\right)\right] \quad \text{--- (Ec. 2)}")
            
            st.markdown("**4. Igualación de Probabilidades:**")
            st.markdown("Como el lado izquierdo de ambas ecuaciones es idéntico, sus lados derechos deben ser iguales:")
            st.latex(r"F\left(\frac{w_f^* + w_g^*}{2}\right) = 1 - F\left(\frac{w_f^* + w_g^*}{2}\right) \implies F\left(\frac{w_f^* + w_g^*}{2}\right) = \frac{1}{2}")
            st.markdown("Esto significa que el promedio de las ofertas debe caer exactamente en la mediana de la distribución. Al ser una Normal, la mediana es la media $m$:")
            st.latex(r"\frac{w_f^* + w_g^*}{2} = m")
            
            st.markdown("**5. Despeje de la Brecha:**")
            st.markdown("Sustituyendo el resultado en la Ec. 1, sabiendo que $F(m) = 1/2$:")
            st.latex(r"(w_g^* - w_f^*) = \frac{1}{f(m)}")
            st.markdown("En una Normal, el punto más alto de la campana es $f(m) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}}$. Al sacar el recíproco y despejar, llegamos a las ofertas finales:")
            st.latex(r"w_g^* = m + \sqrt{\frac{\pi \sigma^2}{2}} \quad ; \quad w_f^* = m - \sqrt{\frac{\pi \sigma^2}{2}}")
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
# ==========================================
# MÓDULO: MICROFUNDAMENTOS Y EQUILIBRIO GENERAL
# ==========================================
elif tema_seleccionado == "Microfundamentos: El Problema de la Firma":
    st.markdown("<h2><i class='fas fa-industry' style='color:#1E3A8A;'></i> Microfundamentos: De la Firma al Mercado</h2>", unsafe_allow_html=True)
    tema = datos["macroeconomia_1"]["microfundamentos"]
    
    st.subheader("⚙️ Panel de Control del Modelo")
    st.info("💡 **Consejo:** Ajusta la tecnología y el salario para ver cómo cambia el equilibrio. En Colombia, una productividad ($z$) de 15,000 COP/h es un punto de partida realista para servicios.")
    
    # NUEVO: Formulario principal visible
    with st.expander("📐 Fórmulas Principales del Modelo (Resumen)"):
        st.markdown("Estas son las ecuaciones que gobiernan el simulador. Al cambiar los valores arriba, estas fórmulas se recalculan automáticamente en las pestañas de abajo.")
        st.latex(r"\text{Firma (Demanda): } N^d = \left( \frac{(1-\alpha) z K^\alpha}{w} \right)^{\frac{1}{\alpha}}")
        st.latex(r"\text{Hogar (Oferta): } N^s = \frac{1}{1+\gamma} h")
        st.latex(r"\text{Equilibrio: } w^* = (1-\alpha) z K^\alpha \left( \frac{1+\gamma}{h} \right)^\alpha")

    col_input1, col_input2 = st.columns(2)
    v = {}

    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        # Lógica para identificar a quién afecta cada variable
        if simbolo in ["z", "alpha", "K"]:
            afecta = "🏭 La Firma (Mueve la curva de Demanda) y ⚖️ El Equilibrio."
        elif simbolo in ["h", "gamma"]:
            afecta = "🏠 El Hogar (Mueve la curva de Oferta) y ⚖️ El Equilibrio."
        elif simbolo == "w":
            afecta = "🏭 Firma y 🏠 Hogar (No cambia el equilibrio, pero define si hay Desempleo o Vacantes)."
        else:
            afecta = "General"

        with col_input1 if i % 2 == 0 else col_input2:
            with st.container(border=True):
                paso_v = 0.01 if simbolo in ["alpha", "gamma"] else 500.0
                v[simbolo] = st.number_input(
                    f"{info['nombre']}", 
                    value=float(info['valor_defecto']), 
                    step=paso_v, 
                    key=f"micro_input_{simbolo}"
                )
                # Tooltip mejorado con impacto
                with st.expander("📖 Contexto Económico e Impacto"):
                    st.markdown(info['ayuda_real'])
                    st.caption(f"**🎯 Impacto en el Modelo:** {afecta}")

    # --- MOTOR MATEMÁTICO (Ecuaciones de Wilman Gómez) ---
    nd_optimo = (((1 - v["alpha"]) * v["z"] * (v["K"]**v["alpha"])) / v["w"])**(1 / v["alpha"])
    produccion = v["z"] * (v["K"]**v["alpha"]) * (nd_optimo**(1 - v["alpha"]))
    l_optimo = (v["gamma"] / (1 + v["gamma"])) * v["h"]
    ns_optimo = v["h"] - l_optimo
    w_equilibrio = (1 - v["alpha"]) * v["z"] * (v["K"]**v["alpha"]) * ((1 + v["gamma"]) / v["h"])**v["alpha"]

    st.divider()
    
    tab_firma, tab_hogar, tab_equilibrio = st.tabs([
        "🏭 La Firma (Demanda)", 
        "🏠 El Hogar (Oferta)", 
        "⚖️ Equilibrio de Mercado"
    ])

    # 1. PESTAÑA DE LA FIRMA
    with tab_firma:
        st.subheader("La Firma: Maximizadora de Beneficios")
        
        c_f1, c_f2 = st.columns([1, 1.2])
        with c_f1:
            st.metric("Demanda de Trabajo ($N^d$)", f"{nd_optimo:,.2f} h")
            st.metric("Producción ($Y$)", f"{produccion:,.2f} unidades")
        
        with c_f2:
            # Gráfica PMgN
            w_plot = np.linspace(v["w"]*0.5, v["w"]*2.5, 50)
            nd_plot = (((1 - v["alpha"]) * v["z"] * (v["K"]**v["alpha"])) / w_plot)**(1 / v["alpha"])
            st.line_chart(pd.DataFrame({"Salario (w)": w_plot, "Demanda (Nd)": nd_plot}).set_index("Salario (w)"), color="#2563EB")

        with st.expander("📝 Carpintería Paso a Paso: Demanda de Trabajo"):
            st.markdown("**Paso 1: Plantear la Función de Beneficios ($\pi$)**")
            st.markdown("La firma busca maximizar la diferencia entre sus ingresos (producción) y sus costos (salarios).")
            st.latex(r"\max_{N} \pi = z K^\alpha N^{1-\alpha} - wN")
            
            st.markdown("**Paso 2: Condición de Primer Orden (CPO)**")
            st.markdown("Derivamos $\pi$ respecto al trabajo ($N$) usando la regla de la potencia y lo igualamos a cero para encontrar el máximo:")
            st.latex(r"\frac{\partial \pi}{\partial N} = (1-\alpha) z K^\alpha N^{-\alpha} - w = 0")
            
            st.markdown("**Paso 3: Producto Marginal = Costo Marginal**")
            st.latex(r"(1-\alpha) z K^\alpha N^{-\alpha} = w")
            
            st.markdown("**Paso 4: Despeje Algebraico de $N$**")
            st.markdown("Pasamos $w$ a dividir y el término $N^{-\alpha}$ al lado derecho como $N^\alpha$:")
            st.latex(r"N^\alpha = \frac{(1-\alpha) z K^\alpha}{w}")
            st.markdown("Elevamos ambos lados a la potencia $\frac{1}{\alpha}$ para despejar $N$:")
            st.latex(r"N^d = \left( \frac{(1-\alpha) z K^\alpha}{w} \right)^{\frac{1}{\alpha}}")
            
            st.markdown("**Paso 5: Sustitución Numérica**")
            const_f = (1 - v["alpha"]) * v["z"] * (v["K"]**v["alpha"])
            st.latex(rf"N^d = \left( \frac{{{const_f:,.2f}}}{{{v['w']}}} \right)^{{\frac{{1}}{{{v['alpha']}}}}} = {nd_optimo:,.2f} \text{{ horas}}")
        with st.expander("📝 Carpintería: Inversión Óptima y Demanda de Trabajo"):
            st.markdown("**1. Valor Presente de la Firma ($V$)**")
            st.latex(r"V = Y_1 - I_1 - w_1 N_1 + \frac{Y_2 - I_2 - w_2 N_2}{1+r}")
            st.markdown("Sabiendo que $I_1 = K_2 - (1-\delta)K_1$")
            
            st.markdown("**2. Condición de Primer Orden para el Capital**")
            st.markdown("Derivamos $V$ respecto al capital futuro $K_2$ e igualamos a cero:")
            st.latex(r"\frac{\partial V}{\partial K_2} = -1 + \frac{1}{1+r} \left( \frac{\partial Y_2}{\partial K_2} + (1-\delta) \right) = 0")
            
            st.markdown("**3. Regla de Inversión Óptima**")
            st.markdown("El producto marginal del capital de mañana debe igualar el costo de uso del capital:")
            st.latex(r"PMgK_2 = r + \delta")
            
            st.markdown("**4. Demanda de Trabajo Dinámica**")
            st.markdown("La firma sigue contratando hasta que la productividad marginal del trabajo iguale al salario en cada período:")
            st.latex(r"PMgN_1 = w_1 \quad \text{y} \quad PMgN_2 = w_2")
    # 2. PESTAÑA DEL HOGAR
    with tab_hogar:
        st.subheader("El Hogar: Decisión Trabajo vs. Ocio")
        
        c_h1, c_h2 = st.columns([1, 1.2])
        with c_h1:
            st.metric("Oferta Laboral ($N^s$)", f"{ns_optimo:,.2f} h")
            st.metric("Tiempo de Ocio ($l^*$)", f"{l_optimo:,.2f} h")
        
        with c_h2:
            # Gráfica de Indiferencia
            l_axis = np.linspace(0.1, v["h"], 100)
            util_opt = np.log(max(0.1, v["w"]*ns_optimo)) + v["gamma"]*np.log(max(0.1, l_optimo))
            c_indif = np.exp(util_opt) / (l_axis**v["gamma"])
            c_rest = v["w"] * (v["h"] - l_axis)
            st.line_chart(pd.DataFrame({"Ocio (l)": l_axis, "Indiferencia": c_indif, "Restricción": c_rest}).set_index("Ocio (l)").clip(upper=v["w"]*v["h"]), color=["#9CA3AF", "#10B981"])

        with st.expander("📝 Carpintería Paso a Paso: Oferta de Trabajo"):
            st.markdown("**Paso 1: Plantear el Problema del Consumidor**")
            st.markdown("El hogar maximiza su utilidad. Para evitar un Lagrangiano complejo, sustituimos directamente el consumo ($C$) por su restricción presupuestaria ($C = w(h-l)$):")
            st.latex(r"\max_{l} U = \ln(w(h - l)) + \gamma \ln(l)")
            
            st.markdown("**Paso 2: Condición de Primer Orden (CPO)**")
            st.markdown("Derivamos respecto al ocio ($l$) e igualamos a cero, usando la regla de la cadena para el logaritmo:")
            st.latex(r"\frac{\partial U}{\partial l} = \frac{1}{w(h - l)} \cdot (-w) + \frac{\gamma}{l} = 0")
            
            st.markdown("**Paso 3: Simplificación de Fracciones**")
            st.markdown("El salario $w$ se cancela en la primera fracción. Pasamos la fracción negativa al otro lado:")
            st.latex(r"-\frac{1}{h - l} + \frac{\gamma}{l} = 0 \quad \implies \quad \frac{\gamma}{l} = \frac{1}{h - l}")
            
            st.markdown("**Paso 4: Multiplicación en Cruz y Despeje del Ocio ($l^*$)**")
            st.latex(r"\gamma (h - l) = l \quad \implies \quad \gamma h - \gamma l = l")
            st.latex(r"\gamma h = l(1 + \gamma) \quad \implies \quad l^* = \frac{\gamma}{1+\gamma} h")
            
            st.markdown("**Paso 5: Calcular la Oferta Laboral ($N^s$)**")
            st.markdown("Como el tiempo se divide en trabajo y ocio ($N^s = h - l^*$):")
            st.latex(r"N^s = h - \frac{\gamma}{1+\gamma} h = \frac{1}{1+\gamma} h")
            
            st.markdown("**Paso 6: Sustitución Numérica**")
            st.latex(rf"l^* = \frac{{{v['gamma']}}}{{1 + {v['gamma']}}} \cdot {v['h']} = {l_optimo:,.1f} \text{{ horas}}")
            st.latex(rf"N^s = {v['h']} - {l_optimo:,.1f} = {ns_optimo:,.2f} \text{{ horas}}")
        with st.expander("📝 Carpintería: Utilidad Intertemporal y Oferta Laboral"):
            st.markdown("**1. Función de Utilidad Intertemporal**")
            st.latex(r"U = \ln(C_1) + \gamma \ln(l_1) + \beta [\ln(C_2) + \gamma \ln(l_2)]")
            
            st.markdown("**2. Restricción Presupuestaria Intertemporal**")
            st.latex(r"C_1 + \frac{C_2}{1+r} = w_1(1-l_1) + \pi_1 - T_1 + \frac{w_2(1-l_2) + \pi_2 - T_2}{1+r}")
            
            st.markdown("**3. Condiciones de Primer Orden**")
            st.markdown("De aquí nacen tres grandes reglas económicas:")
            st.latex(r"\text{Ecuación de Euler: } \frac{C_2}{C_1} = \beta (1+r)")
            st.latex(r"\text{Trade-off Ocio-Consumo Hoy: } \frac{\gamma C_1}{l_1} = w_1")
            
            st.markdown("**4. Efecto de la Tasa de Interés**")
            st.info("💡 **Análisis:** Si la tasa de interés ($r$) sube, la ecuación de Euler dice que el consumo futuro ($C_2$) debe ser mayor al presente ($C_1$). Para lograrlo, la familia decide sacrificar ocio hoy (ofrece más $N^s$) para ahorrar ese dinero a la alta tasa de interés y disfrutar mañana.")

    # 3. PESTAÑA DEL EQUILIBRIO
    with tab_equilibrio:
        st.subheader("Equilibrio General Laboral")
        
        # Gráfica de Equilibrio
        w_eq_axis = np.linspace(w_equilibrio*0.4, w_equilibrio*1.6, 50)
        d_eq = (((1 - v["alpha"]) * v["z"] * (v["K"]**v["alpha"])) / w_eq_axis)**(1 / v["alpha"])
        s_eq = [ns_optimo] * len(w_eq_axis)
        st.line_chart(pd.DataFrame({"Salario": w_eq_axis, "Demanda": d_eq, "Oferta": s_eq}).set_index("Salario"), color=["#2563EB", "#10B981"])
        
        

        with st.expander("📝 Carpintería Paso a Paso: Salario de Equilibrio"):
            st.markdown("**Paso 1: Condición de Vaciado del Mercado**")
            st.markdown("Igualamos la Demanda de la Firma ($N^d$) con la Oferta del Hogar ($N^s$):")
            st.latex(r"N^d = N^s")
            st.latex(r"\left( \frac{(1-\alpha) z K^\alpha}{w^*} \right)^{\frac{1}{\alpha}} = \frac{1}{1+\gamma} h")
            
            st.markdown("**Paso 2: Eliminar el Exponente Fraccionario**")
            st.markdown("Elevamos ambos lados a la potencia $\alpha$ para destruir el exponente del lado izquierdo:")
            st.latex(r"\frac{(1-\alpha) z K^\alpha}{w^*} = \left( \frac{1}{1+\gamma} h \right)^\alpha")
            
            st.markdown("**Paso 3: Aislar el Salario ($w^*$)**")
            st.markdown("Intercambiamos posiciones: pasamos $w^*$ a multiplicar a la derecha y el término de la derecha a dividir:")
            st.latex(r"w^* = \frac{(1-\alpha) z K^\alpha}{\left( \frac{1}{1+\gamma} h \right)^\alpha}")
            st.markdown("Aplicando propiedades de fracciones, el denominador invertido sube a multiplicar:")
            st.latex(r"w^* = (1-\alpha) z K^\alpha \left( \frac{1+\gamma}{h} \right)^\alpha")
            
            st.markdown("**Paso 4: Sustitución Numérica**")
            termino_1 = (1 - v["alpha"]) * v["z"] * (v["K"]**v["alpha"])
            termino_2 = ((1 + v["gamma"]) / v["h"])**v["alpha"]
            st.latex(rf"w^* = {termino_1:,.2f} \cdot {termino_2:,.5f}")
            st.latex(rf"w^* = {w_equilibrio:,.2f} \text{{ COP/hora}}")
        with st.expander("📝 Carpintería: Distorsión Fiscal"):
            st.markdown("**El efecto de un impuesto al salario ($\tau$)**")
            st.markdown("Si el gobierno cobra un impuesto al trabajo, la familia ya no recibe $w$, sino $w(1-\tau)$. Su nueva condición de ocio-consumo es:")
            st.latex(r"\frac{\gamma C_1}{l_1} = w_1(1-\tau)")
            
            st.error("📉 **Conclusión de Política:** El impuesto hace que el costo de oportunidad de descansar sea menor (ganas menos por trabajar). La familia decide descansar más, lo que contrae la Oferta Laboral ($N^s$), reduce la producción ($Y$) y genera una ineficiencia en la economía de Medellín.")
        # Diagnóstico
        if abs(v["w"] - w_equilibrio) < 100:
            st.success("⚖️ **Estado:** El mercado está en equilibrio.")
        elif v["w"] > w_equilibrio:
            st.error(f"⚠️ **Estado:** El salario actual (${v['w']:,.0f}) genera Desempleo (Exceso de Oferta de {ns_optimo - nd_optimo:,.1f} horas).")
        else:
            st.warning(f"⚠️ **Estado:** El salario actual (${v['w']:,.0f}) genera Vacantes (Exceso de Demanda de {nd_optimo - ns_optimo:,.1f} horas).")

    # INTERPRETACIÓN GLOBAL
    st.divider()
    st.subheader("🧐 Interpretación para el Analista")
    c1, c2 = st.columns(2)
    c1.info(f"**Sobre la Firma:** Para que la empresa sea competitiva con salarios de (${v['w']:,.0f}), su tecnología z debe ser lo suficientemente alta para que la productividad marginal supere el costo.")
    c2.info(f"**Sobre el Hogar:** Dado que la preferencia por el ocio es {v['gamma']}, la familia dedica el {l_optimo/v['h']*100:.1f}% de su tiempo total al descanso.")
# ==========================================
# MÓDULO: EQUILIBRIO GENERAL DINÁMICO (2 PERIODOS)
# ==========================================
elif tema_seleccionado == "Equilibrio General Dinámico":
    st.markdown("<h2><i class='fas fa-project-diagram' style='color:#1E3A8A;'></i> Equilibrio Dinámico y Fricciones</h2>", unsafe_allow_html=True)
    tema = datos["macroeconomia_1"]["equilibrio_dinamico"]
    
    st.subheader("⚙️ Panel de Control Intertemporal")
    st.info("💡 **Análisis de 2 Períodos:** En este modelo (Capítulo 5), las decisiones de hoy dependen de lo que esperamos mañana. La Tasa de Interés ($r$) es el puente entre ambos tiempos.")

    col_in1, col_in2 = st.columns(2)
    v = {}

    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        # Rastreador de impacto pedagógico
        if simbolo in ["z1", "z2", "K1", "delta"]: 
            impacto = "🏭 Afecta la Inversión y Demanda de la Firma."
        elif simbolo in ["beta", "gamma", "r"]: 
            impacto = "🏠 Afecta el Ahorro y la Oferta del Hogar."
        else: 
            impacto = "🏛️ Genera ineficiencia en el mercado laboral."

        with col_in1 if i % 2 == 0 else col_in2:
            with st.container(border=True):
                paso_v = 0.01 if simbolo in ["delta", "r", "beta", "gamma", "tau", "alpha"] else 500.0
                v[simbolo] = st.number_input(
                    f"{info['nombre']}", 
                    value=float(info['valor_defecto']), 
                    step=paso_v, 
                    key=f"dyn_input_{simbolo}"
                )
                with st.expander("📖 Contexto e Impacto"):
                    st.markdown(info['ayuda_real'])
                    st.caption(f"**🎯 Variable clave en:** {impacto}")

    # --- MOTOR MATEMÁTICO (Alineado con Notas de Wilman Gómez) ---
    alpha = 0.35 # Parámetro tecnológico estándar
    # 1. Inversión Óptima (K2 tal que PMgK2 = r + delta)
    # PMgK2 = alpha * z2 * K2^(alpha-1) * N2^(1-alpha) -> Asumiendo N2=1 para despeje simple
    k2_optimo = ( (alpha * v["z2"]) / (v["r"] + v["delta"]) )**(1 / (1 - alpha))
    inversion = k2_optimo - (1 - v["delta"]) * v["K1"]
    
    # 2. Equilibrio Laboral Hoy (w1*)
    w1_equilibrio = (1 - alpha) * v["z1"] * (v["K1"]**alpha) * ((1 + v["gamma"]) / v["h"])**alpha
    ns_hoy = v["h"] / (1 + v["gamma"])
    
    # 3. Ecuación de Euler (Relación de consumo)
    ratio_euler = v["beta"] * (1 + v["r"])

    st.divider()
    
    tab_inv, tab_euler, tab_friccion = st.tabs([
        "📈 1. Inversión (Firma)", 
        "⏳ 2. Euler (Hogar)", 
        "🏛️ 3. Fricción Fiscal"
    ])

    # --- TAB 1: LA FIRMA Y LA INVERSIÓN ---
    with tab_inv:
        c1, c2 = st.columns([1, 1.2])
        with c1:
            st.metric("Inversión Hoy ($I_1$)", f"${inversion:,.0f}")
            st.metric("Capital Mañana ($K_2$)", f"{k2_optimo:,.2f} u.")
            st.write("Si $I_1$ es negativo, la firma está desinvirtiendo (vendiendo máquinas).")

        with c2:
            # Gráfica de PMgK2 vs Costo de Uso
            k_axis = np.linspace(k2_optimo*0.5, k2_optimo*1.5, 50)
            pmgk_axis = alpha * v["z2"] * (k_axis**(alpha-1))
            costo_uso = [v["r"] + v["delta"]] * len(k_axis)
            st.line_chart(pd.DataFrame({"Capital (K2)": k_axis, "PMgK2": pmgk_axis, "Costo (r+d)": costo_uso}).set_index("Capital (K2)"), color=["#2563EB", "#EF4444"])

        with st.expander("📝 Carpintería Algebraica: El Problema de la Firma"):
            st.markdown("**Paso 1: Definir el Valor de la Firma ($V$)**")
            st.latex(r"V = \pi_1 + \frac{\pi_2}{1+r}")
            st.markdown("**Paso 2: Sustituir la Inversión ($I_1$)**")
            st.latex(r"I_1 = K_2 - (1-\delta)K_1")
            st.markdown("**Paso 3: Derivar respecto al Capital futuro ($K_2$)**")
            st.latex(r"\frac{\partial V}{\partial K_2} = -1 + \frac{1}{1+r} [PMgK_2 + (1-\delta)] = 0")
            st.markdown("**Paso 4: Llegar a la Regla de Inversión**")
            st.latex(r"1+r = PMgK_2 + 1 - \delta \implies PMgK_2 = r + \delta")
            st.success(f"La firma comprará máquinas hasta que su rentabilidad sea {v['r']+v['delta']:.3f}")

    # --- TAB 2: EL HOGAR Y EULER ---
    with tab_euler:
        c1, c2 = st.columns([1, 1.2])
        with c1:
            st.metric("Ratio de Consumo ($C_2/C_1$)", f"{ratio_euler:.3f}")
            if ratio_euler > 1:
                st.write("La familia **ahorrará** hoy para consumir más mañana.")
            else:
                st.write("La familia es **impaciente** y prefiere gastar hoy.")
        
        with c2:
            # Gráfica de Euler
            c1_axis = np.linspace(100, 1000, 50)
            c2_euler = ratio_euler * c1_axis
            st.line_chart(pd.DataFrame({"Consumo Hoy (C1)": c1_axis, "Consumo Mañana (C2)": c2_euler}).set_index("Consumo Hoy (C1)"), color="#10B981")

        with st.expander("📝 Carpintería Algebraica: El Ahorro Intertemporal"):
            st.markdown("**Paso 1: Maximizar Utilidad Intertemporal**")
            st.latex(r"U = \ln(C_1) + \beta \ln(C_2)")
            st.markdown("**Paso 2: Restricción Presupuestaria**")
            st.latex(r"C_1 + \frac{C_2}{1+r} = \text{Riqueza (W)}")
            st.markdown("**Paso 3: Condición de Primer Orden (Euler)**")
            st.latex(r"\frac{U'_{C_1}}{U'_{C_2}} = 1+r \implies \frac{1/C_1}{\beta/C_2} = 1+r")
            st.latex(rf"C_2 = {v['beta']}(1+{v['r']})C_1 = {ratio_euler:.3f} C_1")

    # --- TAB 3: GOBIERNO ---
    with tab_friccion:
        st.subheader("La Cuña Fiscal (Tax Wedge)")
        st.latex(rf"\text{{Salario Neto}} = w_1(1 - {v['tau']})")
        
        # Gráfica de Oferta con Impuesto
        w_plot = np.linspace(w1_equilibrio*0.5, w1_equilibrio*1.5, 50)
        ns_sin = [ns_hoy] * len(w_plot)
        # El impuesto reduce el incentivo a trabajar, desplazando la oferta (o reduciendo el salario percibido)
        st.line_chart(pd.DataFrame({"Salario": w_plot, "Oferta (Ideal)": ns_sin}).set_index("Salario"), color="#9CA3AF")
        
        with st.expander("📝 Carpintería Algebraica: El Efecto del Impuesto"):
            st.markdown("**Paso 1: Nueva Condición de Ocio-Consumo**")
            st.latex(r"\frac{\gamma C_1}{l_1} = w_1(1-\tau)")
            st.markdown("**Paso 2: Interpretación Económica**")
            st.write(f"Con un impuesto del {v['tau']*100:.1f}%, el costo de oportunidad de descansar baja. Por cada hora que la familia en Medellín decide no trabajar, 'pierde' menos dinero que antes, lo que incentiva el ocio y reduce la producción nacional.")
