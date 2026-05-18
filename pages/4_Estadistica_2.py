import json
import math
import scipy.stats as stats  # Importante para Z, T, P-values
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
with open('datos/estadistica_2.json', 'r', encoding='utf-8') as file:
    datos = json.load(file)

# ==========================================
# 2. SELECTOR DE TEMA DE ESTADÍSTICA 2
# ==========================================
opciones_temas = [datos["modulos"][modulo]["nombre"] for modulo in datos["modulos"]]
tema_seleccionado = st.sidebar.selectbox("Selecciona un tema", opciones_temas)

# ==========================================
# MÓDULO 8: ESTIMADORES ESTADÍSTICOS
# ==========================================
if tema_seleccionado == "Estimadores Estadísticos":
    st.markdown("<h2><i class='fas fa-bullseye' style='color:#00FFAA;'></i> Laboratorio de Estadística 2</h2>", unsafe_allow_html=True)
    tema = datos["modulos"]["estimadores"]
    st.header(tema["nombre"])
    st.write(tema["descripcion_general"])
    st.latex(tema["formula_general"])
    
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
# MÓDULO 9: INTERVALOS Y TAMAÑO DE MUESTRA
# ==========================================
elif tema_seleccionado == "Intervalos y Tamaño de Muestra":
    st.markdown("<h2><i class='fas fa-arrows-alt-h' style='color:#00FFAA;'></i> Intervalos y Tamaño de Muestra</h2>", unsafe_allow_html=True)
    tema = datos["modulos"]["intervalos_muestra"]
    st.write(tema["descripcion_general"])
    st.latex(tema["formula_general"])
    
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
# MÓDULO 10: PRUEBAS DE HIPÓTESIS
# ==========================================
elif tema_seleccionado == "Pruebas de Hipótesis":
    st.markdown("<h2><i class='fas fa-balance-scale' style='color:#00FFAA;'></i> Pruebas de Hipótesis</h2>", unsafe_allow_html=True)
    tema = datos["modulos"]["pruebas_hipotesis"]
    st.write(tema["descripcion_general"])
    st.latex(tema["formula_general"])
    
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
elif tema_seleccionado == "Pruebas de Hipótesis Avanzadas":
    st.markdown("<h2><i class='fas fa-chart-bar' style='color:#00FFAA;'></i> Clase 15: Pruebas de Hipótesis Avanzadas</h2>", unsafe_allow_html=True)
    tema = datos["modulos"]["pruebas_avanzadas"]
    st.write(tema["descripcion_general"])
    st.latex(tema["formula_general"])
    
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
