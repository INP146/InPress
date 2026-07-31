import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createAdaptiveGiscusTheme,
  createInPressGiscusThemes,
  requiresExplicitWebKitGiscusTheme,
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

test('creates adaptive and explicit InPress themes from both palettes', () => {
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
  const themes = createInPressGiscusThemes(
    (name) => lightTokens.get(name) ?? '',
    (name) => darkTokens.get(name) ?? ''
  )
  const adaptiveCss = decodeURIComponent(
    themes.adaptive.slice(themes.adaptive.indexOf(',') + 1)
  )
  const lightCss = decodeURIComponent(
    themes.light.slice(themes.light.indexOf(',') + 1)
  )
  const darkCss = decodeURIComponent(
    themes.dark.slice(themes.dark.indexOf(',') + 1)
  )

  assert.match(themes.adaptive, /^data:text\/css;charset=utf-8,/)
  assert.match(adaptiveCss, /giscus\.app\/themes\/preferred_color_scheme\.css/)
  assert.match(
    adaptiveCss,
    /:root\{color-scheme:light dark;background:transparent\}/
  )
  assert.match(adaptiveCss, /body\{background:transparent\}/)
  assert.match(adaptiveCss, /--color-canvas-default:#ffffff/)
  assert.match(
    adaptiveCss,
    /--color-canvas-default:oklch\(20% 0\.01 270\)/
  )
  assert.match(adaptiveCss, /@media \(prefers-color-scheme:dark\)/)

  assert.match(lightCss, /giscus\.app\/themes\/light\.css/)
  assert.match(
    lightCss,
    /:root\{color-scheme:only light;background:transparent\}/
  )
  assert.match(lightCss, /body\{background:transparent\}/)
  assert.match(lightCss, /--color-canvas-default:#ffffff/)
  assert.match(lightCss, /--color-fg-default:#3c3c43/)
  assert.match(lightCss, /--color-accent-fg:#d6396f/)
  assert.doesNotMatch(lightCss, /preferred_color_scheme/)
  assert.doesNotMatch(lightCss, /oklch\(20% 0\.01 270\)/)

  assert.match(darkCss, /giscus\.app\/themes\/dark\.css/)
  assert.match(
    darkCss,
    /:root\{color-scheme:only dark;background:transparent\}/
  )
  assert.match(darkCss, /body\{background:transparent\}/)
  assert.match(darkCss, /--color-canvas-default:oklch\(20% 0\.01 270\)/)
  assert.match(darkCss, /--color-fg-default:#dfdfd6/)
  assert.match(darkCss, /--color-accent-fg:#ff6090/)
  assert.match(darkCss, /--color-btn-primary-bg:#d6396f/)
  assert.match(darkCss, /--color-btn-primary-disabled-bg:color-mix/)
  assert.match(darkCss, /--color-scale-gray-7:rgb\(101 117 133 \/ 16%\)/)
  assert.match(darkCss, /--color-scale-blue-8:rgb\(255 96 144 \/ 16%\)/)
  assert.doesNotMatch(darkCss, /preferred_color_scheme/)
  assert.match(
    darkCss,
    /\.gsc-comment-box-textarea:disabled\{opacity:1\}/
  )
})

test('keeps configured adaptive themes stable across page switches', () => {
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
  assert.match(css, /:root\{color-scheme:light dark;background:transparent\}/)
  assert.match(css, /body\{background:transparent\}/)
})

test('uses explicit themes only for WebKit without desktop Chromium', () => {
  const safari =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ' +
    'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Safari/605.1.15'
  const chrome =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
  const iosChrome =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) ' +
    'AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0 Mobile/15E148 Safari/604.1'
  const firefox =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) ' +
    'Gecko/20100101 Firefox/141.0'

  assert.equal(requiresExplicitWebKitGiscusTheme(safari), true)
  assert.equal(requiresExplicitWebKitGiscusTheme(iosChrome), true)
  assert.equal(requiresExplicitWebKitGiscusTheme(chrome), false)
  assert.equal(requiresExplicitWebKitGiscusTheme(firefox), false)
})
