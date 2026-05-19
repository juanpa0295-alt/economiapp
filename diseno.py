import streamlit as st

def cargar_estilos_premium():
    st.markdown("""
    <style>
    /* 1. IMPORTACIÓN DE FUENTES MODERNAS (Poppins e Inter) */
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&display=swap');

    /* 2. CONFIGURACIÓN BASE DE LA APP (FONDO CLARO Y FUENTE) */
    .stApp {
        background-color: #F8FAFC; /* Un gris/azul casi blanco, súper limpio */
        color: #1E293B; /* Texto azul pizarra oscuro para máximo contraste */
        font-family: 'Inter', sans-serif;
    }
    
    /* Configuración global de textos y fuentes */
    h1, h2, h3, h4, h5, h6 {
        font-family: 'Poppins', sans-serif !important;
        color: #1E293B !important;
        font-weight: 700 !important;
    }
    
    p, li, span, label, td, th {
        font-family: 'Inter', sans-serif;
        color: #475569 !important; /* Un gris oscuro suave para párrafos */
        font-size: 1.05rem !important;
    }

    /* 3. ESTILOS DE LA BARRA LATERAL (SIDEBAR) - Ahora Limpia y Blanca */
    [data-testid="stSidebar"] {
        background-color: #FFFFFF !important;
        border-right: 1px solid #E2E8F0;
        backdrop-filter: none !important; /* Adiós al desenfoque viejo */
    }
    
    /* Títulos en el Sidebar */
    [data-testid="stSidebar"] h1, [data-testid="stSidebar"] h2 {
        font-size: 1.5rem;
        color: #1E293B !important;
        text-align: center;
        padding-bottom: 20px;
    }
    
    /* Elementos de navegación activos/inactivos */
    [data-testid="stSidebarNav"] ul li a {
        color: #475569 !important;
        border-radius: 8px;
        transition: all 0.3s ease;
    }
    
    /* Hover y Activo en navegación (Estilo Morado Vibrante) */
    [data-testid="stSidebarNav"] ul li a:hover {
        background-color: #EEF2FF !important;
        color: #4F46E5 !important;
    }
    
    [data-testid="stSidebarNav"] ul li a[aria-current="page"] {
        background-color: #EEF2FF !important;
        color: #4F46E5 !important;
        border-left: 4px solid #4F46E5;
        font-weight: 600;
    }
    
    /* 4. ESTILO DE TARJETAS (CONTENEDORES DE CÁLCULO) */
    /* Cuando usas st.container(border=True) en tu código, se verá así: */
    div[data-testid="stVerticalBlock"] div[style*="border"] {
        background-color: #FFFFFF !important; /* Tarjeta blanca pura */
        border: 1px solid #E2E8F0 !important; /* Borde sutil */
        border-radius: 16px !important; /* Bordes muy redondeados modernos */
        padding: 30px !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important; /* Sombra suave para dar profundidad */
        color: #1E293B !important;
    }
    
    /* Neon glow effect para títulos principales (Vibrante) */
    h1 { text-shadow: 0 0 10px rgba(0,255,170,0.3); }

    /* 5. INPUTS Y ELEMENTOS DE FORMULARIO (PROFESIONALES Y LIMPIOS) */
    
    /* Botones Estilo Morado SaaS */
    .stButton>button {
        background-color: #4F46E5 !important;
        color: #FFFFFF !important;
        border: none !important;
        border-radius: 10px !important;
        font-weight: 600 !important;
        padding: 12px 24px !important;
        transition: all 0.3s ease !important;
        font-family: 'Poppins', sans-serif;
    }
    .stButton>button:hover {
        background-color: #4338CA !important;
        box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3) !important;
    }
    
    /* Inputs de texto, números y Sliders */
    .stNumberInput input, .stTextInput input, .stSelectbox select {
        border-radius: 8px !important;
        border: 1px solid #D1D5DB !important;
        background-color: #FFFFFF !important;
        color: #1E293B !important;
    }
    
    /* Sliders Morados */
    [data-testid="stWidgetLabel"] {
        color: #475569 !important;
        font-weight: 500;
    }
    .stSlider .stSliderTickBar, .stSlider .stSliderTrack, .stSlider .stSliderThumb {
        color: #4F46E5 !important;
    }

    /* 6. LIMPIEZA DE INTERFAZ NATIVA Y AJUSTE DE MÓVIL */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {background-color: transparent !important;}
    
    /* Botón de menú en móviles (Verde neón para que resalte un poco) */
    [data-testid="collapsedControl"] {
        color: #10B981 !important;
        background-color: #FFFFFF !important;
        border: 1px solid #E2E8F0;
        border-radius: 5px;
        padding: 5px;
    }

    /* 7. AJUSTE DE FÓRMULAS Y DATAFRAMES PARA FONDO CLARO */
    div.stDataframe th {
        background-color: #F1F5F9 !important;
        color: #1E293B !important;
    }
    div.stDataframe td {
        background-color: #FFFFFF !important;
        color: #1E293B !important;
    }
    
    </style>
    """, unsafe_allow_html=True)
