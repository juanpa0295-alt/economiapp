import streamlit as st

def cargar_estilos_premium():
    st.markdown("""
    <style>
    /* 1. IMPORTACIÓN DE FUENTES EXCLUSIVAS (Syne y Lexend) */
    /* Syne es muy distinct y Lexend es altamente legible pero única */
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Lexend+Deca:wght@300;400;500;600&display=swap');

    /* 2. EL CANVAS ANALÍTICO (Fondo Vibrante y Texturizado) */
    /* Fondo que simula una red neuronal sutil con un degradado rico */
    .stApp {
        background-color: #FFFFFF;
        background-image: 
            radial-gradient(at 10% 20%, rgba(99, 102, 241, 0.08) 0px, transparent 50%), 
            radial-gradient(at 90% 80%, rgba(20, 184, 166, 0.08) 0px, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43 0c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm28-65c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm23-11c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%236366f1' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
        background-attachment: fixed;
    }
    
    /* Configuración global de textos y fuentes */
    h1, h2, h3, h4, h5, h6 {
        font-family: 'Syne', sans-serif !important;
        color: #111827 !important;
        font-weight: 800 !important;
        letter-spacing: -1.5px;
    }
    
    p, li, span, label, td, th {
        font-family: 'Lexend Deca', sans-serif;
        color: #1F2937 !important;
        font-size: 1.05rem !important;
        font-weight: 400;
    }

    /* 3. ESTILOS DE LA BARRA LATERAL (SIDEBAR) - Identidad Fuerte */
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%) !important;
        border-right: 2px solid #E2E8F0;
        box-shadow: 4px 0 15px rgba(0,0,0,0.03);
    }
    
    [data-testid="stSidebarNav"] ul li a {
        border-radius: 12px;
        transition: all 0.2s ease;
        padding: 10px 15px;
        margin: 5px 10px;
    }
    
    [data-testid="stSidebarNav"] ul li a:hover {
        background-color: rgba(99, 102, 241, 0.05) !important;
        color: #4F46E5 !important;
        transform: translateX(3px);
    }
    
    [data-testid="stSidebarNav"] ul li a[aria-current="page"] {
        background-color: #6366F1 !important;
        color: #FFFFFF !important;
        font-weight: 600;
        box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3);
    }
    
    /* Iconos del sidebar blancos cuando activos */
    [data-testid="stSidebarNav"] ul li a[aria-current="page"] svg {
        fill: #FFFFFF !important;
    }

    /* 4. ESTILO DE TARJETAS DE MÓDULO (LAB-CARDS) */
    /* Aquí es donde arreglamos la armonía general */
    div[data-testid="stVerticalBlock"] div[style*="border"] {
        background-color: #FFFFFF !important;
        border: 2px solid #F1F5F9 !important;
        border-radius: 24px !important; /* Esquinas muy redondeadas */
        padding: 40px !important;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02) !important; /* Sombra suave para dar profundidad */
        color: #1E293B !important;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    div[data-testid="stVerticalBlock"] div[style*="border"]:hover {
        transform: translateY(-5px);
        box-shadow: 0 25px 35px -5px rgba(0, 0, 0, 0.08) !important;
        border-color: rgba(99, 102, 241, 0.1) !important;
    }
    
    /* Neon glow effect para títulos principales (Vibrante) */
    h1 { text-shadow: 0 0 10px rgba(0,255,170,0.3); }

    /* Títulos de tarjeta vibrantes */
    div[data-testid="stVerticalBlock"] div[style*="border"] h4 {
        color: #6366F1 !important;
        margin-bottom: 20px;
    }

    /* 5. INPUTS Y BOTONES ESTILO LAB-TECH */
    
    /* Botones con degradado vibrante */
    .stButton>button {
        background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%) !important;
        color: #FFFFFF !important;
        border: none !important;
        border-radius: 12px !important;
        font-weight: 600 !important;
        font-family: 'Syne', sans-serif;
        padding: 14px 28px !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3) !important;
    }
    .stButton>button:hover {
        box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4) !important;
        transform: translateY(-2px);
    }
    
    /* Inputs refinados */
    .stNumberInput input, .stTextInput input, .stSelectbox select {
        border-radius: 10px !important;
        border: 2px solid #E2E8F0 !important;
        background-color: #FFFFFF !important;
        color: #111827 !important;
        padding: 10px !important;
    }
    .stNumberInput input:focus {
        border-color: #6366F1 !important;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
    }
    
    /* Sliders Coloridos */
    .stSlider .stSliderTrack { background-color: #E2E8F0 !important; }
    .stSlider .stSliderTickBar, .stSlider .stSliderThumb {
        color: #6366F1 !important;
    }

    /* 6. LIMPIEZA TOTAL */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {background-color: transparent !important;}
    
    /* Botón de menú en móviles Estilo Tech */
    [data-testid="collapsedControl"] {
        color: #6366F1 !important;
        background-color: #FFFFFF !important;
        border: 2px solid #E2E8F0;
        border-radius: 8px;
        padding: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }

    /* 7. ESTILOS EXCLUSIVOS PARA LA MATRIZ DE TEORÍA DE JUEGOS */
    /* Esta es la clase que aplicaremos en el archivo de Teoría de Juegos */
    .bimatrix-container table {
        width: 100% !important; /* Cubre toda la extensión */
        border-collapse: collapse !important;
        margin: 20px 0 !important;
        font-family: 'Lexend Deca', sans-serif !important;
    }
    
    .bimatrix-container th, .bimatrix-container td {
        border: 2px solid #E2E8F0 !important; /* Borde sutil como en la imagen */
        padding: 20px !important;
        text-align: center !important;
        width: 33.33% !important; /* Tercios perfectos */
    }
    
    /* Estilo de encabezados (Gris/Azul neutro) */
    .bimatrix-container th {
        background-color: #F8FAFC !important;
        color: #475569 !important;
        font-weight: 600 !important;
    }
    
    /* El encabezado de la esquina */
    .bimatrix-container th.diagonal-header {
        background-color: #F1F5F9 !important;
        color: #1E293B !important;
        font-weight: 700 !important;
    }

    /* Estilo de los Payoffs */
    /* Payoff Jugador 1 (Azul #3B82F6) */
    .bimatrix-payoff-1 {
        color: #3B82F6 !important;
        font-weight: 700 !important;
        font-size: 1.2rem !important;
    }
    
    /* Payoff Jugador 2 (Verde #10B981) */
    .bimatrix-payoff-2 {
        color: #10B981 !important;
        font-weight: 700 !important;
        font-size: 1.2rem !important;
    }
    
    /* Las comas de separación */
    .bimatrix-comma {
        color: #94A3B8 !important;
        margin: 0 3px;
    }
    
    </style>
    """, unsafe_allow_html=True)