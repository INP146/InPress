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
