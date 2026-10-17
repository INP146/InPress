import assert from 'node:assert/strict'
import test from 'node:test'
import {
  applyFavicon,
  createAlignedFaviconDataUrl,
  readFaviconTransform,
  resolveFaviconSource
} from '../src/favicon'

test('resolves the configured favicon or active navigation logo', () => {
  assert.equal(resolveFaviconSource(undefined, '/logo.svg', false), '/logo.svg')
  assert.equal(resolveFaviconSource(false, '/logo.svg', false), undefined)
  assert.equal(
    resolveFaviconSource(undefined, { light: '/light.svg', dark: '/dark.svg' }, true),
    '/dark.svg'
  )
  assert.equal(
    resolveFaviconSource('/favicon.png', '/logo.svg', false),
    '/favicon.png'
  )
})

test('adds a managed favicon without overriding an explicit one', () => {
  let managed: Record<string, unknown> | undefined
  let explicit = false
  const link = {
    dataset: {} as Record<string, string>,
    href: '',
    rel: '',
    type: '',
    remove: () => {
      managed = undefined
    },
    removeAttribute: (name: string) => {
      if (name === 'type') link.type = ''
    }
  }
  const originalDocument = globalThis.document

  Object.assign(globalThis, {
    document: {
      createElement: () => link,
      head: {
        append: (node: Record<string, unknown>) => {
          managed = node
        },
        querySelector: (selector: string) =>
          selector.includes(':not') ? (explicit ? {} : null) : managed
      }
    }
  })

  try {
    applyFavicon('/logo.svg')
    assert.equal(managed, link)
    assert.equal(link.rel, 'icon')
    assert.equal(link.href, '/logo.svg')
    assert.equal(link.type, 'image/svg+xml')

    applyFavicon('/favicon.png')
    assert.equal(link.href, '/favicon.png')
    assert.equal(link.type, '')

    explicit = true
    applyFavicon('/logo.svg')
    assert.equal(managed, undefined)
  } finally {
    Object.assign(globalThis, { document: originalDocument })
  }
})

test('optically aligns an automatically derived favicon without scaling it', () => {
  const dataUrl = createAlignedFaviconDataUrl(
    'data:image/svg+xml;base64,PHN2Zy8+',
    { size: 100, offsetX: 0, offsetY: 4.5 }
  )
  const svg = decodeURIComponent(dataUrl.slice(dataUrl.indexOf(',') + 1))

  assert.match(svg, /x="0" y="4.5"/)
  assert.match(svg, /width="100" height="100"/)
  assert.match(svg, /preserveAspectRatio="xMidYMid meet"/)
})

test('falls back to default favicon geometry for non-finite values', () => {
  const dataUrl = createAlignedFaviconDataUrl('data:image/png;base64,AA==', {
    size: Number.NaN,
    offsetX: Number.POSITIVE_INFINITY,
    offsetY: Number.NEGATIVE_INFINITY
  })
  const svg = decodeURIComponent(dataUrl.slice(dataUrl.indexOf(',') + 1))

  assert.match(svg, /x="0" y="0"/)
  assert.match(svg, /width="100" height="100"/)
  assert.doesNotMatch(svg, /(?:NaN|Infinity)/)
})

test('clamps finite favicon geometry at both ends of the supported ranges', () => {
  const cases = [
    {
      transform: { size: 500, offsetX: -500, offsetY: 500 },
      geometry: 'x="-150" y="50" width="200" height="200"'
    },
    {
      transform: { size: -1, offsetX: 500, offsetY: -500 },
      geometry: 'x="145" y="-55" width="10" height="10"'
    }
  ]

  for (const { transform, geometry } of cases) {
    const dataUrl = createAlignedFaviconDataUrl(
      'data:image/png;base64,AA==',
      transform
    )
    const svg = decodeURIComponent(dataUrl.slice(dataUrl.indexOf(',') + 1))

    assert.ok(svg.includes(geometry), svg)
  }
})

test('reads favicon geometry from CSS custom properties', () => {
  const originalDocument = globalThis.document
  const originalGetComputedStyle = globalThis.getComputedStyle
  const values: Record<string, string> = {
    '--inpress-favicon-size': '92%',
    '--inpress-favicon-offset-x': '-2%',
    '--inpress-favicon-offset-y': '4.5%'
  }

  Object.assign(globalThis, {
    document: { documentElement: {} },
    getComputedStyle: () => ({
      getPropertyValue: (name: string) => values[name] ?? ''
    })
  })

  try {
    assert.deepEqual(readFaviconTransform(), {
      size: 92,
      offsetX: -2,
      offsetY: 4.5
    })
  } finally {
    Object.assign(globalThis, {
      document: originalDocument,
      getComputedStyle: originalGetComputedStyle
    })
  }
})
