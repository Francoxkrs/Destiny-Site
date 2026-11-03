# Gera os brasões do Black Destiny em SVG (public/img/brasoes/<slug>.svg).
# Cada brasão = escudo (forma pela classe social) + marca de origem + emblema da família.
import math, os, unicodedata, re

INK, BONE, RED, GOLD, VIOLET = '#111113', '#ebe4d4', '#ff3b2e', '#dcb465', '#b77bff'
OUT = os.path.join(os.path.dirname(__file__), 'public', 'img', 'brasoes')

def slug(s):
    s = unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

SHIELD = {
    'Realeza': 'M24,52 H176 V128 C176,182 140,212 100,230 C60,212 24,182 24,128 Z',
    'Nobreza': 'M24,52 L88,52 L100,62 L112,52 L176,52 V128 C176,182 140,212 100,230 C60,212 24,182 24,128 Z',
    'Plebe':   'M30,56 H170 V140 A70,78 0 0 1 30,140 Z',
    'Ordem':   'M24,52 L100,40 L176,52 V128 C176,182 140,212 100,230 C60,212 24,182 24,128 Z',
}

def crown(c=BONE, j=RED):
    return (f'<path d="M62,46 L62,16 L82,32 L100,8 L118,32 L138,16 L138,46 Z" fill="{c}"/>'
            f'<circle cx="100" cy="22" r="3.5" fill="{j}"/><circle cx="73" cy="32" r="2.6" fill="{j}"/><circle cx="127" cy="32" r="2.6" fill="{j}"/>')

def nobre():
    return (f'<path d="M70,40 Q100,22 130,40" fill="none" stroke="{BONE}" stroke-width="3"/>'
            f'<circle cx="70" cy="40" r="3" fill="{BONE}"/><circle cx="130" cy="40" r="3" fill="{BONE}"/><circle cx="100" cy="28" r="3.5" fill="{RED}"/>')

def plebe():
    return f'<path d="M82,46 L100,34 L118,46" fill="none" stroke="{BONE}" stroke-width="3" stroke-linejoin="round"/>'

# marcas de origem (desenhadas, sem depender de fonte), centradas em 0,0, ~14px
def m_club():  return f'<g fill="{RED}"><circle cx="0" cy="-5" r="4.4"/><circle cx="-5" cy="2" r="4.4"/><circle cx="5" cy="2" r="4.4"/><path d="M-1.5,2 L1.5,2 L3,10 L-3,10 Z"/></g>'
def m_spade(): return f'<path fill="{RED}" d="M0,-9 C6,-3 10,0 9,4 C8,8 3,8 1,5 L3,10 L-3,10 L-1,5 C-3,8 -8,8 -9,4 C-10,0 -6,-3 0,-9 Z"/>'
def m_heart(): return f'<path fill="{RED}" d="M0,9 C-6,4 -10,0 -10,-4 C-10,-9 -3,-10 0,-5 C3,-10 10,-9 10,-4 C10,0 6,4 0,9 Z"/>'
def m_diam():  return f'<path fill="{RED}" d="M0,-10 L8,0 L0,10 L-8,0 Z"/>'
def m_star():  return f'<path fill="{RED}" d="M0,-10 L2.5,-2.5 L10,0 L2.5,2.5 L0,10 L-2.5,2.5 L-10,0 L-2.5,-2.5 Z"/>'
ORIGEM = {'Clover': m_club, 'Spades': m_spade, 'Heart': m_heart, 'Diamond': m_diam}

S = f'fill="none" stroke="{BONE}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"'
SR = f'fill="none" stroke="{RED}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"'

def rays(n, r0, r1, col=BONE, w=3, off=0):
    out = ''
    for i in range(n):
        a = off + i * 2 * math.pi / n
        out += f'<line x1="{r0*math.cos(a):.1f}" y1="{r0*math.sin(a):.1f}" x2="{r1*math.cos(a):.1f}" y2="{r1*math.sin(a):.1f}" stroke="{col}" stroke-width="{w}" stroke-linecap="round"/>'
    return out

E = {}
E['kira'] = (f'<path d="M0,-36 V32 M-18,34 H18 M-36,-22 H36 M-36,-22 L-46,4 M-36,-22 L-26,4 M36,-22 L26,4 M36,-22 L46,4" {S}/>'
             f'<circle cx="0" cy="-38" r="5" fill="{RED}"/><path d="M-48,4 A13,9 0 0 0 -24,4 Z M24,4 A13,9 0 0 0 48,4 Z" fill="{BONE}"/>')
E['vermillion'] = (f'<path fill="{BONE}" d="M0,-44 C14,-24 30,-12 27,12 C24,32 11,42 0,42 C-11,42 -25,32 -27,12 C-29,-4 -17,-12 -12,-28 C-6,-16 -4,-10 0,-8 C4,-20 3,-32 0,-44 Z"/>'
                   f'<path fill="{RED}" d="M0,-6 C8,6 14,14 12,24 C10,34 4,38 0,38 C-4,38 -11,33 -12,24 C-13,14 -6,8 0,-6 Z"/>')
E['silva'] = (f'<path fill="{BONE}" d="M0,-42 C12,-24 22,-12 22,0 A22,22 0 0 1 -22,0 C-22,-12 -12,-24 0,-42 Z"/>'
              f'<circle cx="-7" cy="-2" r="5" fill="{INK}"/>'
              f'<path d="M-38,32 q9.5,-8 19,0 t19,0 t19,0 t19,0" {S}/><path d="M-30,44 q7.5,-6 15,0 t15,0 t15,0 t15,0" {SR}/>')
E['grinberryal'] = (f'<circle r="16" fill="{BONE}"/>' + rays(12, 22, 34) +
                    f'<circle cx="32" cy="-30" r="14" fill="{RED}"/><circle cx="39" cy="-35" r="11.5" fill="{INK}"/>')
E['lolopechka'] = (f'<path fill="{BONE}" d="M0,-44 C14,-24 26,-10 26,6 A26,26 0 0 1 -26,6 C-26,-10 -14,-24 0,-44 Z"/>'
                   f'<path fill="{RED}" d="M0,22 C-7,16 -12,11 -12,5 C-12,-1 -4,-3 0,3 C4,-3 12,-1 12,5 C12,11 7,16 0,22 Z"/>')
E['zogratis'] = (f'<path d="M0,-40 L38,30 H-38 Z" {S}/><path d="M-18,8 Q0,-10 18,8 Q0,24 -18,8 Z" fill="{BONE}"/>'
                 f'<circle cx="0" cy="8" r="6" fill="{RED}"/><circle cx="0" cy="8" r="2" fill="{INK}"/>'
                 f'<circle cx="-30" cy="-30" r="3" fill="{RED}"/><circle cx="30" cy="-30" r="3" fill="{RED}"/><circle cx="0" cy="44" r="3" fill="{RED}"/>')
E['faust'] = (f'<circle r="32" {S}/><path d="M0,-32 A32,32 0 0 1 0,32 A16,16 0 0 1 0,0 A16,16 0 0 0 0,-32 Z" fill="{BONE}"/>'
              f'<circle cx="0" cy="16" r="5" fill="{INK}"/><circle cx="0" cy="-16" r="5" fill="{RED}"/>')
def helix():
    a = ''; b = ''; rungs = ''
    for i in range(0, 41):
        y = -40 + i * 2
        x = 18 * math.sin(y / 40 * math.pi * 1.5)
        a += f'{"M" if i == 0 else "L"}{x:.1f},{y} '
        b += f'{"M" if i == 0 else "L"}{-x:.1f},{y} '
        if i % 5 == 2: rungs += f'<line x1="{x:.1f}" y1="{y}" x2="{-x:.1f}" y2="{y}" stroke="{RED}" stroke-width="3"/>'
    return rungs + f'<path d="{a}" {S}/><path d="{b}" {S}/>'
E['libardirt'] = helix()
def blossom():
    out = ''
    for i in range(5):
        ang = i * 72
        out += f'<path transform="rotate({ang})" fill="{BONE}" d="M0,-6 C-12,-18 -12,-34 -4,-40 L0,-34 L4,-40 C12,-34 12,-18 0,-6 Z"/>'
    return out + f'<circle r="8" fill="{RED}"/>' + rays(5, 10, 16, INK, 2, -math.pi/2)
E['vangeance'] = blossom()
E['boismortier'] = (f'<g transform="rotate(40)"><rect x="-4" y="-6" width="8" height="48" rx="3" fill="{BONE}"/><rect x="-6" y="-14" width="12" height="9" fill="{BONE}"/>'
                    f'<path fill="{RED}" d="M-6,-14 C-8,-28 -3,-38 0,-46 C3,-38 8,-28 6,-14 Z"/></g>'
                    f'<circle cx="-24" cy="20" r="5" fill="{RED}"/><circle cx="-30" cy="4" r="4" fill="{BONE}"/><circle cx="-16" cy="34" r="4" fill="{BONE}"/>')
E['voltia'] = f'<path fill="{BONE}" d="M8,-46 L-22,4 L-2,4 L-12,46 L22,-8 L2,-8 L16,-46 Z"/><path d="M-30,-30 L-22,-22 M30,22 L38,30" {SR}/>'
E['roselei'] = (f'<path d="M0,10 V46 M0,26 C-12,22 -18,30 -22,36 M0,34 C10,30 16,36 20,42 M-4,18 L-9,15 M4,40 L9,38" {S}/>'
                f'<circle cx="0" cy="-12" r="24" fill="{RED}"/>'
                f'<path d="M0,-12 m-4,0 a4,4 0 1 1 8,0 a8,8 0 1 1 -16,0 a12,12 0 1 1 24,0 a16,16 0 1 1 -32,2" fill="none" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>')
E['agrippa'] = (f'<path d="M-24,40 C-48,22 22,14 0,-4 C-22,-20 30,-28 12,-38" fill="none" stroke="{BONE}" stroke-width="9" stroke-linecap="round"/>'
                f'<circle cx="12" cy="-38" r="8" fill="{BONE}"/><circle cx="15" cy="-40" r="2" fill="{INK}"/><path d="M18,-34 L26,-30 L30,-34 M26,-30 L28,-25" {SR}/>'
                f'<path fill="{RED}" d="M34,18 C38,24 40,28 40,31 A6,6 0 0 1 28,31 C28,28 30,24 34,18 Z"/>')
E['ideale'] = (f'<path fill="{BONE}" d="M-8,0 H8 L4,44 H-4 Z"/><rect x="-12" y="-6" width="24" height="8" fill="{BONE}"/>'
               f'<path fill="{RED}" d="M0,-44 C10,-30 16,-22 14,-14 C12,-8 6,-6 0,-6 C-6,-6 -12,-8 -14,-14 C-15,-22 -6,-28 -4,-36 C-2,-30 -1,-26 0,-26 C2,-32 1,-38 0,-44 Z"/>'
               f'<path d="M-22,-30 C-30,-38 -22,-46 -30,-52 M22,-26 C30,-34 22,-42 30,-48" fill="none" stroke="{BONE}" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>')
E['lichita'] = (f'<path d="M-8,-38 A8,8 0 0 1 8,-38 M-16,-30 H16 M-14,-30 V30 M14,-30 V30 M-18,30 H18 M-10,40 H10" {S}/>'
                f'<path fill="{RED}" d="M0,-16 C6,-6 10,0 9,8 C8,14 4,18 0,18 C-4,18 -8,14 -9,8 C-10,0 -6,-6 0,-16 Z"/>')
E['sukehiro'] = (f'<path d="M30,-40 C14,-18 -2,0 -16,14" fill="none" stroke="{BONE}" stroke-width="6" stroke-linecap="round"/>'
                 f'<ellipse cx="-18" cy="16" rx="11" ry="4" transform="rotate(45 -18 16)" fill="{BONE}"/>'
                 f'<path d="M-22,22 L-40,40" stroke="{RED}" stroke-width="8" stroke-linecap="round"/>'
                 f'<path d="M-28,28 l4,-4 M-34,34 l4,-4" stroke="{INK}" stroke-width="2"/>')
E['swallowtail'] = (f'<path fill="{BONE}" d="M0,-4 C-10,-30 -40,-40 -42,-22 C-44,-8 -24,-2 0,-4 Z M0,-4 C10,-30 40,-40 42,-22 C44,-8 24,-2 0,-4 Z"/>'
                    f'<path fill="{BONE}" d="M0,0 C-20,2 -34,14 -26,26 L-30,42 L-20,30 C-12,26 -4,14 0,0 Z M0,0 C20,2 34,14 26,26 L30,42 L20,30 C12,26 4,14 0,0 Z"/>'
                    f'<path d="M0,-12 V22" stroke="{RED}" stroke-width="5" stroke-linecap="round"/><path d="M0,-12 L-6,-24 M0,-12 L6,-24" {SR}/>'
                    f'<circle cx="-30" cy="-20" r="4" fill="{INK}"/><circle cx="30" cy="-20" r="4" fill="{INK}"/>')
def stitches():
    out = f'<path d="M-34,-34 L34,34 M34,-34 L-34,34" {S}/>'
    for t in (-22, -10, 10, 22):
        out += f'<path d="M{t-5},{t+5} L{t+5},{t-5}" stroke="{RED}" stroke-width="3" stroke-linecap="round"/>'
        out += f'<path d="M{-t-5},{t-5} L{-t+5},{t+5}" stroke="{RED}" stroke-width="3" stroke-linecap="round"/>'
    return out + f'<circle cx="-40" cy="0" r="6" fill="{BONE}"/><circle cx="40" cy="0" r="6" fill="{BONE}"/>'
E['frankenstein'] = stitches()
E['pappitson'] = (f'<g transform="rotate(-30)"><rect x="-3.5" y="-20" width="7" height="62" rx="3" fill="{BONE}"/><rect x="-22" y="-36" width="44" height="18" rx="2" fill="{BONE}"/>'
                  f'<rect x="-22" y="-36" width="8" height="18" fill="{RED}"/></g>')
E['alonargez'] = (f'<path d="M-44,40 L-14,-4 L2,14 L18,-10 L44,40 Z" fill="{BONE}"/><path d="M-14,-4 L-6,6 L2,14" fill="none" stroke="{INK}" stroke-width="2"/>'
                  f'<path d="M-30,-30 Q0,-48 30,-30" {SR}/><path d="M0,-40 L-8,-4" stroke="{RED}" stroke-width="4" stroke-linecap="round"/>')
E['enoteca'] = (f'<rect x="-18" y="-24" width="36" height="8" fill="{BONE}"/><rect x="-18" y="20" width="36" height="8" fill="{BONE}"/>'
                f'<rect x="-12" y="-16" width="24" height="36" fill="{RED}"/><path d="M-12,-10 H12 M-12,-2 H12 M-12,6 H12 M-12,14 H12" stroke="{INK}" stroke-width="1.5"/>'
                f'<path d="M14,10 C34,6 40,-20 26,-34 C18,-42 4,-40 -2,-44" fill="none" stroke="{RED}" stroke-width="2.5"/>'
                f'<path d="M-40,40 L-4,-44" stroke="{BONE}" stroke-width="3" stroke-linecap="round"/><ellipse cx="-6" cy="-38" rx="1.6" ry="4" transform="rotate(23 -6 -38)" fill="{INK}"/>')
def hexa(r):
    return ' '.join(f'{r*math.cos(math.pi/6+i*math.pi/3):.1f},{r*math.sin(math.pi/6+i*math.pi/3):.1f}' for i in range(6))
E['trinity'] = (f'<polygon points="{hexa(42)}" {S}/><polygon points="{hexa(29)}" {S}/><polygon points="{hexa(16)}" fill="{RED}"/>')
E['unsworth'] = (f'<circle cx="-6" cy="0" r="34" fill="{BONE}"/><circle cx="8" cy="-8" r="29" fill="{INK}"/>'
                 f'<g fill="{RED}"><path d="M28,-24 l2.5,6 6,2.5 -6,2.5 -2.5,6 -2.5,-6 -6,-2.5 6,-2.5Z"/><path d="M36,10 l2,4.5 4.5,2 -4.5,2 -2,4.5 -2,-4.5 -4.5,-2 4.5,-2Z"/><path d="M18,-2 l1.5,3.5 3.5,1.5 -3.5,1.5 -1.5,3.5 -1.5,-3.5 -3.5,-1.5 3.5,-1.5Z"/></g>')
E['licht'] = (rays(16, 22, 40, RED, 2.5) + f'<path fill="{BONE}" d="M0,-46 L5,-36 V14 H-5 V-36 Z"/><rect x="-18" y="14" width="36" height="6" fill="{BONE}"/>'
              f'<rect x="-3.5" y="20" width="7" height="18" fill="{BONE}"/><circle cx="0" cy="42" r="4.5" fill="{BONE}"/>')
# ordens
def radiant(col):
    pts = []
    for i in range(16):
        r = 42 if i % 2 == 0 else 16
        a = -math.pi/2 + i * math.pi / 8
        pts.append(f'{r*math.cos(a):.1f},{r*math.sin(a):.1f}')
    return f'<polygon points="{" ".join(pts)}" fill="{col}"/>'
E['generais-brilhantes'] = (radiant(GOLD) + f'<path fill="{INK}" d="M0,-30 L4,-22 V18 H-4 V-22 Z"/><rect x="-14" y="16" width="28" height="5" fill="{INK}"/><rect x="-3" y="21" width="6" height="12" fill="{INK}"/>')
E['veio-negro'] = (f'<path d="M0,-44 L32,0 L0,44 L-32,0 Z" fill="{INK}" stroke="{BONE}" stroke-width="4" stroke-linejoin="round"/>'
                   f'<path d="M-32,0 H32 M-14,-24 L-8,0 L0,44 M14,-24 L8,0 L0,44" fill="none" stroke="{BONE}" stroke-width="1.5" opacity=".5"/>'
                   f'<path d="M2,-44 L-6,-24 L6,-12 L-4,4 L8,18 L-2,32 L2,44" fill="none" stroke="{VIOLET}" stroke-width="4" stroke-linejoin="round"/>')

def brasao(key, classe, origem=None, borda=RED, topo=None):
    sh = SHIELD[classe]
    top = topo if topo is not None else {'Realeza': crown(), 'Nobreza': nobre(), 'Plebe': plebe()}.get(classe, '')
    mark = ''
    if origem is not None:
        fn = ORIGEM.get(origem, m_star)
        mark = f'<g transform="translate(100,82)">{fn()}</g>'
    cy = 150 if origem is not None else 140
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="200" height="240">
<defs><pattern id="d" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r=".8" fill="{BONE}" opacity=".12"/></pattern>
<clipPath id="c"><path d="{sh}"/></clipPath></defs>
{top}
<path d="{sh}" fill="{INK}"/>
<rect width="200" height="240" fill="url(#d)" clip-path="url(#c)"/>
<path d="{sh}" fill="none" stroke="{BONE}" stroke-width="4"/>
<path d="{sh}" transform="translate(100 138) scale(.86) translate(-100 -138)" fill="none" stroke="{borda}" stroke-width="2"/>
{mark}
<g transform="translate(100,{cy}) scale(.92)">{E[key]}</g>
</svg>
'''

if __name__ == '__main__':
    import json, sys
    sys.path.insert(0, '.')
    fams = json.loads(sys.argv[1])
    os.makedirs(OUT, exist_ok=True)
    for f in fams:
        k = slug(f['nome'])
        open(os.path.join(OUT, k + '.svg'), 'w').write(brasao(k, f['classe'], f['origem']))
    open(os.path.join(OUT, 'generais-brilhantes.svg'), 'w').write(brasao('generais-brilhantes', 'Ordem', None, GOLD, crown(GOLD, INK)))
    open(os.path.join(OUT, 'veio-negro.svg'), 'w').write(brasao('veio-negro', 'Ordem', None, VIOLET, f'<path d="M70,44 L100,20 L130,44" fill="none" stroke="{VIOLET}" stroke-width="3"/>'))
    print(len(os.listdir(OUT)))
