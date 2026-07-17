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

test('generates accessible semantic palettes across representative hues', () => {
  const seeds = [
    '#14b8a6',
    '#2563eb',
    '#facc15',
    '#ef4444',
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
        scale.buttonBg,
        scale.buttonHoverBg,
        scale.buttonActiveBg
      ]) {
        assert.match(color, HEX_COLOR_RE)
      }
      assert.doesNotMatch(scale.soft, /NaN|undefined/)
    }

    assert(wcagContrast(palette.light.brand1, '#ffffff') >= 6.5)
    assert(wcagContrast(palette.light.brand2, '#ffffff') >= 5.4)
    assert(wcagContrast(palette.light.brand3, '#ffffff') >= 4.5)
    assert(wcagContrast(palette.dark.brand1, '#1b1b1f') >= 7)
    assert(wcagContrast(palette.dark.brand2, '#1b1b1f') >= 4.5)
    assert(wcagContrast(palette.dark.brand3, '#ffffff') >= 5)
    assert(wcagContrast(palette.dark.buttonBg, '#ffffff') >= 5)
    assert(wcagContrast(palette.dark.buttonHoverBg, '#ffffff') >= 4.5)
    assert(wcagContrast(palette.dark.buttonActiveBg, '#ffffff') >= 6)

    const lightSoft = composite(palette.light.soft, '#ffffff')
    const darkSoft = composite(palette.dark.soft, '#1b1b1f')
    assert(wcagContrast(palette.light.brand1, lightSoft) >= 4.5)
    assert(wcagContrast(palette.dark.brand1, darkSoft) >= 4.5)
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
  assert.match(style, /--vp-button-brand-active-bg:/)
  assert.doesNotMatch(style, /NaN|undefined|body/)
})
