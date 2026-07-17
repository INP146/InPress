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
  accent: string
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
const TEXT_CONTRAST = 5.5
const HOVER_CONTRAST = 4.5
const SOLID_CONTRAST = 4.5

useMode(modeRgb)
useMode(modeLrgb)
useMode(modeOklch)

const toOklch = converter('oklch')
const toRgb = converter('rgb')
const mapToSrgb = toGamut('rgb', 'oklch')

function normalizeColor(color: string | undefined): ThemeColor | undefined {
  if (!color || !HEX_COLOR_RE.test(color)) return undefined
  return color.toLowerCase() as ThemeColor
}

function createCandidate(seed: Oklch, lightness: number): Rgb {
  return mapToSrgb({
    mode: 'oklch',
    l: Math.min(1, Math.max(0, lightness)),
    c: seed.c,
    h: seed.h
  })
}

function ensureToneContrast(
  seed: Oklch,
  lightness: number,
  background: string,
  targetContrast: number,
  direction: 'darker' | 'lighter'
): Rgb {
  const resolvedLightness = Math.min(1, Math.max(0, lightness))
  const initial = createCandidate(seed, resolvedLightness)
  if (wcagContrast(initial, background) >= targetContrast) return initial

  let low = direction === 'darker' ? 0 : resolvedLightness
  let high = direction === 'darker' ? resolvedLightness : 1
  let best = createCandidate(seed, direction === 'darker' ? low : high)

  for (let index = 0; index < 24; index += 1) {
    const candidateLightness = (low + high) / 2
    const candidate = createCandidate(seed, candidateLightness)
    const passes = wcagContrast(candidate, background) >= targetContrast

    if (direction === 'darker') {
      if (passes) {
        best = candidate
        low = candidateLightness
      } else {
        high = candidateLightness
      }
    } else if (passes) {
      best = candidate
      high = candidateLightness
    } else {
      low = candidateLightness
    }
  }

  return best
}

function toHex(color: Rgb): string {
  return formatHex(color).toLowerCase()
}

function composite(color: Rgb, background: Rgb, alpha: number): Rgb {
  return {
    mode: 'rgb',
    r: color.r * alpha + background.r * (1 - alpha),
    g: color.g * alpha + background.g * (1 - alpha),
    b: color.b * alpha + background.b * (1 - alpha)
  }
}

function toSoftColor(
  color: Rgb,
  background: string,
  foreground: Rgb,
  maxAlpha: number
): string {
  const backgroundColor = toRgb(background)
  let alpha = maxAlpha

  if (backgroundColor) {
    while (
      alpha > 0 &&
      wcagContrast(foreground, composite(color, backgroundColor, alpha)) < 4.5
    ) {
      alpha -= 0.001
    }
  }

  alpha = Math.max(0, Math.floor(alpha * 1000) / 1000)
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

  const accent = createCandidate(seed, seed.l)
  const buttonHover = ensureToneContrast(
    seed,
    seed.l - 0.06,
    LIGHT_BACKGROUND,
    5,
    'darker'
  )
  const buttonActive = ensureToneContrast(
    seed,
    seed.l - 0.12,
    LIGHT_BACKGROUND,
    5.5,
    'darker'
  )
  const buttonBackground = ensureToneContrast(
    seed,
    seed.l,
    LIGHT_BACKGROUND,
    4.5,
    'darker'
  )
  const lightBrand1 = ensureToneContrast(
    seed,
    seed.l - 0.12,
    LIGHT_BACKGROUND,
    TEXT_CONTRAST,
    'darker'
  )
  const lightBrand2 = ensureToneContrast(
    seed,
    seed.l - 0.06,
    LIGHT_BACKGROUND,
    HOVER_CONTRAST,
    'darker'
  )
  const darkBrand1 = ensureToneContrast(
    seed,
    seed.l,
    DARK_BACKGROUND,
    TEXT_CONTRAST,
    'lighter'
  )
  const darkBrand2 = ensureToneContrast(
    seed,
    seed.l - 0.06,
    DARK_BACKGROUND,
    HOVER_CONTRAST,
    'lighter'
  )
  const darkBrand3 = ensureToneContrast(
    seed,
    seed.l - 0.12,
    LIGHT_BACKGROUND,
    SOLID_CONTRAST,
    'darker'
  )
  const accentHex = toHex(accent)
  const buttonBackgroundHex = toHex(buttonBackground)
  const buttonHoverHex = toHex(buttonHover)
  const buttonActiveHex = toHex(buttonActive)

  return {
    light: {
      brand1: toHex(lightBrand1),
      brand2: toHex(lightBrand2),
      brand3: accentHex,
      soft: toSoftColor(accent, LIGHT_BACKGROUND, lightBrand1, 0.14),
      accent: accentHex,
      buttonBg: buttonBackgroundHex,
      buttonHoverBg: buttonHoverHex,
      buttonActiveBg: buttonActiveHex
    },
    dark: {
      brand1: toHex(darkBrand1),
      brand2: toHex(darkBrand2),
      brand3: toHex(darkBrand3),
      soft: toSoftColor(accent, DARK_BACKGROUND, darkBrand1, 0.16),
      accent: accentHex,
      buttonBg: buttonBackgroundHex,
      buttonHoverBg: buttonHoverHex,
      buttonActiveBg: buttonActiveHex
    }
  }
}

function createDeclarations(scale: ThemeColorScale): string {
  return [
    `--vp-c-brand-1:${scale.brand1}`,
    `--vp-c-brand-2:${scale.brand2}`,
    `--vp-c-brand-3:${scale.brand3}`,
    `--vp-c-brand-soft:${scale.soft}`,
    `--inpress-c-accent:${scale.accent}`,
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
