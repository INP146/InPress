import type { DefaultTheme } from 'vitepress/theme'

const FAVICON_SELECTOR = 'link[data-inpress-favicon]'
const EXPLICIT_FAVICON_SELECTOR =
  'link[rel~="icon"]:not([data-inpress-favicon])'

const DEFAULT_FAVICON_TRANSFORM: FaviconTransform = {
  size: 100,
  offsetX: 0,
  offsetY: 0
}

let faviconGeneration = 0

export type FaviconConfig = boolean | DefaultTheme.ThemeableImage

export interface FaviconTransform {
  size: number
  offsetX: number
  offsetY: number
}

export function resolveFaviconSource(
  favicon: FaviconConfig | undefined,
  logo: DefaultTheme.ThemeableImage | undefined,
  isDark: boolean
): string | undefined {
  if (favicon === false) return undefined

  const image = favicon === true || favicon === undefined ? logo : favicon
  if (!image) return undefined
  if (typeof image === 'string') return image
  if ('src' in image) return image.src
  return isDark ? image.dark : image.light
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function readPercentage(
  style: CSSStyleDeclaration,
  property: string,
  fallback: number
): number {
  const value = Number.parseFloat(style.getPropertyValue(property))
  return Number.isFinite(value) ? value : fallback
}

export function readFaviconTransform(): FaviconTransform {
  const style = getComputedStyle(document.documentElement)
  return {
    size: readPercentage(style, '--inpress-favicon-size', 100),
    offsetX: readPercentage(style, '--inpress-favicon-offset-x', 0),
    offsetY: readPercentage(style, '--inpress-favicon-offset-y', 0)
  }
}

export function createAlignedFaviconDataUrl(
  embeddedSource: string,
  transform: FaviconTransform = DEFAULT_FAVICON_TRANSFORM
): string {
  const size = Math.max(10, Math.min(transform.size, 200))
  const offsetX = Math.max(-100, Math.min(transform.offsetX, 100))
  const offsetY = Math.max(-100, Math.min(transform.offsetY, 100))
  const x = (100 - size) / 2 + offsetX
  const y = (100 - size) / 2 + offsetY
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><image href="${escapeAttribute(embeddedSource)}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(String(reader.result)))
    reader.addEventListener('error', () => reject(reader.error))
    reader.readAsDataURL(blob)
  })
}

async function createAlignedFavicon(
  source: string,
  transform: FaviconTransform
): Promise<string> {
  const response = await fetch(source)
  if (!response.ok) throw new Error(`Unable to load favicon: ${response.status}`)

  return createAlignedFaviconDataUrl(
    await readBlobAsDataUrl(await response.blob()),
    transform
  )
}

export function applyFavicon(
  source: string | undefined,
  transform: FaviconTransform = DEFAULT_FAVICON_TRANSFORM
): void {
  const generation = ++faviconGeneration
  const managed = document.head.querySelector<HTMLLinkElement>(FAVICON_SELECTOR)
  const explicit = document.head.querySelector<HTMLLinkElement>(
    EXPLICIT_FAVICON_SELECTOR
  )

  if (!source || explicit) {
    managed?.remove()
    return
  }

  const link = managed ?? document.createElement('link')
  link.rel = 'icon'
  link.href = source
  link.dataset.inpressFavicon = ''

  if (/\.svg(?:$|[?#])/i.test(source)) {
    link.type = 'image/svg+xml'
  } else {
    link.removeAttribute('type')
  }

  if (!managed) document.head.append(link)

  const transformed =
    transform.size !== 100 ||
    transform.offsetX !== 0 ||
    transform.offsetY !== 0

  if (transformed) {
    void createAlignedFavicon(source, transform).then(
      (href) => {
        if (generation === faviconGeneration && link.isConnected) {
          link.href = href
          link.type = 'image/svg+xml'
        }
      },
      () => undefined
    )
  }
}
