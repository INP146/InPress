export function createProviderLinkSelectors(
  urls: readonly string[]
): string {
  return urls
    .map((url) => `.vp-doc a[href^="${url}" i]::before`)
    .join(',')
}