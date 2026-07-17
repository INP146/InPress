const HOME_LOGO_CLASS = 'inpress-home-logo-monochrome-image'
const HOME_LOGO_IMAGE = '--inpress-home-logo-image'

function cssUrl(value: string): string {
  return `url(${JSON.stringify(value)})`
}

export function applyHomeLogoMonochrome(enabled: boolean): void {
  document.querySelectorAll<HTMLElement>(`.${HOME_LOGO_CLASS}`).forEach((node) => {
    node.classList.remove(HOME_LOGO_CLASS)
    node.style.removeProperty(HOME_LOGO_IMAGE)
  })

  if (!enabled) return

  const image = document.querySelector<HTMLImageElement>(
    '.VPHomeHero .image-src'
  )
  const container = image?.closest<HTMLElement>('.image-container')
  const source = image?.currentSrc || image?.src
  if (!container || !source) return

  container.style.setProperty(HOME_LOGO_IMAGE, cssUrl(source))
  container.classList.add(HOME_LOGO_CLASS)
}
