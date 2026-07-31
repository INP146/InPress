import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createAdaptiveGiscusTheme,
  createInPressGiscusTheme,
  resolveGiscusTheme
} from '../src/giscus-theme'

test('resolves the default Giscus theme from the current appearance', () => {
  assert.equal(resolveGiscusTheme(undefined, false), 'light')
  assert.equal(resolveGiscusTheme(undefined, true), 'dark')
})

test('preserves built-in Giscus themes and absolute theme URLs', () => {
  assert.equal(resolveGiscusTheme('dark_dimmed', true), 'dark_dimmed')
  assert.equal(
    resolveGiscusTheme('https://example.com/giscus.css', false),
    'https://example.com/giscus.css'
  )
})

test('resolves root-relative CSS themes against the current site', () => {
  const theme = {
    light: '/giscus/light.css',
    dark: '/giscus/dark.css'
  }
  const pageUrl = 'https://docs.example.com/guide/configuration'

  assert.equal(
    resolveGiscusTheme(theme, false, pageUrl),
    'https://docs.example.com/giscus/light.css'
  )
  assert.equal(
    resolveGiscusTheme(theme, true, pageUrl),
    'https://docs.example.com/giscus/dark.css'
  )
})

test('falls back to built-in themes when custom CSS uses plain HTTP', () => {
  const theme = {
    light: '/giscus/light.css',
    dark: '/giscus/dark.css'
  }
  const pageUrl = 'http://localhost:5173/guide/configuration'

  assert.equal(resolveGiscusTheme(theme, false, pageUrl), 'light')
  assert.equal(resolveGiscusTheme(theme, true, pageUrl), 'dark')
  assert.equal(
    resolveGiscusTheme('http://example.com/giscus.css', false, pageUrl),
    'light'
  )
})

test('creates one adaptive Giscus theme from both VitePress palettes', () => {
  const lightTokens = new Map([
    ['--vp-c-bg', '#ffffff'],
    ['--vp-c-bg-alt', '#f6f6f7'],
    ['--vp-c-text-1', '#3c3c43'],
    ['--vp-c-brand-1', '#d6396f'],
    ['--vp-c-brand-soft', 'rgb(214 57 111 / 14%)'],
    ['--vp-c-default-soft', 'rgb(142 150 170 / 14%)'],
    ['--vp-button-brand-bg', '#d6396f'],
    ['--vp-button-brand-text', '#ffffff']
  ])
  const darkTokens = new Map([
    ['--vp-c-bg', 'oklch(20% 0.01 270)'],
    ['--vp-c-bg-alt', '#161618'],
    ['--vp-c-text-1', '#dfdfd6'],
    ['--vp-c-brand-1', '#ff6090'],
    ['--vp-c-brand-soft', 'rgb(255 96 144 / 16%)'],
    ['--vp-c-default-soft', 'rgb(101 117 133 / 16%)'],
    ['--vp-button-brand-bg', '#d6396f'],
    ['--vp-button-brand-text', '#ffffff']
  ])
  const theme = createInPressGiscusTheme(
    (name) => lightTokens.get(name) ?? '',
    (name) => darkTokens.get(name) ?? ''
  )
  const css = decodeURIComponent(theme.slice(theme.indexOf(',') + 1))

  assert.match(theme, /^data:text\/css;charset=utf-8,/)
  assert.match(css, /giscus\.app\/themes\/preferred_color_scheme\.css/)
  assert.match(css, /--color-canvas-default:#ffffff/)
  assert.match(css, /--color-canvas-default:oklch\(20% 0\.01 270\)/)
  assert.match(css, /--color-fg-default:#dfdfd6/)
  assert.match(css, /--color-accent-fg:#ff6090/)
  assert.match(css, /--color-btn-primary-bg:#d6396f/)
  assert.match(css, /--color-btn-primary-disabled-bg:color-mix/)
  assert.match(css, /--color-scale-gray-7:rgb\(101 117 133 \/ 16%\)/)
  assert.match(css, /--color-scale-blue-8:rgb\(255 96 144 \/ 16%\)/)
  assert.match(css, /@media \(prefers-color-scheme:dark\)/)
  assert.match(css, /\.gsc-comment-box-textarea:disabled\{opacity:1\}/)
})

test('keeps a stable adaptive theme URL across appearance changes', () => {
  assert.equal(createAdaptiveGiscusTheme(undefined), 'preferred_color_scheme')
  assert.equal(createAdaptiveGiscusTheme('dark_dimmed'), 'dark_dimmed')

  const theme = createAdaptiveGiscusTheme({
    light: 'light',
    dark: 'dark_dimmed'
  })
  const css = decodeURIComponent(theme.slice(theme.indexOf(',') + 1))

  assert.match(css, /giscus\.app\/themes\/light\.css/)
  assert.match(css, /giscus\.app\/themes\/dark_dimmed\.css/)
  assert.match(css, /prefers-color-scheme:light/)
  assert.match(css, /prefers-color-scheme:dark/)
})
