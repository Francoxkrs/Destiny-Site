"""Filtro 'arte rupestre': transforma uma imagem em pintura de pigmento sobre pedra.
uso: python3 scripts-rupestre.py entrada.png public/img/criaturas/<slug>.jpg [seed] [foco_y 0-1] [contraste local, 1.0]
Requer Pillow e numpy. Recorta em 4:3 (1200x900) e pinta como ocre e carvão sobre pedra.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter, ImageOps

W, H = 1200, 900
LC = 1.0

def cover(img, fy=0.5):
    img = img.convert('RGB')
    r = max(W / img.width, H / img.height)
    img = img.resize((round(img.width * r), round(img.height * r)), Image.LANCZOS)
    x = (img.width - W) // 2
    y = int((img.height - H) * fy)
    return img.crop((x, y, x + W, y + H))

def noise(rng, octaves=6, base=4):
    out = np.zeros((H, W), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        n = base * 2 ** o
        g = rng.random((n * 3 // 4 + 2, n + 2)).astype(np.float32)
        im = Image.fromarray((g * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
        out += amp * np.asarray(im, np.float32) / 255
        tot += amp
        amp *= 0.55
    return out / tot

def rock(rng):
    n = noise(rng, 7, 3)
    n2 = noise(rng, 5, 10)
    base = np.array([196, 160, 112], np.float32)   # arenito
    dark = np.array([92, 64, 40], np.float32)
    t = np.clip((n - 0.25) * 1.6, 0, 1)[..., None]
    col = dark + (base - dark) * t
    # fissuras: vales finos do ruído
    crack = np.abs(n2 - 0.5) < 0.004
    col[crack] *= 0.6
    # pintas de mineral
    speck = rng.random((H, W)) > 0.996
    col[speck] = [230, 214, 180]
    grain = (rng.random((H, W, 1)) - 0.5) * 26
    return np.clip(col + grain, 0, 255), n

PAL = {
    'carvao': np.array([34, 22, 16], np.float32),
    'sangue': np.array([138, 40, 22], np.float32),
    'umbra':  np.array([96, 54, 30], np.float32),
    'ocre':   np.array([184, 118, 46], np.float32),
    'giz':    np.array([232, 220, 196], np.float32),
}

def main(src, dst, seed=1, fy=0.5):
    rng = np.random.default_rng(seed)
    img = cover(Image.open(src), fy)
    # formas em manchas (pincel grosso)
    soft = img.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.ModeFilter(5))
    a = np.asarray(soft, np.float32) / 255
    L = 0.3 * a[..., 0] + 0.59 * a[..., 1] + 0.11 * a[..., 2]
    Lb = np.asarray(Image.fromarray((L * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(45)), np.float32) / 255
    L = np.clip(L + LC * (L - Lb), 0, 1)
    L = np.asarray(ImageOps.equalize(Image.fromarray((L * 255).astype(np.uint8))), np.float32) / 255
    mx, mn = a.max(-1), a.min(-1)
    sat = (mx - mn) / (mx + 1e-4)
    warm = (a[..., 0] > a[..., 2] + 0.08) & (sat > 0.3)

    bg, n = rock(rng)
    # mapa de gradiente em pigmentos de terra (mantém a leitura da forma)
    Lq = np.round(L * 6) / 6 * 0.7 + L * 0.3
    stops = [0.0, 0.3, 0.55, 0.78, 1.0]
    cols = [PAL['carvao'], PAL['umbra'], PAL['ocre'], np.array([206, 170, 120], np.float32), np.array([236, 214, 178], np.float32)]
    paint = np.zeros((H, W, 3), np.float32)
    for k in range(3):
        paint[..., k] = np.interp(Lq, stops, [c[k] for c in cols])
    wm = (warm & (L > 0.15) & (L < 0.8)).astype(np.float32)
    wm = np.asarray(Image.fromarray((wm * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2)), np.float32)[..., None] / 255
    paint = paint * (1 - 0.75 * wm) + PAL['sangue'] * 0.75 * wm
    hi = ((L > 0.9) & (sat > 0.25)).astype(np.float32)[..., None]
    paint = paint * (1 - hi) + PAL['giz'] * hi
    # pedra por baixo: a tinta pega a textura e descasca em pontos
    rockL = bg / bg.mean(axis=(0, 1))
    out = paint * (0.82 + 0.18 * rockL)
    flake = noise(rng, 4, 40)
    fm = np.clip((0.3 - flake) * 6, 0, 1)[..., None] * 0.7
    out = out * (1 - fm) + bg * fm
    # contorno a carvão
    g = Image.fromarray((L * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))
    e = np.asarray(g.filter(ImageFilter.FIND_EDGES), np.float32) / 255
    e = np.asarray(Image.fromarray((np.clip(e * 9, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.8)), np.float32) / 255
    e *= np.clip((noise(rng, 4, 30) - 0.2) * 2.5, 0, 1)
    out = out * (1 - 0.6 * e[..., None]) + PAL['carvao'] * 0.6 * e[..., None]

    # vinheta de caverna (luz de tocha)
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.sqrt(((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H * 0.48) / (H * 0.62)) ** 2)
    v = np.clip(1.2 - 0.6 * d ** 2.4, 0.45, 1)[..., None]
    torch = np.array([1.04, 0.97, 0.86], np.float32)
    out = np.clip(out * v * torch, 0, 255)
    Image.fromarray(out.astype(np.uint8)).save(dst, quality=84, optimize=True, progressive=True)

if __name__ == '__main__':
    if len(sys.argv) > 5: LC = float(sys.argv[5])
    main(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 1, float(sys.argv[4]) if len(sys.argv) > 4 else 0.5)
