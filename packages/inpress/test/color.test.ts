import assert from 'node:assert/strict'
import test from 'node:test'
import { converter, wcagContrast, type Rgb } from 'culori/fn'
import { createColorPalette, createColorStyle } from '../src/color'

const toRgb = converter('rgb')
const HEX_COLOR_RE = /^#[\da-f]{6}$/

function composite(color: string, background: string): Rgb {
  const foreground = toRgb(color)
  const base = toRgb(background)

  assert(foreground)
  assert(base)

  const alpha = foreground.alpha ?? 1
  return {
    mode: 'rgb',
    r: foreground.r * alpha + base.r * (1 - alpha),
    g: foreground.g * alpha + base.g * (1 - alpha),
    b: foreground.b * alpha + base.b * (1 - alpha)
  }
}

test('generates semantic palettes with accessible text and button tones', () => {
  const seeds = [
    '#14b8a6',
    '#2563eb',
    '#facc15',
    '#ef4444',
    '#ff7aa9',
    '#ffa3bc',
    '#777777',
    '#000000',
    '#ffffff'
  ]

  for (const seed of seeds) {
    const palette = createColorPalette(seed)
    assert(palette)

    for (const scale of [palette.light, palette.dark]) {
      for (const color of [
        scale.brand1,
        scale.brand2,
        scale.brand3,
        scale.accent,
        scale.buttonBg,
        scale.buttonHoverBg,
        scale.buttonActiveBg
      ]) {
        assert.match(color, HEX_COLOR_RE)
      }
      assert.doesNotMatch(scale.soft, /NaN|undefined/)
    }

    assert(wcagContrast(palette.light.brand1, '#ffffff') >= 5.45)
    assert(wcagContrast(palette.light.brand2, '#ffffff') >= 4.45)
    assert(wcagContrast(palette.dark.brand1, '#1b1b1f') >= 5.45)
    assert(wcagContrast(palette.dark.brand2, '#1b1b1f') >= 4.45)
    assert(wcagContrast(palette.dark.brand3, '#ffffff') >= 4.45)

    for (const scale of [palette.light, palette.dark]) {
      assert(wcagContrast(scale.buttonBg, '#ffffff') >= 4.45)
      assert(wcagContrast(scale.buttonHoverBg, '#ffffff') >= 4.95)
      assert(wcagContrast(scale.buttonActiveBg, '#ffffff') >= 5.45)
    }

    const lightSoft = composite(palette.light.soft, '#ffffff')
    const darkSoft = composite(palette.dark.soft, '#1b1b1f')
    assert(wcagContrast(palette.light.brand1, lightSoft) >= 4.5)
    assert(wcagContrast(palette.dark.brand1, darkSoft) >= 4.5)
  }
})

test('uses light seeds directly for solid accents and controls', () => {
  for (const seed of ['#ff658c', '#ffa3bc']) {
    const palette = createColorPalette(seed)
    const style = createColorStyle(seed)

    assert(palette)
    assert.equal(palette.light.brand3, seed)
    assert.equal(palette.light.accent, seed)
    assert.equal(palette.dark.brand1, seed)
    assert.equal(palette.dark.accent, seed)
    assert.match(style, new RegExp(`--inpress-c-accent:${seed}`))
    assert.match(style, /--vp-button-brand-text:#ffffff/)
  }
})

test('accepts short hex and rejects arbitrary CSS input', () => {
  assert(createColorPalette('#0f6'))

  for (const value of ['', 'red', '#12', '#1234', '#12345678', '#fff;}body{']) {
    assert.equal(createColorPalette(value), undefined)
    assert.equal(createColorStyle(value), '')
  }
})

test('emits config styles above ordinary root declarations', () => {
  const style = createColorStyle('#14b8a6')

  assert.match(style, /^:root:root\{/)
  assert.match(style, /:root:root\.dark\{/)
  assert.match(style, /--vp-c-brand-1:/)
  assert.match(style, /--inpress-c-accent:/)
  assert.match(style, /--vp-button-brand-active-bg:/)
  assert.doesNotMatch(style, /NaN|undefined|body/)
})
