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

test('counts Latin words and CJK characters', () => {
  assert.equal(countDocWords('Build clear docs with InPress.'), 5)
  assert.equal(countDocWords('清晰文档'), 4)
  assert.equal(countDocWords('InPress 构建 docs'), 4)
})

test('calculates stable reading times and formats dates', () => {
  assert.equal(resolveReadingTime(891), 4.1)
  assert.equal(resolveReadingTime(1), 0.1)
  assert.equal(formatDocMetaDate('2025-03-05 23:59:25'), '2025-03-05 23:59:25')
  assert.equal(formatDocMetaDate(Date.UTC(2025, 2, 5, 23, 59, 25)), '2025-03-05 23:59:25')
  assert.equal(
    formatDocMetaDate(
      Date.parse('2026-07-18T14:35:41Z'),
      'Asia/Shanghai'
    ),
    '2026-07-18 22:35:41'
  )
})
