import assert from 'node:assert/strict'
import test from 'node:test'
import {
  observeAutoLinkText,
  updateAutoLinkText
} from '../src/auto-link-text'
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

test('does not update href mutations outside document content', () => {
  const originalAnchor = globalThis.HTMLAnchorElement
  const originalObserver = globalThis.MutationObserver
  let callback: MutationCallback | undefined

  class TestAnchor {
    baseURI = 'https://docs.example.com/'
    childElementCount = 0
    dataset: DOMStringMap = {}
    href = 'https://github.com/vuejs/vitepress'
    textContent = this.href
    matches = () => false
  }

  class TestMutationObserver implements MutationObserver {
    constructor(observerCallback: MutationCallback) {
      callback = observerCallback
    }

    disconnect(): void {}
    observe(): void {}
    takeRecords(): MutationRecord[] {
      return []
    }
  }

  Object.assign(globalThis, {
    HTMLAnchorElement: TestAnchor,
    MutationObserver: TestMutationObserver
  })

  try {
    const observer = observeAutoLinkText({} as Node, () => true)
    const link = new TestAnchor()
    callback?.(
      [{ type: 'attributes', target: link } as unknown as MutationRecord],
      observer
    )

    assert.equal(link.textContent, 'https://github.com/vuejs/vitepress')
    assert.equal(link.dataset.inpressAutoLinkText, undefined)
  } finally {
    Object.assign(globalThis, {
      HTMLAnchorElement: originalAnchor,
      MutationObserver: originalObserver
    })
  }
})
