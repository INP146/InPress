import assert from 'node:assert/strict'
import test from 'node:test'
import { updateAutoLinkText } from '../src/auto-link-text'
import { resolveProviderLinkText } from '../src/link-text'

function createLink(href: string, text: string): HTMLAnchorElement {
  return {
    baseURI: 'https://docs.example.com/',
    childElementCount: 0,
    dataset: {},
    href,
    textContent: text
  } as unknown as HTMLAnchorElement
}

test('resolves repository and npm package labels', () => {
  assert.equal(
    resolveProviderLinkText('https://github.com/vuejs/vitepress'),
    'vuejs/vitepress'
  )
  assert.equal(
    resolveProviderLinkText('https://gitlab.com/gitlab-org/gitlab'),
    'gitlab-org/gitlab'
  )
  assert.equal(
    resolveProviderLinkText('https://www.npmjs.com/package/@vueuse/core'),
    '@vueuse/core'
  )
  assert.equal(resolveProviderLinkText('https://example.com/package/test'), undefined)
})

test('omits npm package subpages from generated labels', () => {
  assert.equal(
    resolveProviderLinkText('https://www.npmjs.com/package/vite/v/7.0.0'),
    'vite'
  )
  assert.equal(
    resolveProviderLinkText('https://www.npmjs.com/package/@vueuse/core?activeTab=versions'),
    '@vueuse/core'
  )
  assert.equal(resolveProviderLinkText('https://www.npmjs.com/package'), undefined)
  assert.equal(resolveProviderLinkText('https://www.npmjs.com/package/@vueuse'), undefined)
})

test('handles encoded and malformed provider path segments', () => {
  assert.equal(
    resolveProviderLinkText('https://github.com/vuejs/vitepress%20plugin'),
    'vuejs/vitepress plugin'
  )
  assert.equal(
    resolveProviderLinkText('https://www.npmjs.com/package/%40vueuse/core'),
    '@vueuse/core'
  )
  assert.equal(
    resolveProviderLinkText('https://github.com/vuejs/%E0%A4%A'),
    'vuejs/%E0%A4%A'
  )
})

test('matches provider hosts without accepting lookalike domains', () => {
  assert.equal(
    resolveProviderLinkText('https://GITHUB.COM/vuejs/vitepress'),
    'vuejs/vitepress'
  )
  assert.equal(
    resolveProviderLinkText('https://github.com.example.com/vuejs/vitepress'),
    undefined
  )
  assert.equal(
    resolveProviderLinkText('https://github.com@evil.example/vuejs/vitepress'),
    undefined
  )
})

test('updates and restores bare provider links', () => {
  const link = createLink(
    'https://github.com/vuejs/vitepress',
    'https://github.com/vuejs/vitepress'
  )

  updateAutoLinkText(link, true)
  assert.equal(link.textContent, 'vuejs/vitepress')
  assert.equal(
    link.dataset.inpressAutoLinkText,
    'https://github.com/vuejs/vitepress'
  )

  updateAutoLinkText(link, false)
  assert.equal(link.textContent, 'https://github.com/vuejs/vitepress')
  assert.equal(link.dataset.inpressAutoLinkText, undefined)
})

test('keeps explicit link labels unchanged', () => {
  const link = createLink('https://github.com/vuejs/vitepress', 'VitePress')

  updateAutoLinkText(link, true)
  assert.equal(link.textContent, 'VitePress')
  assert.equal(link.dataset.inpressAutoLinkText, undefined)
})
