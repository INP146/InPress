import assert from 'node:assert/strict'
import test from 'node:test'
import { applyHomeLogoMonochrome } from '../src/home-logo'

test('uses the current home image as a brand-color mask', () => {
  const classes = new Set<string>()
  const styles = new Map<string, string>()
  const container = {
    classList: {
      add: (value: string) => classes.add(value),
      remove: (value: string) => classes.delete(value)
    },
    style: {
      removeProperty: (name: string) => styles.delete(name),
      setProperty: (name: string, value: string) => styles.set(name, value)
    }
  }
  const image = {
    closest: () => container,
    currentSrc: 'https://docs.example.com/logo.svg',
    src: 'https://docs.example.com/logo.svg'
  }
  const originalDocument = globalThis.document

  Object.assign(globalThis, {
    document: {
      querySelector: () => image,
      querySelectorAll: () => (classes.size ? [container] : [])
    }
  })

  try {
    applyHomeLogoMonochrome(true)
    assert(classes.has('inpress-home-logo-monochrome-image'))
    assert.equal(
      styles.get('--inpress-home-logo-image'),
      'url("https://docs.example.com/logo.svg")'
    )

    applyHomeLogoMonochrome(false)
    assert.equal(classes.size, 0)
    assert.equal(styles.size, 0)
  } finally {
    Object.assign(globalThis, { document: originalDocument })
  }
})
