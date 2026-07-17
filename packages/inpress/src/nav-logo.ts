const NAV_LOGO_CLASS = 'inpress-nav-logo-monochrome-image'
const NAV_TITLE_CLASS = 'inpress-nav-logo-monochrome-title'
const NAV_LOGO_IMAGE = '--inpress-nav-logo-image'

function cssUrl(value: string): string {
  return `url(${JSON.stringify(value)})`
}

function findActiveLogo(
  images: readonly HTMLImageElement[]
): HTMLImageElement | undefined {
  if (images.length <= 1) return images[0]

  const isDark = document.documentElement.classList.contains('dark')
  return (
    images.find((image) => {
      const dark = image.classList.contains('dark')
      const light = image.classList.contains('light')
      return (!dark && !light) || (isDark ? dark : light)
    }) ?? images[0]
  )
}

function syncMaskSize(mask: HTMLElement, image: HTMLImageElement): void {
  const bounds = image.getBoundingClientRect()
  const width = bounds.width || image.width
  const height = bounds.height || image.height

  if (width > 0) mask.style.width = `${width}px`
  if (height > 0) mask.style.height = `${height}px`
}

export function applyNavLogoMonochrome(enabled: boolean): void {
  document.querySelectorAll<HTMLElement>(`.${NAV_LOGO_CLASS}`).forEach((node) =>
    node.remove()
  )
  document.querySelectorAll<HTMLElement>(`.${NAV_TITLE_CLASS}`).forEach((node) =>
    node.classList.remove(NAV_TITLE_CLASS)
  )

  if (!enabled) return

  const title = document.querySelector<HTMLElement>('.VPNavBarTitle .title')
  const images = title
    ? Array.from(title.querySelectorAll<HTMLImageElement>('.logo'))
    : []
  const image = findActiveLogo(images)
  const source = image?.currentSrc || image?.src
  if (!title || !image || !source) return

  const mask = document.createElement('span')
  mask.className = NAV_LOGO_CLASS
  mask.setAttribute('aria-hidden', 'true')
  mask.style.setProperty(NAV_LOGO_IMAGE, cssUrl(source))
  syncMaskSize(mask, image)

  image.parentNode?.insertBefore(mask, image)
  title.classList.add(NAV_TITLE_CLASS)

  if (!image.complete) {
    image.addEventListener(
      'load',
      () => {
        if (mask.parentNode) syncMaskSize(mask, image)
      },
      { once: true }
    )
  }
}
