# Genera las imágenes de vista previa (1200×630) que aparecen al compartir un enlace por WhatsApp, redes, etc.
# Uso: python3 fuente/sitio/og.py   (requiere Pillow). Lee og/materias.json, que escribe build.py.
import json, os, re
from PIL import Image, ImageDraw, ImageFont
S = os.path.dirname(os.path.abspath(__file__)); D = os.path.join(S, "og")
B = ImageFont.truetype(os.path.join(D, "fuentes", "montserrat-v14-latin-700.ttf"), 10)
fb = lambda n: ImageFont.truetype(os.path.join(D, "fuentes", "montserrat-v14-latin-700.ttf"), n)
fr = lambda n: ImageFont.truetype(os.path.join(D, "fuentes", "montserrat-v14-latin-regular.ttf"), n)
INK, CARD = (27, 36, 48), (248, 249, 245)
hexc = lambda h: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
icono = Image.open(os.path.join(S, "iconos", "icon-192.png")).convert("RGBA").resize((72, 72), Image.LANCZOS)

def envolver(d, txt, font, ancho):
    lin, cur = [], ""
    for w in txt.split(" "):
        t = (cur + " " + w).strip()
        if d.textlength(t, font=font) <= ancho: cur = t
        else: lin.append(cur); cur = w
    lin.append(cur); return lin

def tarjeta(nombre, titulo, sub, c1, c2, kicker):
    W, H = 1200, 630
    im = Image.new("RGB", (W, H), INK); d = ImageDraw.Draw(im)
    # líneas de metro decorativas a la derecha
    for k, (col, y0) in enumerate([(c2, 140), (c1, 300), ((245, 183, 49), 460)]):
        pts = [(760, y0), (900, y0), (1010, y0 + (1 - k) * 90), (1260, y0 + (1 - k) * 90)]
        d.line(pts, fill=col, width=26, joint="curve")
        for x, y in (pts[1], pts[2]):
            d.ellipse([x - 22, y - 22, x + 22, y + 22], fill=CARD, outline=col, width=9)
    d.rectangle([0, 0, 14, H], fill=c1)
    d.text((80, 92), kicker.upper(), font=fr(26), fill=(170, 182, 196))
    size = 84
    while size > 40:
        f = fb(size); lines = envolver(d, titulo, f, 640)
        if len(lines) <= 3 and all(d.textlength(l, font=f) <= 640 for l in lines): break
        size -= 4
    subl = envolver(d, sub, fr(30), 640)[:3]
    alto = len(lines) * int(size * 1.12) + 18 + len(subl) * 42
    y = max(140, 150 + (330 - alto) // 2)
    for l in lines:
        d.text((80, y), l, font=f, fill=CARD); y += int(size * 1.12)
    y += 18
    for l in subl:
        d.text((80, y), l, font=fr(30), fill=(205, 213, 222)); y += 42
    im.paste(icono, (80, H - 120), icono)
    d.text((170, H - 104), "economiapp.app", font=fb(34), fill=CARD)
    im.save(os.path.join(D, nombre + ".png"), optimize=True)

tarjeta("portada", "Las materias de Economía como líneas de metro", "Lecciones, laboratorios y simulacros. Gratis y sin internet.",
        (64, 196, 170), (239, 108, 84), "Economiapp")
for m in json.load(open(os.path.join(D, "materias.json"), encoding="utf-8")):
    c = [hexc(x) for x in m["c"]]
    claro = tuple(min(255, int(v * 0.45 + 255 * 0.55)) for v in c[0])
    tarjeta(m["slug"], re.sub(r" (I{1,3}|IV|[0-9])$", "\u00a0\\1", m["h1"]), "Lecciones, laboratorios y simulacros paso a paso.", c[2], claro, "Economiapp · Ruta de estudio")
print("listo")
