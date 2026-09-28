import assert from 'node:assert/strict'
import test from 'node:test'
import { createProviderLinkSelectors } from '../src/link-icon-selectors'

test('matches provider link schemes and hosts case-insensitively', () => {
  const selectors = createProviderLinkSelectors([
    'https://github.com/',
    'https://www.github.com/'
  ])

  assert.match(
    selectors,
    /a\[href\^="https:\/\/github\.com\/" i\]::before/
  )
  assert.match(
    selectors,
    /a\[href\^="https:\/\/www\.github\.com\/" i\]::before/
  )
})