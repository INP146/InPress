import { resolveProviderLinkText } from './link-text'

function hasUrlLinkText(link: HTMLAnchorElement): boolean {
  if (link.childElementCount > 0) return false

  const text = link.textContent?.trim()
  if (!text) return false

  try {
    return new URL(text, link.baseURI).href === link.href
  } catch {
    return false
  }
}

export function updateAutoLinkText(
  link: HTMLAnchorElement,
  enabled: boolean
): void {
  const originalText = link.dataset.inpressAutoLinkText

  if (!enabled) {
    if (originalText !== undefined) {
      link.textContent = originalText
      delete link.dataset.inpressAutoLinkText
    }
    return
  }

  if (originalText !== undefined || !hasUrlLinkText(link)) return

  const label = resolveProviderLinkText(link.href)
  if (!label) return

  link.dataset.inpressAutoLinkText = link.textContent ?? ''
  link.textContent = label
}

export function applyAutoLinkText(root: ParentNode, enabled: boolean): void {
  if (
    root instanceof HTMLAnchorElement &&
    root.matches('.vp-doc a[href]')
  ) {
    updateAutoLinkText(root, enabled)
  }

  root
    .querySelectorAll<HTMLAnchorElement>('.vp-doc a[href]')
    .forEach((link) => updateAutoLinkText(link, enabled))
}

export function observeAutoLinkText(
  root: Node,
  enabled: () => boolean
): MutationObserver {
  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === 'attributes') {
        if (record.target instanceof HTMLAnchorElement) {
          const originalText = record.target.dataset.inpressAutoLinkText
          if (originalText !== undefined) {
            record.target.textContent = originalText
            delete record.target.dataset.inpressAutoLinkText
          }
          updateAutoLinkText(record.target, enabled())
        }
        return
      }

      record.addedNodes.forEach((node) => {
        const parent = node instanceof Element ? node : node.parentElement
        if (parent) applyAutoLinkText(parent, enabled())
      })
    })
  })

  observer.observe(root, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['href']
  })
  return observer
}
