import streamlit as st

def cargar_estilos_premium():
    st.markdown("""
    <style>
    /* 1. Canvas de Fondo Negro/Azul Medianoche */
    .stApp {
        background-color: #020617;
        background-image: 
            radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px),
            radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 2px),
            radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 3px);
        background-size: 550px 550px, 350px 350px, 250px 250px;
        background-position: 0 0, 40px 60px, 130px 270px;
        overflow: hidden;
    }
    
    /* 2. Lógica de las Estrellas Fugaces (Líneas de Luz) */
    .stApp::before, .stApp::after {
        content: "";
        position: absolute;
        top: -100px;
        width: 2px;
        height: 150px;
        background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(0,255,170,1));
        animation: shootingStar 4s linear infinite;
        opacity: 0;
    }

    .stApp::after {
        left: 40%;
        animation-delay: 2s;
        height: 100px;
        background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(59,130,246,1));
    }

    @keyframes shootingStar {
        0% { transform: translateY(0) rotate(45deg); opacity: 0; }
        10% { opacity: 1; }
        30% { transform: translateY(100vh) rotate(45deg); opacity: 0; }
        100% { transform: translateY(100vh) rotate(45deg); opacity: 0; }
    }

    /* 3. Estilos de Interfaz (Glassmorphism para que resalte) */
    [data-testid="stSidebar"] {
        background-color: rgba(15, 23, 42, 0.6) !important;
        backdrop-filter: blur(15px);
        border-right: 1px solid rgba(255, 255, 255, 0.05);
    }

    div[data-testid="stVerticalBlock"] div[style*="border"] {
        background: rgba(30, 41, 59, 0.7) !important;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 255, 170, 0.2) !important;
        border-radius: 10px;
        color: white;
    }
    h1, h2, h3, p { color: white !important; }
    #MainMenu, header, footer {visibility: hidden;}
    </style>
    """, unsafe_allow_html=True)