import assert from 'node:assert/strict'
import test from 'node:test'
import type { DefaultTheme } from 'vitepress'
import {
  countDocWords,
  formatDocMetaDate,
  resolveDocMetaBreadcrumbs,
  resolveReadingTime
} from '../src/doc-meta'

const sidebar: DefaultTheme.Sidebar = [
  {
    text: 'Guide',
    base: '/guide/',
    items: [
      { text: 'Introduction', link: 'introduction' },
      { text: 'Configuration', link: 'configuration' }
    ]
  }
]

test('resolves the active sidebar trail into breadcrumbs', () => {
  assert.deepEqual(
    resolveDocMetaBreadcrumbs(sidebar, '/guide/introduction', 'Introduction'),
    [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Introduction', link: undefined }
    ]
  )
})

test('falls back to the page title when no sidebar item matches', () => {
  assert.deepEqual(
    resolveDocMetaBreadcrumbs(sidebar, '/standalone', 'Standalone'),
    [{ text: 'Standalone' }]
  )
})

test('does not match sidebar prefixes across a path segment boundary', () => {
  const mappedSidebar: DefaultTheme.Sidebar = {
    '/guide': [{ text: 'Guide', link: '/guide' }],
    '/guides': [{ text: 'Guides', link: '/guides' }]
  }

  assert.deepEqual(
    resolveDocMetaBreadcrumbs(mappedSidebar, '/guides', 'Guides'),
    [{ text: 'Guides', link: undefined }]
  )
})

test('joins sidebar bases that omit a trailing slash', () => {
  const sidebarWithoutTrailingSlash: DefaultTheme.Sidebar = [
    {
      text: 'Guide',
      base: '/guide',
      items: [{ text: 'Introduction', link: 'introduction' }]
    }
  ]

  assert.deepEqual(
    resolveDocMetaBreadcrumbs(
      sidebarWithoutTrailingSlash,
      '/guide/introduction',
      'Introduction'
    ),
    [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Introduction', link: undefined }
    ]
  )
})

test('counts Latin words and CJK characters', () => {
  assert.equal(countDocWords('Build clear docs with InPress.'), 5)
  assert.equal(countDocWords('清晰文档'), 4)
  assert.equal(countDocWords('InPress 构建 docs'), 4)
})

test('calculates stable reading times and formats dates', () => {
  assert.equal(resolveReadingTime(891), 4.1)
  assert.equal(resolveReadingTime(1), 0.1)
  assert.equal(formatDocMetaDate('2025-03-05 23:59:25'), '2025-03-05 23:59:25')
  assert.equal(
    formatDocMetaDate(
      Date.parse('2026-07-18T14:35:41Z'),
      'en-US',
      { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Shanghai' }
    ),
    'Jul 18, 2026, 10:35:41 PM'
  )
  assert.equal(
    formatDocMetaDate(
      Date.parse('2026-07-18T14:35:41Z'),
      'zh-CN',
      { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Shanghai' }
    ),
    '2026年7月18日 22:35:41'
  )
  assert.equal(
    formatDocMetaDate(
      Date.parse('2026-07-18T14:35:41Z'),
      'en-GB',
      {
        dateStyle: 'long',
        timeStyle: 'short',
        hourCycle: 'h23',
        timeZone: 'Asia/Shanghai',
        forceLocale: true
      }
    ),
    '18 July 2026 at 22:35'
  )
})
