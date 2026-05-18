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
with open('datos/matematicas.json', 'r', encoding='utf-8') as file:
    datos = json.load(file)

# ==========================================
# 2. SELECTOR DE TEMA
# ==========================================
opciones_temas = [datos["modulos"][modulo]["nombre"] for modulo in datos["modulos"]]
tema_seleccionado = st.sidebar.selectbox("Selecciona un nivel", opciones_temas)

st.title("Laboratorio de Matemáticas 🧮")

# ==========================================
# MÓDULO: MATEMÁTICAS 1
# ==========================================
if tema_seleccionado == "Matemáticas 1: Cálculo Diferencial":
    tema = datos["modulos"]["matematicas_1"]
    st.markdown(f"<h2><i class='fas fa-chart-line' style='color:#3B82F6;'></i> {tema['nombre']}</h2>", unsafe_allow_html=True)
    st.write(tema["descripcion_general"])
    st.latex(tema.get("formula_general", "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}"))
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
            with st.container(border=True):
                c_in1, c_in2 = st.columns([2, 1])
                with c_in1:
                    func_str = st.text_input("Función f(x):", value="((x**2) - 1)/(x - 1)")
                    st.caption("Ejemplo de indeterminación 0/0")
                with c_in2:
                    tendencia_str = st.text_input("x tiende a:", value="1")
                    st.caption("Punto a evaluar")

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
            st.error(f"🚨 Hay un error de sintaxis en la función. Detalle técnico: {e}")

# ==========================================
# MÓDULO: MATEMÁTICAS 2
# ==========================================
elif tema_seleccionado == "Matemáticas 2: Cálculo Integral":
    tema = datos["modulos"]["matematicas_2"]
    st.markdown(f"<h2><i class='fas fa-chart-area' style='color:#3B82F6;'></i> {tema['nombre']}</h2>", unsafe_allow_html=True)
    st.write(tema["descripcion_general"])
    st.latex(tema.get("formula_general", "\\int_{a}^{b} f(x) dx = F(b) - F(a)"))
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
            with st.container(border=True):
                func_str = st.text_input("Ingresa f(x):", value="-x**2 + 40*x - 100")
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

            st.divider()
            st.subheader("🛠️ Desarrollo de la Carpintería")
            
            st.markdown("**1. Condición de Primer Orden (CPO):**")
            st.latex(f"f'(x) = {sp.latex(derivada)} = 0")
            
            st.markdown("**2. Condición de Segundo Orden (CSO):**")
            st.latex(f"f''(x) = {sp.latex(segunda_derivada)}")
            
            for p in puntos_criticos:
                cso_val = segunda_derivada.subs(x, p).evalf()
                if cso_val < 0:
                    st.info(f"Para $x^*={float(p.evalf()):.2f}$, $f'' < 0$: Es un **MÁXIMO** (Cóncava $\\cap$).")
                elif cso_val > 0:
                    st.info(f"Para $x^*={float(p.evalf()):.2f}$, $f'' > 0$: Es un **MÍNIMO** (Convexa $\\cup$).")

        except Exception as e:
            st.error(f"Error en la entrada matemática. Detalle: {e}")

# ==========================================
# MÓDULO: MATEMÁTICAS 3
# ==========================================
elif tema_seleccionado == "Matemáticas 3: Álgebra Lineal y Multivariable":
    tema = datos["modulos"]["matematicas_3"]
    st.markdown(f"<h2><i class='fas fa-project-diagram' style='color:#3B82F6;'></i> {tema['nombre']}</h2>", unsafe_allow_html=True)
    st.write(tema["descripcion_general"])
    st.latex(tema.get("formula_general", "\\mathcal{L}(x, y, \\lambda) = f(x,y) - \\lambda(g(x,y) - c)"))
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
            with st.container(border=True):
                st.markdown("### ⚙️ Parámetros de Integración")
                c_in1, c_in2, c_in3 = st.columns([2, 1, 1])
                with c_in1:
                    func_str = st.text_input("Función Marginal f(x):", value="3*x**2")
                with c_in2:
                    lim_a = st.number_input("Límite Inferior (a):", value=0.0, step=1.0)
                with c_in3:
                    lim_b = st.number_input("Límite Superior (b):", value=5.0, step=1.0)

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
            
            st.subheader("🛠️ Carpintería: Teorema Fundamental del Cálculo")
            
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
# MÓDULO: MATEMÁTICAS PREMIUM (Opcional si decides mantener la sección avanzada dentro del trial)
# ==========================================
elif tema_seleccionado == "Matemáticas Avanzadas [Premium]":
    st.markdown("<h2><i class='fas fa-star' style='color:#EAB308;'></i> Matemáticas Avanzadas</h2>", unsafe_allow_html=True)
    st.write("Esta sección está diseñada para la resolución de matrices Hessianas y multiplicadores de Lagrange con múltiples restricciones. Todo el poder de Economiapp desbloqueado en tu periodo de prueba.")
