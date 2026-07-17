import {
  converter,
  formatHex,
  modeLrgb,
  modeOklch,
  modeRgb,
  toGamut,
  useMode,
  wcagContrast,
  type Oklch,
  type Rgb
} from 'culori/fn'

export type ThemeColor = `#${string}`

export interface ThemeColorScale {
  brand1: string
  brand2: string
  brand3: string
  soft: string
  buttonBg: string
  buttonHoverBg: string
  buttonActiveBg: string
}

export interface ThemeColorPalette {
  light: ThemeColorScale
  dark: ThemeColorScale
}

const HEX_COLOR_RE = /^#(?:[\da-f]{3}|[\da-f]{6})$/i
const LIGHT_BACKGROUND = '#ffffff'
const DARK_BACKGROUND = '#1b1b1f'
const MAX_CHROMA = 0.24

useMode(modeRgb)
useMode(modeLrgb)
useMode(modeOklch)

const toOklch = converter('oklch')
const mapToSrgb = toGamut('rgb', 'oklch')

function normalizeColor(color: string | undefined): ThemeColor | undefined {
  if (!color || !HEX_COLOR_RE.test(color)) return undefined
  return color.toLowerCase() as ThemeColor
}

function createCandidate(
  seed: Oklch,
  lightness: number,
  chromaScale: number
): Rgb {
  return mapToSrgb({
    mode: 'oklch',
    l: lightness,
    c: Math.min(seed.c, MAX_CHROMA) * chromaScale,
    h: seed.h
  })
}

function findTone(
  seed: Oklch,
  background: string,
  targetContrast: number,
  direction: 'darker' | 'lighter',
  chromaScale: number
): Rgb {
  let low = 0
  let high = 1
  let best = createCandidate(seed, direction === 'darker' ? low : high, chromaScale)

  for (let index = 0; index < 24; index += 1) {
    const lightness = (low + high) / 2
    const candidate = createCandidate(seed, lightness, chromaScale)
    const passes = wcagContrast(candidate, background) >= targetContrast

    if (direction === 'darker') {
      if (passes) {
        best = candidate
        low = lightness
      } else {
        high = lightness
      }
    } else if (passes) {
      best = candidate
      high = lightness
    } else {
      low = lightness
    }
  }

  return best
}

function toHex(color: Rgb): string {
  return formatHex(color).toLowerCase()
}

function toSoftColor(seed: Oklch, lightness: number, alpha: number): string {
  const color = createCandidate(seed, lightness, 0.9)
  const toChannel = (value: number) =>
    Math.round(Math.min(1, Math.max(0, value)) * 255)
  const red = toChannel(color.r)
  const green = toChannel(color.g)
  const blue = toChannel(color.b)

  return `rgb(${red} ${green} ${blue} / ${alpha})`
}

export function createColorPalette(color: string | undefined): ThemeColorPalette | undefined {
  const normalized = normalizeColor(color)
  if (!normalized) return undefined

  const seed = toOklch(normalized)
  if (!seed) return undefined

  const lightBrand1 = findTone(seed, LIGHT_BACKGROUND, 6.55, 'darker', 0.85)
  const lightBrand2 = findTone(seed, LIGHT_BACKGROUND, 5.45, 'darker', 0.95)
  const lightBrand3 = findTone(seed, LIGHT_BACKGROUND, 4.55, 'darker', 1)
  const darkBrand1 = findTone(seed, DARK_BACKGROUND, 7.05, 'lighter', 0.55)
  const darkBrand2 = findTone(seed, DARK_BACKGROUND, 4.55, 'lighter', 0.85)
  const darkBrand3 = findTone(seed, LIGHT_BACKGROUND, 5.05, 'darker', 1)

  return {
    light: {
      brand1: toHex(lightBrand1),
      brand2: toHex(lightBrand2),
      brand3: toHex(lightBrand3),
      soft: toSoftColor(seed, 0.68, 0.14),
      buttonBg: toHex(lightBrand3),
      buttonHoverBg: toHex(lightBrand2),
      buttonActiveBg: toHex(lightBrand1)
    },
    dark: {
      brand1: toHex(darkBrand1),
      brand2: toHex(darkBrand2),
      brand3: toHex(darkBrand3),
      soft: toSoftColor(seed, 0.68, 0.16),
      buttonBg: toHex(
        findTone(seed, LIGHT_BACKGROUND, 5.05, 'darker', 1)
      ),
      buttonHoverBg: toHex(
        findTone(seed, LIGHT_BACKGROUND, 4.55, 'darker', 1)
      ),
      buttonActiveBg: toHex(
        findTone(seed, LIGHT_BACKGROUND, 6.05, 'darker', 0.9)
      )
    }
  }
}

function createDeclarations(scale: ThemeColorScale): string {
  return [
    `--vp-c-brand-1:${scale.brand1}`,
    `--vp-c-brand-2:${scale.brand2}`,
    `--vp-c-brand-3:${scale.brand3}`,
    `--vp-c-brand-soft:${scale.soft}`,
    '--vp-button-brand-border:transparent',
    '--vp-button-brand-text:#ffffff',
    `--vp-button-brand-bg:${scale.buttonBg}`,
    '--vp-button-brand-hover-border:transparent',
    '--vp-button-brand-hover-text:#ffffff',
    `--vp-button-brand-hover-bg:${scale.buttonHoverBg}`,
    '--vp-button-brand-active-border:transparent',
    '--vp-button-brand-active-text:#ffffff',
    `--vp-button-brand-active-bg:${scale.buttonActiveBg}`
  ]
    .map((declaration) => `${declaration};`)
    .join('')
}

export function createColorStyle(color: string | undefined): string {
  const palette = createColorPalette(color)
  if (!palette) return ''

  return [
    `:root:root{${createDeclarations(palette.light)}}`,
    `:root:root.dark{${createDeclarations(palette.dark)}}`
  ].join('')
}
