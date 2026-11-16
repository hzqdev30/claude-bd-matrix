import type { ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

type Anchors = Record<string, string>

// One dark palette per backdrop. `only: 'dark'` makes the surface act as if the dark scheme is forced.
function dark(label: string, anchors: Anchors) {
  const { theme, problems } = makeColors({
    label,
    only: 'dark',
    dark: { gray: { anchors } },
  })
  return { theme, problems }
}

// Near-neutral grays with only a hint of each hue, and no `roles`: the app keeps its own
// accent, status and icon colors.
const FORGE = dark('Forge', {
  'surface-0': '#100d0c', 'surface-1': '#171311', 'surface-2': '#1e1917', 'surface-3': '#221c1a',
  'text-primary': '#f2ebe6', 'text-secondary': '#cfc3bb', 'text-muted': '#a99c93',
})
const MATRIX = dark('Matrix', {
  'surface-0': '#0b0e0d', 'surface-1': '#111513', 'surface-2': '#171c1a', 'surface-3': '#1b211e',
  'text-primary': '#eaf0ec', 'text-secondary': '#c1cbc5', 'text-muted': '#9aa7a0',
})
const STORM = dark('Storm', {
  'surface-0': '#0b0d10', 'surface-1': '#111419', 'surface-2': '#171b21', 'surface-3': '#1b2027',
  'text-primary': '#eaeef3', 'text-secondary': '#c0c8d2', 'text-muted': '#99a3af',
})
const NIGHT_SKY = dark('Night sky', {
  'surface-0': '#0b0c12', 'surface-1': '#11131b', 'surface-2': '#171a24', 'surface-3': '#1c1f2b',
  'text-primary': '#eceef6', 'text-secondary': '#c3c8da', 'text-muted': '#9ca3bb',
})

export const COLORS: Record<string, ThemeSetArgs['colors']> = {
  forge: FORGE.theme,
  matrix: MATRIX.theme,
  storm: STORM.theme,
  'night-sky': NIGHT_SKY.theme,
}

// Lines that start "Desktop won't paint this theme" mean the app ignores the whole palette.
export const PROBLEMS: Record<string, string[]> = {
  forge: FORGE.problems,
  matrix: MATRIX.problems,
  storm: STORM.problems,
  'night-sky': NIGHT_SKY.problems,
}
