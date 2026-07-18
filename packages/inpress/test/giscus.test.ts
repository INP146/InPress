import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveGiscusTheme } from '../src/giscus-theme'

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
