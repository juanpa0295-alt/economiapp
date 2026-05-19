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
    st.markdown("<h2><i class='fas fa-bullseye' style='color:#6366F1;'></i> Nash en Estrategias Puras</h2>", unsafe_allow_html=True)
    tema = datos["modulos"]["nash_puras"]
    st.write(tema.get("descripcion_general", ""))
    st.latex(tema.get("formula_general", "BR_i(s_{-i}) = \\arg\\max_{s_i} u_i(s_i, s_{-i})"))
    
    with st.container(border=True):
        st.markdown("<h4>Configuración de la Matriz</h4>", unsafe_allow_html=True)
        st.markdown("Selecciona el tamaño e ingresa los pagos separados por coma **(Pago J1, Pago J2)**. Ejemplo: `3, 2`")
        
        # 1. Selectores de dimensión
        c_dim1, c_dim2 = st.columns(2)
        filas = c_dim1.number_input("Estrategias Jugador 1 (Filas)", min_value=2, max_value=5, value=2)
        columnas = c_dim2.number_input("Estrategias Jugador 2 (Columnas)", min_value=2, max_value=5, value=2)

        st.divider()
        
        # 2. Creación de la tabla de entrada (st.data_editor)
        st.markdown("<h5 style='color:#6366F1;'>Input de Pagos</h5>", unsafe_allow_html=True)
        df_juego = pd.DataFrame("0, 0", index=[f"F{i+1}" for i in range(filas)], columns=[f"C{j+1}" for j in range(columnas)])
        
        # Cálculo dinámico de altura: Ajuste mucho más generoso para la nueva tipografía
        altura_dinamica = int((filas * 50) + 100)
        pagos_juego = st.data_editor(df_juego, key="editor_juego", use_container_width=True, height=altura_dinamica)
    # 3. Lógica interna y renderizado visual
    try:
        matriz_j1 = np.zeros((filas, columnas))
        matriz_j2 = np.zeros((filas, columnas))
        
        for i in range(filas):
            for j in range(columnas):
                celda = str(pagos_juego.iloc[i, j]).split(',')
                matriz_j1[i, j] = float(celda[0].strip())
                matriz_j2[i, j] = float(celda[1].strip())

        equilibrios = []
        for i in range(filas):
            for j in range(columnas):
                pago_actual_j1 = matriz_j1[i, j]
                pago_actual_j2 = matriz_j2[i, j]
                
                es_br1 = (pago_actual_j1 == np.max(matriz_j1[:, j]))
                es_br2 = (pago_actual_j2 == np.max(matriz_j2[i, :]))
                
                if es_br1 and es_br2:
                    equilibrios.append(f"{pagos_juego.index[i]}, {pagos_juego.columns[j]}")

        # Renderizado de la matriz HTML armonizada
        st.divider()
        st.markdown("<h2>🎯 Veredicto del Análisis</h2>", unsafe_allow_html=True)
        
        html_table = f"<div class='bimatrix-container'><table>"
        html_table += "<thead><tr><th class='diagonal-header'>J1 \\ J2</th>"
        for col in pagos_juego.columns:
            html_table += f"<th>{col}</th>"
        html_table += "</tr></thead><tbody>"

        for i, fila in enumerate(pagos_juego.index):
            html_table += f"<tr><th>{fila}</th>"
            for j, col in enumerate(pagos_juego.columns):
                p1 = matriz_j1[i, j]
                p2 = matriz_j2[i, j]
                es_eq = f"{fila}, {col}" in equilibrios
                
                # Resaltar la celda si es Equilibrio de Nash
                bg_color = "background-color: rgba(16, 185, 129, 0.15); border: 2px solid #10B981 !important;" if es_eq else ""
                
                html_table += f"<td style='{bg_color}'>"
                html_table += f"<span class='bimatrix-payoff-1'>{p1:g}</span><span class='bimatrix-comma'>,</span>"
                html_table += f"<span class='bimatrix-payoff-2'>{p2:g}</span>"
                html_table += "</td>"
            html_table += "</tr>"
        html_table += "</tbody></table></div>"

        st.markdown(html_table, unsafe_allow_html=True)

        if len(equilibrios) > 0:
            st.success(f"Se encontraron **{len(equilibrios)}** Equilibrio(s) de Nash en Estrategias Puras (Resaltados en verde):")
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
    st.markdown("<h2><i class='fas fa-dice' style='color:#6366F1;'></i> Estrategias Mixtas (2x2)</h2>", unsafe_allow_html=True)
    tema = datos["modulos"]["mixtas"]
    st.write(tema.get("descripcion_general", ""))
    st.latex(tema.get("formula_general", "E[U_1(p)] = p \\cdot E[u(S_{11})] + (1-p) \\cdot E[u(S_{12})]"))
    st.info("💡 **Nota:** El cálculo algebraico de probabilidades exactas ($p$ y $q$) se aplica a juegos 2x2. Si tienes una matriz mayor, primero debes aplicar Eliminación Iterada de Estrategias Dominadas.")
    
    with st.container(border=True):
        col_in1, col_in2 = st.columns(2)
        val = {}
        with col_in1:
            st.markdown("<h4 style='color:#3B82F6;'>Jugador 1 (Filas)</h4>", unsafe_allow_html=True)
            val["u11"] = st.number_input("Pago J1 (Arriba, Izq)", value=3.0, step=1.0)
            val["u12"] = st.number_input("Pago J1 (Arriba, Der)", value=0.0, step=1.0)
            val["u21"] = st.number_input("Pago J1 (Abajo, Izq)", value=0.0, step=1.0)
            val["u22"] = st.number_input("Pago J1 (Abajo, Der)", value=1.0, step=1.0)
        with col_in2:
            st.markdown("<h4 style='color:#10B981;'>Jugador 2 (Columnas)</h4>", unsafe_allow_html=True)
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
        
        if 0 <= p_star <= 1 and 0 <= q_star <= 1:
            st.divider()
            with st.container(border=True):
                st.markdown("<h4>Resultados Óptimos</h4>", unsafe_allow_html=True)
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
    st.markdown("<h2><i class='fas fa-sitemap' style='color:#6366F1;'></i> Forma Extensiva y Dominancia</h2>", unsafe_allow_html=True)
    tema = datos["modulos"]["extensiva"]
    st.write(tema.get("descripcion_general", ""))
    st.latex(tema.get("formula_general", ""))
    st.info("💡 **Juegos Secuenciales:** En la forma extensiva, los jugadores no deciden al mismo tiempo. El Jugador 1 mueve primero, y el Jugador 2 observa esa jugada antes de decidir.")
    
    with st.container(border=True):
        st.markdown("<h4>Configuración de Pagos (Nodos Finales)</h4>", unsafe_allow_html=True)
        col_in1, col_in2 = st.columns(2)
        val = {}
        with col_in1:
            st.markdown("<h5 style='color:#3B82F6;'>Jugador 1 (Mueve Primero)</h5>", unsafe_allow_html=True)
            val["u11"] = st.number_input("Pago J1 (Arriba, Izq)", value=3.0, step=1.0, key="ext_u11")
            val["u12"] = st.number_input("Pago J1 (Arriba, Der)", value=0.0, step=1.0, key="ext_u12")
            val["u21"] = st.number_input("Pago J1 (Abajo, Izq)", value=0.0, step=1.0, key="ext_u21")
            val["u22"] = st.number_input("Pago J1 (Abajo, Der)", value=1.0, step=1.0, key="ext_u22")
        with col_in2:
            st.markdown("<h5 style='color:#10B981;'>Jugador 2 (Mueve Segundo)</h5>", unsafe_allow_html=True)
            val["v11"] = st.number_input("Pago J2 (Arriba, Izq)", value=2.0, step=1.0, key="ext_v11")
            val["v12"] = st.number_input("Pago J2 (Arriba, Der)", value=1.0, step=1.0, key="ext_v12")
            val["v21"] = st.number_input("Pago J2 (Abajo, Izq)", value=0.0, step=1.0, key="ext_v21")
            val["v22"] = st.number_input("Pago J2 (Abajo, Der)", value=3.0, step=1.0, key="ext_v22")

    st.divider()

    with st.container(border=True):
        st.markdown("<h4>🌳 Diagrama del Árbol de Juego</h4>", unsafe_allow_html=True)
        mermaid_code = f"""graph LR
        J1(("Jugador 1")) -->|"Arriba"| J2A(("Jugador 2"))
        J1 -->|"Abajo"| J2B(("Jugador 2"))
        
        J2A -->|"Izquierda"| P1["({val['u11']:g}, {val['v11']:g})"]
        J2A -->|"Derecha"| P2["({val['u12']:g}, {val['v12']:g})"]
        
        J2B -->|"Izquierda"| P3["({val['u21']:g}, {val['v21']:g})"]
        J2B -->|"Derecha"| P4["({val['u22']:g}, {val['v22']:g})"]

        style J1 fill:#3B82F6,color:#fff,stroke:#fff,stroke-width:2px
        style J2A fill:#10B981,color:#fff,stroke:#fff,stroke-width:2px
        style J2B fill:#10B981,color:#fff,stroke:#fff,stroke-width:2px
        style P1 fill:#1E293B,color:#fff,stroke:#E2E8F0,stroke-width:2px
        style P2 fill:#1E293B,color:#fff,stroke:#E2E8F0,stroke-width:2px
        style P3 fill:#1E293B,color:#fff,stroke:#E2E8F0,stroke-width:2px
        style P4 fill:#1E293B,color:#fff,stroke:#E2E8F0,stroke-width:2px
        """
        
        encoded_mermaid = base64.b64encode(mermaid_code.encode('utf-8')).decode('utf-8')
        image_url = f"https://mermaid.ink/img/{encoded_mermaid}"
        st.image(image_url, caption="Árbol Secuencial del Juego (Generado Dinámicamente)")

    # 3. Inducción Hacia Atrás
    st.divider()
    with st.container(border=True):
        st.markdown("<h4>🧮 Inducción Hacia Atrás (Backwards Induction)</h4>", unsafe_allow_html=True)
        
        st.markdown("**Paso 1: Empezamos por el final (Jugador 2)**")
        st.markdown("El Jugador 2 observa lo que hizo el Jugador 1 y elige la rama que le dé el mayor pago.")
        
        eleccion_j2_arriba = "Izquierda" if val["v11"] > val["v12"] else "Derecha"
        pago_j1_arriba = val["u11"] if eleccion_j2_arriba == "Izquierda" else val["u12"]
        st.markdown(f"* Si J1 juega **Arriba**, J2 elegirá **{eleccion_j2_arriba}**.")
        
        eleccion_j2_abajo = "Izquierda" if val["v21"] > val["v22"] else "Derecha"
        pago_j1_abajo = val["u21"] if eleccion_j2_abajo == "Izquierda" else val["u22"]
        st.markdown(f"* Si J1 juega **Abajo**, J2 elegirá **{eleccion_j2_abajo}**.")
        
        st.markdown("**Paso 2: La decisión del Jugador 1**")
        st.markdown("El Jugador 1 *anticipa* estas decisiones racionales y reduce el árbol en su mente:")
        st.markdown(f"* Sabe que jugar **Arriba** le garantiza un pago de **{pago_j1_arriba:g}**.")
        st.markdown(f"* Sabe que jugar **Abajo** le garantiza un pago de **{pago_j1_abajo:g}**.")
        
        eleccion_final_j1 = "Arriba" if pago_j1_arriba > pago_j1_abajo else "Abajo"
        st.success(f"**🎯 Equilibrio Perfecto en Subjuegos:** El Jugador 1 jugará **{eleccion_final_j1}**.")

# ==========================================
# TEORÍA DE JUEGOS - ARBITRAJE DE OFERTA FINAL
# ==========================================
elif tema_seleccionado == "Arbitraje de Oferta Final":
    st.markdown("<h2><i class='fas fa-balance-scale' style='color:#6366F1;'></i> Arbitraje de Oferta Final (Farber, 1980)</h2>", unsafe_allow_html=True)
    tema = datos["modulos"]["arbitraje"]
    st.write(tema.get("descripcion_general", ""))
    st.latex(tema.get("formula_general", "\\max_{w_u} P(w_u, w_f) \\cdot w_u + (1 - P(w_u, w_f)) \\cdot w_f"))
    
    tab_teoria, tab_simulador = st.tabs(["📚 Teoría e Intuición", "🧮 Laboratorio y Desglose Matemático"])
    
    with tab_teoria:
        with st.container(border=True):
            st.markdown("<h4>El Dilema del Negociador</h4>", unsafe_allow_html=True)
            st.info("💡 **Compensación (Trade-off):** Una oferta más agresiva produce una mejor recompensa si el árbitro la elige, pero es menos probable que sea elegida.")
            
            c_t1, c_t2 = st.columns(2)
            with c_t1:
                st.markdown("**Reglas del Juego:**")
                st.markdown("- La Empresa ($f$) y el Sindicato ($g$) proponen salarios $w_f$ y $w_g$.")
                st.markdown("- El árbitro tiene en mente un salario justo $x \sim N(m, \sigma^2)$.")
                st.markdown("- El árbitro elige mecánicamente la oferta más cercana a $x$.")
            with c_t2:
                st.markdown("**El Papel de la Incertidumbre ($\\sigma$):**")
                st.markdown("- Si $\\sigma$ es bajo, las partes no pueden desviarse mucho de la media $m$.")
                st.markdown("- Si $\\sigma$ es alto, la ignorancia permite ofertas agresivas.")

    with tab_simulador:
        with st.container(border=True):
            st.markdown("<h4>Simulador de Equilibrio de Nash</h4>", unsafe_allow_html=True)
            col_in1, col_in2 = st.columns(2)
            
            vars_arbitraje = tema.get("variables", {})
            m_data = vars_arbitraje.get("mu_a", {"nombre": "Media Árbitro (m)", "valor_defecto": 110.0, "ayuda_real": "Noción promedio del árbitro."})
            sigma_data = vars_arbitraje.get("sigma_a", {"nombre": "Incertidumbre (σ)", "valor_defecto": 10.0, "ayuda_real": "Desviación estándar de la creencia del árbitro."})
            
            m_val = col_in1.number_input(m_data["nombre"], value=float(m_data["valor_defecto"]), step=10.0)
            sigma_val = col_in2.number_input(sigma_data["nombre"], value=float(sigma_data["valor_defecto"]), step=5.0, min_value=1.0)
            
            col_in1.caption(m_data["ayuda_real"])
            col_in2.caption(sigma_data["ayuda_real"])

            distancia = np.sqrt((np.pi * sigma_val**2) / 2)
            w_f = m_val - distancia
            w_g = m_val + distancia

            st.divider()
            col_res1, col_res2 = st.columns([1, 1.5])
            
            with col_res1:
                st.markdown("<h4>Ofertas Óptimas</h4>", unsafe_allow_html=True)
                st.success(f"**Oferta Sindicato ($w_g^*$):** ${w_g:,.2f}")
                st.error(f"**Oferta Empresa ($w_f^*$):** ${w_f:,.2f}")
                st.metric("Brecha Salarial", f"${(w_g - w_f):,.2f}")
                
            with col_res2:
                x_axis = np.linspace(m_val - 4*sigma_val, m_val + 4*sigma_val, 200)
                pdf = (1 / (sigma_val * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x_axis - m_val) / sigma_val)**2)
                
                df_plot = pd.DataFrame({"Salario Ideal del Árbitro (x)": x_axis, "Probabilidad": pdf}).set_index("Salario Ideal del Árbitro (x)")
                st.line_chart(df_plot, color="#6366F1")
                st.caption("Los extremos de la campana representan dónde terminan ubicándose $w_f^*$ y $w_g^*$.")

        with st.container(border=True):
            st.markdown("<h4>🛠️ Carpintería Matemática</h4>", unsafe_allow_html=True)
            st.markdown("**1. Función Objetivo de la Empresa:**")
            st.latex(r"\min_{w_f} \{ w_f F\left(\frac{w_f + w_g}{2}\right) + w_g \left[1 - F\left(\frac{w_f + w_g}{2}\right)\right] \}")
            st.markdown("**2. CPO Empresa:**")
            st.latex(r"(w_g^* - w_f^*) \frac{1}{2} f\left(\frac{w_f^* + w_g^*}{2}\right) = F\left(\frac{w_f^* + w_g^*}{2}\right)")
            st.markdown("**3. CPO Sindicato:**")
            st.latex(r"(w_g^* - w_f^*) \frac{1}{2} f\left(\frac{w_f^* + w_g^*}{2}\right) = \left[1 - F\left(\frac{w_f^* + w_g^*}{2}\right)\right]")
            st.markdown("**4. Igualación de Probabilidades:**")
            st.latex(r"F\left(\frac{w_f^* + w_g^*}{2}\right) = \frac{1}{2} \implies \frac{w_f^* + w_g^*}{2} = m")
            st.markdown("**5. Despeje de la Brecha:**")
            st.latex(r"w_g^* = m + \sqrt{\frac{\pi \sigma^2}{2}} \quad ; \quad w_f^* = m - \sqrt{\frac{\pi \sigma^2}{2}}")