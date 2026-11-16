import type { EngineInterface, Register, Timer } from 'claude-code'

import { COLORS } from './palettes.js'
import { matrix, ORDER, SCENES as DEFAULT_SCENES } from './scenes.js'

let SCENES = DEFAULT_SCENES

const KEY = 'current'
const DEFAULT = 'forge'

// The app draws a backdrop as a still picture, so a scene that changes is redrawn on a slow timer.
const TICK_MS = 500
let tick = 0
let timer: Timer | undefined

function startTimer($: EngineInterface) {
  timer?.cancel()
  timer = $.clock.every(TICK_MS, () => {
    tick += 1
    $.ui.invalidate('ui.render')
  })
}

function stopTimer() {
  timer?.cancel()
  timer = undefined
}

async function apply($: EngineInterface, name: string) {
  const set = await $.theme.set({
    backdrop: { scene: name, glass: SCENES[name].glass },
    colors: COLORS[name],
    overrideColorScheme: 'dark',
  })
  await $.store.set(KEY, name)
  if (SCENES[name].render) startTimer($)
  else stopTimer()
  return set
}

export const register: Register = (on, options) => {
  // Pickers from userConfig: '2s' and '20%' style strings; an unknown value falls back to the default.
  const seconds = parseFloat(String(options.changeEvery)) || 2
  const share = (parseFloat(String(options.changeShare)) || 20) / 100
  SCENES = { ...DEFAULT_SCENES, matrix: { ...DEFAULT_SCENES.matrix!, render: matrix(share, seconds) } }

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'backdrop',
      description: 'Switch backdrop: forge, matrix, storm, night-sky, next, off, list',
    })
    const saved = (await $.store.get(KEY)) as string | undefined
    if (saved !== 'off') {
      const name = saved && SCENES[saved] ? saved : DEFAULT
      const set = await apply($, name)
      if (!set.isDrawn) $.ui.status(set.reason)
    }
    return next(e)
  })

  on('command.run', { command: 'backdrop' }, async ($, e) => {
    const arg = e.args.trim().toLowerCase()
    const list = ORDER.map(n => `${n}: ${SCENES[n].label}`).join('\n')

    if (arg === 'list') return { text: `Backdrops:\n${list}\n\nUse /backdrop <name>, /backdrop next, or /backdrop off.` }

    if (arg === 'off') {
      stopTimer()
      await $.theme.clear()
      await $.store.set(KEY, 'off')
      return { text: 'Backdrop removed.' }
    }

    let name = arg === 'nightsky' ? 'night-sky' : arg
    if (arg === '' || arg === 'next') {
      const cur = (await $.store.get(KEY)) as string | undefined
      name = ORDER[((cur ? ORDER.indexOf(cur) : -1) + 1) % ORDER.length]
    }
    if (!SCENES[name]) return { text: `Unknown backdrop "${arg}".\n${list}` }

    const set = await apply($, name)
    return { text: set.isDrawn ? `Backdrop: ${name}` : `Not drawn here: ${set.reason}` }
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    const scene = SCENES[String(e.props.scene)]
    if (e.props.plugin !== $.plugin.name || !scene) return next(e)
    if (e.surface !== 'desktop' && e.surface !== 'mobile') return next(e)
    const { Svg } = $.ui.resolve(e)
    return <Svg source={scene.render ? scene.render(tick) : scene.svg!} alt={scene.label} isInteractive />
  })
}
