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
with open('datos/macroeconomia_1.json', 'r', encoding='utf-8') as file:
    datos = json.load(file)

# ==========================================
# 2. SELECTOR DE TEMA DE MACROECONOMÍA 1
# ==========================================
# Extraemos los nombres de los módulos dinámicamente
opciones_temas = [datos["modulos"][modulo]["nombre"] for modulo in datos["modulos"]]
tema_seleccionado = st.sidebar.selectbox("Selecciona un tema", opciones_temas)
# ==========================================
# MÓDULO 2: TEORÍA DEL CONSUMO
# ==========================================
if tema_seleccionado == "Teoría del Consumo":
    st.title("Laboratorio de Macroeconomía 📊")
    # Conexión actualizada
    tema = datos["modulos"]["teoria_consumo"]
    st.header(tema["nombre"])

    st.subheader("Modelo Matemático")
    col_form1, col_form2 = st.columns(2)
    with col_form1:
        st.markdown("**Fórmula General Estándar:**")
        st.latex(tema.get("formula_general", "C = C_0 + c_1(Y - T)"))

    st.divider()
    st.subheader("Configuración de Variables")
    col_input1, col_input2 = st.columns(2)
    valores_ingresados = {}

    for i, (simbolo, info) in enumerate(tema["variables"].items()):
        with col_input1 if i % 2 == 0 else col_input2:
            with st.container(border=True):
                if simbolo == "c1":
                    salto = 0.05
                else:
                    salto = 100.0
                    
                valores_ingresados[simbolo] = st.number_input(
                    f"{info.get('nombre', simbolo)} ({simbolo})", 
                    value=float(info.get('valor_defecto', 0)), 
                    step=salto
                )
                
                with st.expander("📖 ¿Qué es y dónde se consulta?"):
                    st.markdown(info.get('ayuda_real', 'Información no disponible.'))

    C0 = valores_ingresados["C0"]
    c1 = valores_ingresados["c1"]
    Y_val = valores_ingresados["Y"]
    T_val = valores_ingresados["T"]

    # ====== MOTOR MATEMÁTICO ======
    C, C_0_sym, c_1_sym, Y_sym, T_sym = sp.symbols('C C_0 c_1 Y T')
    ecuacion_consumo = sp.Eq(C, C_0_sym + c_1_sym * (Y_sym - T_sym))
    ecuacion_sustituida = ecuacion_consumo.subs({C_0_sym: C0, c_1_sym: c1, Y_sym: Y_val, T_sym: T_val})
    C_total = sp.solve(ecuacion_sustituida, C)[0]
    pmec = float(C_total) / Y_val if Y_val > 0 else 0
    ahorro = (Y_val - T_val) - C_total

    with col_form2:
        st.markdown("**Fórmula con tus Valores Actuales:**")
        st.latex(sp.latex(ecuacion_sustituida))
        st.markdown(f"### ➡️ Consumo Total (C) = `{float(C_total):,.2f}`")
        
        st.divider()
        st.markdown("**Cálculo de Propensiones (Tasas):**")
        st.latex(rf"PMeC = \frac{{C}}{{Y}} = \frac{{{float(C_total):,.0f}}}{{{Y_val:,.0f}}} = {pmec:.3f}")
        st.latex(rf"PMgC = c_1 = {c1}")
        
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
    opciones_consumo = {"Ingreso (Y)": Y_sym, "Impuestos (T)": T_sym}
    
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
# MÓDULO: CONSUMO INTERTEMPORAL 
# ==========================================
elif tema_seleccionado == "Consumo Intertemporal":
    st.title("Laboratorio de Macroeconomía 📊")
    tema = datos["modulos"]["consumo_intertemporal"]
    st.header(tema["nombre"])
    st.write(tema["descripcion_general"])
    st.latex(tema["formula_general"])
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
# MÓDULO: INVERSIÓN (DE GREGORIO & TOBIN)
# ==========================================
elif tema_seleccionado == "Inversión":
    st.title("Laboratorio de Macroeconomía y Negocios 📊")
    tema = datos["modulos"]["inversion"]
    st.markdown(f"<h2><i class='fas fa-exchange-alt' style='color:#2563EB;'></i> {tema['nombre']}</h2>", unsafe_allow_html=True)
    st.write(tema["descripcion_general"])
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
# MÓDULO: GOBIERNO Y POLÍTICA FISCAL (EL JEFE FINAL)
# ==========================================
elif tema_seleccionado == "Gobierno y Política Fiscal":
    st.title("Laboratorio de Macroeconomía 📊")
    tema = datos["modulos"]["gobierno"]
    st.header(tema["nombre"])
    st.write(tema["descripcion_general"])
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
# MÓDULO: MICROFUNDAMENTOS Y EQUILIBRIO GENERAL
# ==========================================
elif tema_seleccionado == "Microfundamentos: El Problema de la Firma":
    tema = datos["modulos"]["microfundamentos"]
    st.markdown(f"<h2><i class='fas fa-industry' style='color:#1E3A8A;'></i> {tema['nombre']}</h2>", unsafe_allow_html=True)
    st.write(tema["descripcion_general"])
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
    tema = datos["modulos"]["equilibrio_dinamico"]
    st.markdown(f"<h2><i class='fas fa-project-diagram' style='color:#1E3A8A;'></i> {tema['nombre']}</h2>", unsafe_allow_html=True)
    st.write(tema["descripcion_general"])
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
