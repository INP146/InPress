import bilibiliIcon from './assets/bilibili.svg?url'
import githubIcon from './assets/github.svg?url'
import instagramIcon from './assets/instagram.svg?url'
import threadsIcon from './assets/threads.svg?url'
import xIcon from './assets/x.svg?url'
import youtubeIcon from './assets/youtube.svg?url'

const providerIcons = {
  github: {
    icon: githubIcon,
    monochrome: true,
    urls: ['https://github.com/', 'https://www.github.com/']
  },
  x: {
    icon: xIcon,
    monochrome: true,
    urls: [
      'https://x.com/',
      'https://www.x.com/',
      'https://twitter.com/',
      'https://www.twitter.com/'
    ]
  },
  instagram: {
    icon: instagramIcon,
    urls: ['https://instagram.com/', 'https://www.instagram.com/']
  },
  threads: {
    icon: threadsIcon,
    monochrome: true,
    inlineSize: 'var(--theme-provider-link-icon-threads-width,17.5px)',
    aspectRatio: '7 / 8',
    urls: ['https://threads.net/', 'https://www.threads.net/']
  },
  youtube: {
    icon: youtubeIcon,
    urls: [
      'https://youtube.com/',
      'https://www.youtube.com/',
      'https://youtu.be/'
    ]
  },
  bilibili: {
    icon: bilibiliIcon,
    urls: [
      'https://bilibili.com/',
      'https://www.bilibili.com/',
      'https://b23.tv/'
    ]
  }
} as const

export const linkIconProviders = Object.keys(providerIcons) as Array<
  keyof typeof providerIcons
>

export type LinkIconProvider = keyof typeof providerIcons

export function createLinkIconStyle(
  providers: readonly LinkIconProvider[] = []
): string {
  const uniqueProviders = [...new Set(providers)]

  return uniqueProviders
    .map((provider) => {
      const providerIcon = providerIcons[provider]
      const { icon, urls } = providerIcon
      const selectors = urls
        .map((url) => `.vp-doc a[href^="${url}"]::before`)
        .join(',')

      const iconStyle =
        'monochrome' in providerIcons[provider]
          ? `background-color:currentColor;-webkit-mask-image:url("${icon}");-webkit-mask-position:center;-webkit-mask-repeat:no-repeat;-webkit-mask-size:contain;mask-image:url("${icon}");mask-mode:alpha;mask-position:center;mask-repeat:no-repeat;mask-size:contain;`
          : `background-image:url("${icon}");background-position:center;background-repeat:no-repeat;background-size:100% 100%;`
      const inlineSize =
        'inlineSize' in providerIcon
          ? providerIcon.inlineSize
          : 'var(--theme-provider-link-icon-size,20px)'
      const aspectRatio =
        'aspectRatio' in providerIcon ? providerIcon.aspectRatio : '1'

      return `${selectors}{content:"";display:inline-block;box-sizing:border-box;inline-size:${inlineSize};block-size:var(--theme-provider-link-icon-size,20px);aspect-ratio:${aspectRatio};margin-inline-end:var(--theme-provider-link-icon-gap,4px);vertical-align:var(--theme-provider-link-icon-align,-0.125em);${iconStyle}}`
    })
    .join('')
}
