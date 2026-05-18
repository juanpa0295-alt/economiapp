import streamlit as st

def cargar_estilos_premium():
    st.markdown("""
    <style>
    /* 1. Fondo Oscuro Profundo */
    .stApp {
        background-color: #040914;
        background-image: 
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2300ffa8' fill-opacity='0.03'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9H16v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9H16v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9H16v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9h9v-9h1v9H16z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        background-size: cover;
        background-attachment: fixed;
    }

    /* 2. Estilos de Interfaz (Glassmorphism Profesional) */
    [data-testid="stSidebar"] {
        background-color: rgba(10, 18, 42, 0.7) !important;
        backdrop-filter: blur(15px);
        border-right: 1px solid rgba(0, 255, 170, 0.1);
    }

    div[data-testid="stVerticalBlock"] div[style*="border"] {
        background: rgba(20, 30, 60, 0.6) !important;
        backdrop-filter: blur(12px);
        border: 1px solid rgba(0, 255, 170, 0.15) !important;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
    }

    /* 3. Tipografía y Colores */
    h1, h2, h3, h4 { color: white !important; font-weight: 700 !important; }
    p, li, span { color: #d1d5db !important; }
    h1 { text-shadow: 0 0 10px rgba(0,255,170,0.3); }

    /* 4. LIMPIEZA DE INTERFAZ NATIVA Y BOTÓN DE MÓVIL */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {background-color: transparent !important;}
    
    /* Hacer el botón de menú en móviles más visible (Verde neón) */
    [data-testid="collapsedControl"] {
        color: #00FFAA !important;
        background-color: rgba(10, 18, 42, 0.8) !important;
        border: 1px solid #00FFAA;
        border-radius: 5px;
    }

    /* Botones Estilo FinTech */
    .stButton>button {
        background-color: transparent !important;
        color: #00FFAA !important;
        border: 2px solid #00FFAA !important;
        border-radius: 20px !important;
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        background-color: #00FFAA !important;
        color: #020617 !important;
        box-shadow: 0 0 15px rgba(0,255,170,0.5);
    }
    </style>
    """, unsafe_allow_html=True)
