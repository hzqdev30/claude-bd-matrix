export type Glass = { blur: number; tint: string; opacity: number }
// `svg` is a fixed picture; `render(tick)` redraws it as the mod's timer advances.
export type Scene = { label: string; svg?: string; render?: (tick: number) => string; glass: Glass }

// Seeded PRNG so every scene is the same on each draw.
function rng(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const f = (n: number, d = 1) => n.toFixed(d)
const REDUCE = (sel: string) => `@media (prefers-reduced-motion:reduce){${sel}{animation:none}}`

/* ───────────────────────────── FORGE ───────────────────────────── */
function forge(): string {
  const r = rng(21)

  const embers: string[] = []
  const kinds = ['e1', 'e2', 'e3']
  const colors = ['#ffb347', '#ff6a1a', '#ffd98a', '#ff4d12']
  for (let i = 0; i < 80; i++) {
    const x = r() * 400
    const rad = 0.7 + r() * 2.1
    const col = colors[Math.floor(r() * colors.length)]
    const cls = kinds[Math.floor(r() * 3)]
    const dur = 6 + r() * 9
    const delay = -r() * 15
    const halo = rad > 1.6 ? `<circle cx="${f(x)}" cy="800" r="${f(rad * 3)}" fill="${col}" opacity=".18"/>` : ''
    embers.push(
      `<g class="${cls}" style="animation-duration:${f(dur)}s;animation-delay:${f(delay)}s">${halo}<circle cx="${f(x)}" cy="800" r="${f(rad, 2)}" fill="${col}"/></g>`,
    )
  }

  const sparks: string[] = []
  for (let i = 0; i < 9; i++) {
    const x = 60 + r() * 280
    sparks.push(
      `<g transform="translate(${f(x)} 740) rotate(${f(-20 + r() * 40)})"><line class="sk" x1="0" y1="0" x2="0" y2="-14" stroke="#ffe3a0" stroke-width="1.4" stroke-linecap="round" style="animation-duration:${f(5 + r() * 5)}s;animation-delay:${f(-r() * 9)}s"/></g>`,
    )
  }

  const cracks: string[] = []
  const starts = [60, 140, 220, 300, 360]
  starts.forEach((sx, i) => {
    let x = sx
    let y = 752
    let d = `M${x} ${y}`
    for (let k = 0; k < 4; k++) {
      x += (r() - 0.5) * 30
      y += 8 + r() * 10
      d += `L${f(x)} ${f(y)}`
    }
    cracks.push(`<path class="cr" d="${d}" fill="none" stroke="#ff7a1f" stroke-width="1.6" stroke-linecap="round" style="animation-delay:${f(-i * 1.1)}s"/>`)
  })

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
<style>
.e1,.e2,.e3{opacity:0;animation:rise1 9s linear infinite}
.e1{animation-name:rise1}.e2{animation-name:rise2}.e3{animation-name:rise3}
@keyframes rise1{0%{transform:translate(0,0);opacity:0}8%{opacity:1}100%{transform:translate(-70px,-820px);opacity:0}}
@keyframes rise2{0%{transform:translate(0,0);opacity:0}8%{opacity:1}100%{transform:translate(60px,-780px);opacity:0}}
@keyframes rise3{0%{transform:translate(0,0);opacity:0}8%{opacity:1}50%{transform:translate(-18px,-400px)}100%{transform:translate(14px,-700px);opacity:0}}
.sk{opacity:0;animation:spark 7s linear infinite}
@keyframes spark{0%{transform:translate(0,0);opacity:0}2%{opacity:1}12%{transform:translate(0,-170px);opacity:0}100%{transform:translate(0,-170px);opacity:0}}
.smoke{animation:smoke 26s ease-in-out infinite alternate}
.smoke2{animation:smoke 34s ease-in-out infinite alternate-reverse}
@keyframes smoke{from{transform:translate(-30px,20px);opacity:.35}to{transform:translate(30px,-40px);opacity:.7}}
.heat{animation:heat 4s ease-in-out infinite alternate}
@keyframes heat{from{opacity:.55;transform:scale(.96)}to{opacity:1;transform:scale(1.06)}}
.cr{animation:crack 3.2s ease-in-out infinite}
@keyframes crack{0%,100%{opacity:.35}50%{opacity:1}}
.flow{stroke-dasharray:10 8;animation:flow 2.5s linear infinite}
@keyframes flow{to{stroke-dashoffset:-36}}
${REDUCE('.e1,.e2,.e3,.sk,.smoke,.smoke2,.heat,.cr,.flow')}
</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#020102"/>
<stop offset=".5" stop-color="#12070a"/>
<stop offset=".8" stop-color="#3a1206"/>
<stop offset="1" stop-color="#8a2a05"/>
</linearGradient>
<radialGradient id="lava" cx=".5" cy="1" r=".8">
<stop offset="0" stop-color="#ff8a2a" stop-opacity=".85"/>
<stop offset=".4" stop-color="#ff4d12" stop-opacity=".4"/>
<stop offset="1" stop-color="#ff4d12" stop-opacity="0"/>
</radialGradient>
<filter id="b30" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="30"/></filter>
<filter id="b3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>
<rect width="400" height="800" fill="url(#sky)"/>
<g filter="url(#b30)">
<ellipse class="smoke" cx="110" cy="260" rx="160" ry="70" fill="#2a1d19"/>
<ellipse class="smoke2" cx="320" cy="140" rx="170" ry="60" fill="#24181a"/>
<ellipse class="smoke" cx="230" cy="470" rx="190" ry="80" fill="#3a1a10" opacity=".6"/>
</g>
<rect class="heat" y="430" width="400" height="370" fill="url(#lava)" style="transform-origin:200px 800px"/>
<path d="M0 722 L50 700 L96 716 L150 684 L210 712 L268 690 L326 714 L400 696 L400 800 L0 800Z" fill="#1a0b07"/>
<path d="M0 760 L38 744 L84 756 L130 738 L190 758 L248 740 L300 756 L350 742 L400 754 L400 800 L0 800Z" fill="#070302"/>
<g filter="url(#b3)" opacity=".8">${cracks.join('')}</g>
${cracks.join('')}
<path class="flow" d="M0 790 Q60 778 120 788 T240 786 T400 788" fill="none" stroke="#ffb347" stroke-width="3" stroke-linecap="round" opacity=".9"/>
${sparks.join('')}
${embers.join('')}
</svg>`
}

/* ───────────────────────────── MATRIX ───────────────────────────── */
// A wide canvas, so a desktop window shows the whole field of code, not a magnified slice.
// No scanlines, scan beam or tear bars: only falling code.
function matrix(): (tick: number) => string {
  const r = rng(5)
  const pool = [...'01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ789Z:.=*+-<>']
  const OP = ['.06', '.1', '.16', '.24', '.34', '.46', '.6', '.78']
  const W = 1200
  const H = 800
  const SWAP = 0.2 // share of body characters that change
  const PHASES = 4 // a tick is 500 ms, so each swapper changes every 4 ticks = 2 s, staggered
  const GLYPHS = 8

  type Cell = { ch: string; fill: string; op: string; seq?: string[]; phase?: number }
  type Column = { x: number; size: number; base: number; dim: number; cells: Cell[] }

  const col = (x: number, size: number, len: number, dim: number, swap: number, base: number): Column => {
    const cells: Cell[] = []
    for (let i = 0; i < len; i++) {
      let fill = '#00ff66'
      let op = OP[Math.min(7, Math.floor((i / (len - 1)) * 8))]
      if (i === len - 1) {
        fill = '#e6fff0'
        op = '1'
      } else if (i === len - 2) {
        fill = '#8dffb8'
        op = '.9'
      }
      const cell: Cell = { ch: pool[Math.floor(r() * pool.length)], fill, op }
      if (i < len - 2 && r() < swap) {
        cell.seq = Array.from({ length: GLYPHS }, () => pool[Math.floor(r() * pool.length)])
        cell.phase = Math.floor(r() * PHASES)
      }
      cells.push(cell)
    }
    return { x: Math.round(x), size, base: Math.round(base), dim, cells }
  }

  // Every column sits in a fixed lane and each lane is filled top to bottom with
  // streams that never touch, so nothing overlaps and no corner stays empty. The dim
  // small lanes sit halfway between the bright ones, clear of their glyphs.
  const LANE = 27
  const lane = (x: number, size: number, dim: number, swap: number, lenMin: number, lenVar: number, gapMin: number, gapVar: number): Column[] => {
    const out: Column[] = []
    const step = size + 3
    let y = -r() * 160
    while (y < H) {
      const len = lenMin + Math.floor(r() * lenVar)
      out.push(col(x, size, len, dim, swap, y))
      y += (len - 1) * step + gapMin + r() * gapVar + step
    }
    return out
  }

  const back: Column[] = []
  for (let i = 0; i < 22; i++) back.push(...lane(12 + LANE * (2 * i) + LANE / 2, 10, 0.4, 0, 10, 6, 90, 220))
  const front: Column[] = []
  for (let i = 0; i < 44; i++) front.push(...lane(12 + i * LANE, 15, 1, SWAP, 8, 6, 70, 180))

  // One <text> per stream: its x and dy lists place every glyph, so each <tspan> only
  // carries its own opacity (and a colour for the two bright head glyphs).
  const draw = (c: Column, tick: number): string => {
    const step = c.size + 3
    const n = c.cells.length
    let tsp = ''
    c.cells.forEach(cell => {
      let ch = cell.ch
      if (cell.seq) {
        // glyph advances once every PHASES ticks, offset by the cell's own phase
        const k = tick < cell.phase! ? 0 : Math.floor((tick - cell.phase!) / PHASES) + 1
        ch = cell.seq[k % GLYPHS]
      }
      const colour = cell.fill === '#00ff66' ? '' : ` fill="${cell.fill}"`
      tsp += `<tspan${colour} fill-opacity="${cell.op}">${ch}</tspan>`
    })
    const xs = Array(n).fill(c.x).join(' ')
    const dys = Array.from({ length: n }, (_, i) => (i === 0 ? 0 : step)).join(' ')
    return `<text x="${xs}" y="${c.base}" dy="${dys}" opacity="${c.dim}" fill="#00ff66" font-family="monospace" font-size="${c.size}" text-anchor="middle">${tsp}</text>`
  }

  const head = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#001a0e"/></linearGradient>
<radialGradient id="vig" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>`
  const tail = `<ellipse cx="${W / 2}" cy="${H / 2}" rx="${W * 0.3}" ry="${H * 0.4}" fill="url(#vig)"/></svg>`

  return tick => head + back.map(c => draw(c, tick)).join('') + front.map(c => draw(c, tick)).join('') + tail
}

/* ───────────────────────────── STORM ───────────────────────────── */
function storm(): string {
  const r = rng(3)

  const rain: string[] = []
  for (let i = 0; i < 95; i++) {
    const x = r() * 620 - 100
    const len = 14 + r() * 20
    const w = 0.5 + r() * 0.8
    rain.push(
      `<line class="rn" x1="${f(x)}" y1="-40" x2="${f(x - len * 0.23)}" y2="${f(-40 + len)}" stroke="#a9c8e8" stroke-width="${f(w, 2)}" stroke-linecap="round" opacity="${f(0.18 + r() * 0.32, 2)}" style="animation-duration:${f(0.6 + r() * 0.6, 2)}s;animation-delay:${f(-r() * 1.2, 2)}s"/>`,
    )
  }

  const ripples: string[] = []
  for (let i = 0; i < 9; i++) {
    const x = 20 + r() * 360
    const y = 770 + r() * 24
    ripples.push(
      `<ellipse class="rp" cx="${f(x)}" cy="${f(y)}" rx="10" ry="3" fill="none" stroke="#a9c8e8" stroke-width=".8" style="animation-delay:${f(-r() * 3)}s;transform-origin:${f(x)}px ${f(y)}px"/>`,
    )
  }

  const bolt1 = 'M250 -10 L232 90 L252 96 L214 210 L236 216 L200 340 M214 210 L170 290'
  const bolt2 = 'M96 -10 L112 80 L92 86 L128 190 L110 196 L142 280 M128 190 L168 250'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
<style>
.rn{animation:rain 0.9s linear infinite}
@keyframes rain{from{transform:translate(0,0)}to{transform:translate(-190px,830px)}}
.c1{animation:cl 48s ease-in-out infinite alternate}
.c2{animation:cl 36s ease-in-out infinite alternate-reverse}
@keyframes cl{from{transform:translateX(-50px)}to{transform:translateX(50px)}}
.fl{opacity:0;animation:flash 13s linear infinite}
.fl2{opacity:0;animation:flash 17s linear infinite}
@keyframes flash{0%,90%{opacity:0}91%{opacity:.5}92.5%{opacity:.1}94%{opacity:.65}98%,100%{opacity:0}}
.bt{opacity:0;animation:bolt 13s linear infinite}
.bt2{opacity:0;animation:bolt 17s linear infinite}
@keyframes bolt{0%,90%{opacity:0}91%{opacity:1}92.5%{opacity:.2}94%{opacity:1}97%,100%{opacity:0}}
.rp{animation:ripple 2.4s ease-out infinite}
@keyframes ripple{0%{transform:scale(.2);opacity:.8}100%{transform:scale(2.4);opacity:0}}
.mist{animation:mist 18s ease-in-out infinite alternate}
@keyframes mist{from{transform:translateX(-40px);opacity:.35}to{transform:translateX(40px);opacity:.6}}
${REDUCE('.rn,.c1,.c2,.fl,.fl2,.bt,.bt2,.rp,.mist')}
@media (prefers-reduced-motion:reduce){.fl,.fl2,.bt,.bt2{opacity:0}}
</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#03060a"/>
<stop offset=".5" stop-color="#0e1620"/>
<stop offset="1" stop-color="#202e3b"/>
</linearGradient>
<filter id="b28" x="-40%" y="-60%" width="180%" height="220%"><feGaussianBlur stdDeviation="28"/></filter>
<filter id="b5" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
</defs>
<rect width="400" height="800" fill="url(#sky)"/>
<g filter="url(#b28)">
<ellipse class="c1" cx="80" cy="60" rx="220" ry="90" fill="#0a1018"/>
<ellipse class="c2" cx="330" cy="120" rx="230" ry="95" fill="#111a24"/>
<ellipse class="c1" cx="150" cy="260" rx="240" ry="80" fill="#18232f" opacity=".85"/>
<ellipse class="c2" cx="340" cy="360" rx="200" ry="70" fill="#1c2a38" opacity=".7"/>
</g>
<g filter="url(#b28)">
<ellipse class="fl" cx="240" cy="150" rx="230" ry="130" fill="#8fb4e8"/>
<ellipse class="fl2" cx="110" cy="130" rx="220" ry="120" fill="#8fb4e8"/>
</g>
<rect class="fl" width="400" height="800" fill="#b9d2ff" opacity="0"/>
<rect class="fl2" width="400" height="800" fill="#b9d2ff" opacity="0"/>
<g class="bt"><path d="${bolt1}" fill="none" stroke="#7aa8ff" stroke-width="9" filter="url(#b5)"/><path d="${bolt1}" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/></g>
<g class="bt2"><path d="${bolt2}" fill="none" stroke="#7aa8ff" stroke-width="9" filter="url(#b5)"/><path d="${bolt2}" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/></g>
<path d="M0 700 L60 676 L130 698 L200 664 L280 696 L340 672 L400 690 L400 800 L0 800Z" fill="#070b10"/>
<rect class="mist" y="640" width="400" height="160" fill="#6f8aa6" opacity=".4" filter="url(#b28)"/>
${rain.join('')}
${ripples.join('')}
</svg>`
}

/* ─────────────────────────── NIGHT SKY ─────────────────────────── */
function streak(x: number, y: number, k: number, cls: string, dur: number, delay: number): string {
  return `<g transform="translate(${x} ${y}) scale(${k})"><g class="${cls}" style="animation-duration:${dur}s;animation-delay:${delay}s"><line x1="0" y1="0" x2="90" y2="-65" stroke="#8fb0ff" stroke-width="5" stroke-linecap="round" opacity=".18"/><line x1="0" y1="0" x2="90" y2="-65" stroke="url(#trail)" stroke-width="1.8" stroke-linecap="round"/><circle r="4.5" fill="#bcd0ff" opacity=".35"/><circle r="1.7" fill="#fff"/></g></g>`
}

function nightSky(): string {
  const r = rng(11)
  const stars: string[] = []
  for (let i = 0; i < 170; i++) {
    const x = r() * 400
    const y = r() * 600
    const big = r() > 0.9
    const rad = big ? 1.1 + r() * 0.8 : 0.3 + r() * 0.6
    const fill = r() > 0.8 ? '#bcd0ff' : r() > 0.6 ? '#ffe2c4' : '#ffffff'
    stars.push(`<circle class="s" cx="${f(x)}" cy="${f(y)}" r="${f(rad, 2)}" fill="${fill}" style="animation-duration:${f(2 + r() * 5)}s;animation-delay:${f(-r() * 8)}s"/>`)
  }
  const dust: string[] = []
  const ang = (28 * Math.PI) / 180
  for (let i = 0; i < 260; i++) {
    const along = (r() - 0.5) * 900
    const across = (r() + r() + r() - 1.5) * 70
    const x = 210 + along * Math.sin(ang) + across * Math.cos(ang)
    const y = 300 - along * Math.cos(ang) + across * Math.sin(ang)
    if (x < -5 || x > 405 || y < -5 || y > 640) continue
    dust.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.25 + r() * 0.5, 2)}" fill="#e8ecff" opacity="${f(0.3 + r() * 0.6, 2)}"/>`)
  }
  const shooters: Array<[number, number, number, number, number]> = [
    [390, 30, 9, 0.5, 1], [330, 110, 12, 3, 0.8], [430, 190, 10, 6, 1.2], [260, 20, 13, 8.5, 0.7], [400, 300, 11, 11, 1], [180, 60, 15, 2, 0.6],
  ]
  const streaks = shooters.map(([x, y, d, dl, k]) => streak(x, y, k, 'sh', d, dl)).join('')
  const shower: string[] = []
  for (let i = 0; i < 14; i++) shower.push(streak(120 + r() * 320, -10 + r() * 240, 0.5 + r() * 0.7, 'sw', 26, 4 + i * 0.28 + r() * 0.2))
  const pines: string[] = []
  for (let i = 0; i < 26; i++) {
    const x = r() * 400
    const h = 22 + r() * 34
    const y = 772 - r() * 8
    pines.push(`<path d="M${f(x)} ${f(y)}l${f(-h * 0.22)} 0 ${f(h * 0.1)}-${f(h * 0.3)} ${f(-h * 0.08)} 0 ${f(h * 0.2)}-${f(h * 0.35)} ${f(-h * 0.1)} 0 ${f(h * 0.2)}-${f(h * 0.4)} ${f(h * 0.2)} ${f(h * 0.4)} ${f(-h * 0.1)} 0 ${f(h * 0.2)} ${f(h * 0.35)} ${f(-h * 0.08)} 0 ${f(h * 0.1)} ${f(h * 0.3)}z" fill="#05030d"/>`)
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
<style>
.s{animation:tw 4s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:.15}50%{opacity:1}}
.sh,.sw{opacity:0;animation:shoot 12s linear infinite}
@keyframes shoot{0%{transform:translate(0,0);opacity:0}2%{opacity:1}10%{transform:translate(-300px,216px);opacity:0}100%{transform:translate(-300px,216px);opacity:0}}
.sw{animation-name:shower}
@keyframes shower{0%{transform:translate(0,0);opacity:0}1%{opacity:1}7%{transform:translate(-320px,230px);opacity:0}100%{transform:translate(-320px,230px);opacity:0}}
.mw{animation:drift 60s ease-in-out infinite alternate}
@keyframes drift{from{transform:translate(-18px,8px)}to{transform:translate(18px,-8px)}}
.glow{animation:breathe 8s ease-in-out infinite alternate}
@keyframes breathe{from{opacity:.5}to{opacity:1}}
${REDUCE('.s,.sh,.sw,.mw,.glow')}
</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03040f"/><stop offset=".4" stop-color="#0a1040"/><stop offset=".75" stop-color="#241a58"/><stop offset="1" stop-color="#5a3a86"/></linearGradient>
<linearGradient id="trail" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="90" y2="-65"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#8fb0ff" stop-opacity="0"/></linearGradient>
<radialGradient id="horizon" cx=".5" cy="1" r=".75"><stop offset="0" stop-color="#8a6fff" stop-opacity=".4"/><stop offset="1" stop-color="#8a6fff" stop-opacity="0"/></radialGradient>
<filter id="blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="24"/></filter>
</defs>
<rect width="400" height="800" fill="url(#sky)"/>
<g class="mw" filter="url(#blur)"><ellipse cx="210" cy="300" rx="80" ry="470" fill="#6c7bff" opacity=".35" transform="rotate(28 210 300)"/></g>
<g class="mw">${dust.join('')}</g>
${stars.join('')}
${streaks}
${shower.join('')}
<rect class="glow" y="540" width="400" height="260" fill="url(#horizon)"/>
<path d="M0 765 L40 740 L85 755 L140 722 L190 750 L250 728 L310 755 L360 735 L400 750 L400 800 L0 800Z" fill="#0a0716"/>
${pines.join('')}
</svg>`
}

export const SCENES: Record<string, Scene> = {
  forge: { label: 'Forge: embers, lava glow and smoke', svg: forge(), glass: { blur: 8, tint: '#120704', opacity: 0.35 } },
  matrix: { label: 'Matrix: green code with changing characters', render: matrix(), glass: { blur: 8, tint: '#000a05', opacity: 0.4 } },
  storm: { label: 'Storm: rain, lightning and dark clouds', svg: storm(), glass: { blur: 8, tint: '#080c12', opacity: 0.35 } },
  'night-sky': { label: 'Night sky: stars and shooting stars', svg: nightSky(), glass: { blur: 8, tint: '#070a22', opacity: 0.35 } },
}

export const ORDER = ['forge', 'matrix', 'storm', 'night-sky']
