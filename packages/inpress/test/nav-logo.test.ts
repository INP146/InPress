import assert from 'node:assert/strict'
import test from 'node:test'
import { applyNavLogoMonochrome } from '../src/nav-logo'

test('uses the active navigation image as a current-color mask', () => {
  const titleClasses = new Set<string>()
  const maskClasses = new Set<string>()
  const maskStyles = new Map<string, string>()
  let insertedMask: Record<string, unknown> | undefined
  const mask = {
    className: '',
    classList: {
      contains: (value: string) => maskClasses.has(value)
    },
    parentNode: {},
    remove: () => {
      insertedMask = undefined
      mask.parentNode = null
    },
    setAttribute: () => undefined,
    style: {
      set width(value: string) {
        maskStyles.set('width', value)
      },
      set height(value: string) {
        maskStyles.set('height', value)
      },
      setProperty: (name: string, value: string) =>
        maskStyles.set(name, value)
    }
  }
  const lightImage = {
    classList: { contains: (value: string) => value === 'light' },
    complete: true,
    currentSrc: 'https://docs.example.com/logo-light.svg',
    getBoundingClientRect: () => ({ width: 28, height: 22 }),
    parentNode: {
      insertBefore: (node: Record<string, unknown>) => {
        insertedMask = node
      }
    },
    src: 'https://docs.example.com/logo-light.svg',
    width: 28,
    height: 22
  }
  const darkImage = {
    ...lightImage,
    classList: { contains: (value: string) => value === 'dark' },
    currentSrc: 'https://docs.example.com/logo-dark.svg',
    src: 'https://docs.example.com/logo-dark.svg'
  }
  const title = {
    classList: {
      add: (value: string) => titleClasses.add(value),
      remove: (value: string) => titleClasses.delete(value)
    },
    querySelectorAll: () => [darkImage, lightImage]
  }
  const originalDocument = globalThis.document
  let isDark = false

  Object.assign(globalThis, {
    document: {
      createElement: () => mask,
      documentElement: {
        classList: { contains: () => isDark }
      },
      querySelector: () => title,
      querySelectorAll: (selector: string) => {
        if (selector.includes('title')) return [title]
        return selector.includes('image') && insertedMask ? [mask] : []
      }
    }
  })

  try {
    applyNavLogoMonochrome(true)
    assert.equal(insertedMask, mask)
    assert(titleClasses.has('inpress-nav-logo-monochrome-title'))
    assert.equal(
      maskStyles.get('--inpress-nav-logo-image'),
      'url("https://docs.example.com/logo-light.svg")'
    )
    assert.equal(maskStyles.get('width'), '28px')
    assert.equal(maskStyles.get('height'), '22px')

    isDark = true
    applyNavLogoMonochrome(true)
    assert.equal(
      maskStyles.get('--inpress-nav-logo-image'),
      'url("https://docs.example.com/logo-dark.svg")'
    )

    applyNavLogoMonochrome(false)
    assert.equal(insertedMask, undefined)
    assert.equal(titleClasses.size, 0)
  } finally {
    Object.assign(globalThis, { document: originalDocument })
  }
})
