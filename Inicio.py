import streamlit as st
import diseno

# ==========================================
# 1. CONFIGURACIÓN DE LA PÁGINA
# ==========================================
st.set_page_config(
    page_title="Economiapp | Laboratorio de Análisis",
    page_icon="📜",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Cargamos los estilos base (asegúrate de que diseno.py tenga las fuentes Playfair y Inter)
diseno.cargar_estilos_premium()

# ==========================================
# 2. ESTILOS EXCLUSIVOS PARA PORTADA ACADÉMICA
# ==========================================
st.markdown("""
    <style>
    /* Importamos Playfair Display para ese toque de libro clásico */
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@300;400;600&display=swap');

    /* Fondo de Cuadrícula Analítica (Blueprint/Millimeter paper) */
    .stApp {
        background-color: #FDFDFD;
        background-image: 
            linear-gradient(rgba(79, 70, 229, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79, 70, 229, 0.05) 1px, transparent 1px);
        background-size: 30px 30px; /* Tamaño de la cuadrícula */
    }

    /* Título Académico */
    .academic-title {
        font-family: 'Playfair Display', serif !important;
        font-size: 5.5rem !important;
        font-weight: 900 !important;
        color: #1E293B !important;
        text-align: center;
        line-height: 1 !important;
        margin-bottom: 0px;
    }

    .academic-subtitle {
        font-family: 'Inter', sans-serif !important;
        text-transform: uppercase;
        letter-spacing: 4px;
        color: #4F46E5 !important;
        font-size: 1rem !important;
        text-align: center;
        font-weight: 600;
        margin-bottom: 40px;
    }

    /* Marco del Laboratorio (Parece un documento oficial) */
    .lab-frame {
        background: white !important;
        border: 1px solid #E2E8F0 !important;
        border-top: 8px solid #1E293B !important; /* Borde superior grueso estilo Oxford */
        border-radius: 4px !important; /* Menos redondeado, más formal */
        padding: 50px !important;
        box-shadow: 0 20px 40px rgba(0,0,0,0.05) !important;
    }

    </style>
""", unsafe_allow_html=True)

# ==========================================
# 3. CONTENIDO DE LA PORTADA
# ==========================================

st.markdown("<br><br>", unsafe_allow_html=True)

# Encabezado de la institución virtual
st.markdown("<p class='academic-subtitle'>Laboratorio de Ciencias Económicas y Cuantitativas</p>", unsafe_allow_html=True)

# Título Principal con fuente de libro
st.markdown("<h1 class='academic-title'>Economiapp</h1>", unsafe_allow_html=True)
st.markdown("<p style='text-align:center; font-style: italic; color: #64748B; font-size: 1.2rem;'>Herramienta de Simulación y Optimización Analítica</p>", unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# Cuerpo central enmarcado
col1, col2, col3 = st.columns([1, 2.5, 1])

with col2:
    st.markdown("""
        <div class='lab-frame'>
            <h4 style='font-family: "Playfair Display", serif; color: #1E293B; margin-bottom: 20px;'>
                📜 Directrices del Entorno Virtual
            </h4>
            <p style='color: #334155; line-height: 1.8; font-family: "Inter", sans-serif; text-align: justify;'>
                Bienvenido al sistema de procesamiento económico. Este entorno ha sido desarrollado para 
                cerrar la brecha entre la <b>teoría pura</b> y la <b>resolución numérica compleja</b>. 
                <br><br>
                A través del panel de navegación lateral, podrá acceder a los diferentes módulos de 
                investigación, los cuales integran motores de cálculo simbólico y modelización 
                de juegos estratégicos. 
                <br><br>
                <span style='color: #4F46E5; font-weight: 600;'>Seleccione una materia para iniciar la sesión de análisis.</span>
            </p>
            <hr style='margin: 30px 0;'>
            <div style='display: flex; justify-content: space-between; font-size: 0.8rem; color: #94A3B8;'>
                <span>VERSION 2.4.0 (MODULAR)</span>
                <span>DESARROLLO ACADÉMICO PRO</span>
            </div>
        </div>
    """, unsafe_allow_html=True)

st.markdown("<br><br>", unsafe_allow_html=True)