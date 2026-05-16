import streamlit as st
import diseno

diseno.cargar_estilos_premium()
# ==========================================
# 1. CONFIGURACIÓN DE LA PÁGINA (Debe ser la primera línea)
# ==========================================
st.set_page_config(
    page_title="Economiapp | Entorno Analítico",
    page_icon="📈",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ==========================================
# 2. MOTOR DE DISEÑO (CSS ANIMADO Y GLASSMORPHISM)
# ==========================================
def cargar_estilos_premium():
    st.markdown("""
    <style>
    /* 1. Fondo animado (Gradiente en movimiento constante) */
    .stApp {
        background: linear-gradient(-45deg, #0f172a, #1e293b, #020617, #081229);
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
    }
    
    @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    /* 2. Barra lateral con efecto Vidrio Esmerilado (Glassmorphism) */
    [data-testid="stSidebar"] {
        background-color: rgba(15, 23, 42, 0.4) !important;
        backdrop-filter: blur(15px);
        border-right: 1px solid rgba(255, 255, 255, 0.05);
    }

    /* 3. Ocultar el menú genérico de Streamlit y el pie de página para aspecto SaaS nativo */
    #MainMenu {visibility: hidden;}
    header {background-color: transparent !important;}
    footer {visibility: hidden;}
    
    /* 4. Estilizar sutilmente los contenedores para que encajen con el fondo */
    div[data-testid="stVerticalBlock"] div[style*="border"] {
        background: rgba(30, 41, 59, 0.6) !important;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 255, 170, 0.15) !important;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
    </style>
    """, unsafe_allow_html=True)

# Ejecutamos los estilos
cargar_estilos_premium()

# ==========================================
# 3. INTERFAZ DE INICIO
# ==========================================
st.markdown("<br><br>", unsafe_allow_html=True)
st.markdown("<h1 style='text-align: center; color: white; font-size: 4rem; text-shadow: 0px 0px 15px rgba(0,255,170,0.5);'>Economiapp</h1>", unsafe_allow_html=True)
st.markdown("<h3 style='text-align: center; color: #94a3b8; font-weight: 300;'>Entorno Virtual de Análisis Económico y Cuantitativo</h3>", unsafe_allow_html=True)
st.divider()

col1, col2, col3 = st.columns([1, 2, 1])

with col2:
    with st.container(border=True):
        st.markdown("<h4 style='color: #00FFAA;'><i class='fas fa-terminal'></i> Bienvenido al Laboratorio</h4>", unsafe_allow_html=True)
        st.markdown("""
        <p style='color: #cbd5e1; font-size: 1.1rem; line-height: 1.6;'>
        Has ingresado a una herramienta diseñada con el rigor analítico que exige la disciplina. 
        <br><br>
        👈 Utiliza el <b>Panel de Navegación</b> a la izquierda para seleccionar los módulos de cálculo. El motor está optimizado para resolver modelos macroeconómicos, optimización multivariable y escenarios de Teoría de Juegos.
        </p>
        """, unsafe_allow_html=True)