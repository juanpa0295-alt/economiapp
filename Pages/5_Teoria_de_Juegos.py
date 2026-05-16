import json
import streamlit as st
import pandas as pd
import numpy as np
import sympy as sp
import scipy.stats as stats
import google.generativeai as genai
import base64
import diseno

diseno.cargar_estilos_premium()
# ==========================================
# 1. CARGAR DATOS ESPECÍFICOS DE LA MATERIA
# ==========================================
with open('datos/teoria_juegos.json', 'r', encoding='utf-8') as file:
    datos = json.load(file)

# ==========================================
# 2. SELECTOR DE TEMA
# ==========================================
opciones_temas = [datos["modulos"][modulo]["nombre"] for modulo in datos["modulos"]]
tema_seleccionado = st.sidebar.selectbox("Selecciona un tema", opciones_temas)

# ==========================================
# MODULO 11: TEORÍA DE JUEGOS - EQUILIBRIOS PURAS
# ==========================================
if tema_seleccionado == "Equilibrios de Nash (Puras)":
    st.markdown("<h2><i class='fas fa-bullseye' style='color:#00FFAA;'></i> Nash en Estrategias Puras</h2>", unsafe_allow_html=True)
    tema = datos["modulos"]["nash_puras"]
    st.write(tema.get("descripcion_general", ""))
    st.latex(tema.get("formula_general", "BR_i(s_{-i}) = \\arg\\max_{s_i} u_i(s_i, s_{-i})"))
    st.markdown("Selecciona el tamaño de la matriz. Ingresa los pagos separados por coma **(Pago J1, Pago J2)**. Ejemplo: `3, 2`")
    
    # 1. Selectores de dimensión
    c_dim1, c_dim2 = st.columns(2)
    filas = c_dim1.number_input("Estrategias Jugador 1 (Filas)", min_value=2, max_value=5, value=2)
    columnas = c_dim2.number_input("Estrategias Jugador 2 (Columnas)", min_value=2, max_value=5, value=2)

    st.divider()
    
    # 2. Creación de UNA SOLA TABLA bimatricial (Formato Texto)
    st.markdown("<h4 style='color:#00FFAA;'>Matriz de Pagos del Juego</h4>", unsafe_allow_html=True)
    df_juego = pd.DataFrame("0, 0", index=[f"F{i+1}" for i in range(filas)], columns=[f"C{j+1}" for j in range(columnas)])
    
    # El usuario edita esta única tabla
    pagos_juego = st.data_editor(df_juego, key="editor_juego", use_container_width=True)

    # 3. Lógica interna para separar los datos y buscar el Equilibrio
    try:
        # Matrices internas vacías para separar a J1 y J2
        matriz_j1 = np.zeros((filas, columnas))
        matriz_j2 = np.zeros((filas, columnas))
        
        # Parseo (Traducción de texto a números)
        for i in range(filas):
            for j in range(columnas):
                # Tomamos la celda, ej: "3, 2", la partimos por la coma
                celda = str(pagos_juego.iloc[i, j]).split(',')
                matriz_j1[i, j] = float(celda[0].strip())
                matriz_j2[i, j] = float(celda[1].strip())

        # Motor de Cálculo de Mejor Respuesta
        equilibrios = []
        for i in range(filas):
            for j in range(columnas):
                pago_actual_j1 = matriz_j1[i, j]
                pago_actual_j2 = matriz_j2[i, j]
                
                # ¿Es Mejor Respuesta para J1? (Compara en la misma columna)
                es_br1 = (pago_actual_j1 == np.max(matriz_j1[:, j]))
                
                # ¿Es Mejor Respuesta para J2? (Compara en la misma fila)
                es_br2 = (pago_actual_j2 == np.max(matriz_j2[i, :]))
                
                if es_br1 and es_br2:
                    nombre_fila = pagos_juego.index[i]
                    nombre_col = pagos_juego.columns[j]
                    equilibrios.append(f"{nombre_fila}, {nombre_col}")

        st.divider()
        
        # 4. Resultados
        st.subheader("🎯 Veredicto del Análisis")
        if len(equilibrios) > 0:
            st.success(f"Se encontraron **{len(equilibrios)}** Equilibrio(s) de Nash en Estrategias Puras:")
            for eq in equilibrios:
                st.markdown(f"### 📍 Perfil: ({eq})")
        else:
            st.warning("🚨 No se encontraron Equilibrios de Nash en Estrategias Puras. Deberás buscar el equilibrio en Estrategias Mixtas.")

    except ValueError:
        st.error("⚠️ **Error de formato detectado.** Asegúrate de que todas las celdas tengan dos números separados por una coma. Ejemplo: `3, 2` o `-1, 5`.")
    except IndexError:
        st.error("⚠️ **Falta un pago.** Asegúrate de haber puesto la coma para separar el pago del Jugador 1 y el del Jugador 2.")
# ==========================================
# MÓDULO 12: TEORÍA DE JUEGOS - ESTRATEGIAS MIXTAS (2x2)
# ==========================================
elif tema_seleccionado == "Estrategias Mixtas (Cálculo p y q)":
    st.markdown("<h2><i class='fas fa-dice' style='color:#00FFAA;'></i> Estrategias Mixtas (2x2)</h2>", unsafe_allow_html=True)
    tema = datos["modulos"]["mixtas"]
    st.write(tema.get("descripcion_general", ""))
    st.latex(tema.get("formula_general", "E[U_1(p)] = p \\cdot E[u(S_{11})] + (1-p) \\cdot E[u(S_{12})]"))
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
                st.latex(r"p = \frac{v_{22} - v_{12}}{(v_{11} - v_{21}) - (v_{12} - v_{22})}")
            with c2:
                st.metric("q* (Probabilidad J2 - Izquierda)", f"{q_star:.4f}")
                st.latex(r"q = \frac{u_{22} - u_{12}}{(u_{11} - u_{21}) - (u_{12} - u_{22})}")
            
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
    tema = datos["modulos"]["extensiva"]
    st.write(tema.get("descripcion_general", ""))
    st.latex(tema.get("formula_general", ""))
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

    # 2. Generación del Árbol (Método con Base64 e Imagen)
    st.subheader("🌳 Diagrama del Árbol de Juego")
    
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
    
    encoded_mermaid = base64.b64encode(mermaid_code.encode('utf-8')).decode('utf-8')
    image_url = f"https://mermaid.ink/img/{encoded_mermaid}"
    
    st.image(image_url, caption="Árbol Secuencial del Juego (Generado Dinámicamente)")

    # 3. Inducción Hacia Atrás
    st.divider()
    st.subheader("🧮 Inducción Hacia Atrás (Backwards Induction)")
    
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
    tema = datos["modulos"]["arbitraje"]
    st.write(tema.get("descripcion_general", ""))
    st.latex(tema.get("formula_general", "\\max_{w_u} P(w_u, w_f) \\cdot w_u + (1 - P(w_u, w_f)) \\cdot w_f"))
    
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
        
        with st.container(border=True):
            col_in1, col_in2 = st.columns(2)
            
            # Usando .get() para evitar KeyErrors si las variables cambian de nombre
            vars_arbitraje = tema.get("variables", {})
            m_data = vars_arbitraje.get("mu_a", {"nombre": "Media Árbitro (m)", "valor_defecto": 110.0, "ayuda_real": "Noción promedio del árbitro."})
            sigma_data = vars_arbitraje.get("sigma_a", {"nombre": "Incertidumbre (σ)", "valor_defecto": 10.0, "ayuda_real": "Desviación estándar de la creencia del árbitro."})
            
            m_val = col_in1.number_input(m_data["nombre"], value=float(m_data["valor_defecto"]), step=10.0)
            sigma_val = col_in2.number_input(sigma_data["nombre"], value=float(sigma_data["valor_defecto"]), step=5.0, min_value=1.0)
            
            col_in1.caption(m_data["ayuda_real"])
            col_in2.caption(sigma_data["ayuda_real"])

        # Cálculos del Equilibrio
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
            x_axis = np.linspace(m_val - 4*sigma_val, m_val + 4*sigma_val, 200)
            pdf = (1 / (sigma_val * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x_axis - m_val) / sigma_val)**2)
            
            df_plot = pd.DataFrame({"Salario Ideal del Árbitro (x)": x_axis, "Probabilidad": pdf}).set_index("Salario Ideal del Árbitro (x)")
            st.line_chart(df_plot, color="#2563EB")
            st.caption("Los extremos de la campana representan dónde terminan ubicándose $w_f^*$ y $w_g^*$. ¡Juega con la Incertidumbre (σ) para ver cómo se ensancha la brecha!")

        # ==========================================
        # CARPINTERÍA MATEMÁTICA (AHORA LIBERADA)
        # ==========================================
        st.divider()
        st.subheader("🛠️ Carpintería Matemática (Desglose del Parcial)")
        
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