import bilibiliIcon from './assets/bilibili.svg?url'
import discordIcon from './assets/discord.svg?url'
import githubIcon from './assets/github.svg?url'
import gitlabIcon from './assets/gitlab.svg?url'
import instagramIcon from './assets/instagram.svg?url'
import linkedinIcon from './assets/linkedin.svg?url'
import npmIcon from './assets/npm.svg?url'
import redditIcon from './assets/reddit.svg?url'
import telegramIcon from './assets/telegram.svg?url'
import threadsIcon from './assets/threads.svg?url'
import tiktokIcon from './assets/tiktok.svg?url'
import twitchIcon from './assets/twitch.svg?url'
import weiboIcon from './assets/weibo.svg?url'
import xIcon from './assets/x.svg?url'
import xiaohongshuIcon from './assets/xiaohongshu.svg?url'
import youtubeIcon from './assets/youtube.svg?url'
import zhihuIcon from './assets/zhihu.svg?url'
import juejinIcon from './assets/juejin.svg?url'

type ProviderIconDefinition = {
  icon: string
  monochrome?: boolean
  offset?: string
  inlineSize?: string
  aspectRatio?: string
  urls: readonly string[]
  getLinkText?: (url: URL) => string | undefined
}

function decodePathSegment(segment: string): string {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

function getRepositoryLinkText(url: URL): string | undefined {
  const [owner, repository] = url.pathname
    .split('/')
    .filter(Boolean)
    .map(decodePathSegment)

  if (!owner) return undefined
  return repository ? `${owner}/${repository}` : owner
}

function getNpmPackageLinkText(url: URL): string | undefined {
  const path = url.pathname.split('/').filter(Boolean).map(decodePathSegment)

  return path[0] === 'package' && path.length > 1
    ? path.slice(1).join('/')
    : undefined
}

const providerIcons = {
  github: {
    icon: githubIcon,
    monochrome: true,
    offset: 'calc(var(--theme-provider-link-icon-offset,-1px) - 1px)',
    urls: ['https://github.com/', 'https://www.github.com/'],
    getLinkText: getRepositoryLinkText
  },
  gitlab: {
    icon: gitlabIcon,
    urls: ['https://gitlab.com/', 'https://www.gitlab.com/'],
    getLinkText: getRepositoryLinkText
  },
  npm: {
    icon: npmIcon,
    urls: ['https://npmjs.com/', 'https://www.npmjs.com/'],
    getLinkText: getNpmPackageLinkText
  },
  discord: {
    icon: discordIcon,
    urls: ['https://discord.com/', 'https://discord.gg/']
  },
  telegram: {
    icon: telegramIcon,
    urls: ['https://t.me/', 'https://telegram.me/', 'https://telegram.org/']
  },
  linkedin: {
    icon: linkedinIcon,
    urls: ['https://linkedin.com/', 'https://www.linkedin.com/']
  },
  reddit: {
    icon: redditIcon,
    urls: ['https://reddit.com/', 'https://www.reddit.com/']
  },
  twitch: {
    icon: twitchIcon,
    urls: ['https://twitch.tv/', 'https://www.twitch.tv/']
  },
  tiktok: {
    icon: tiktokIcon,
    urls: ['https://tiktok.com/', 'https://www.tiktok.com/']
  },
  weibo: {
    icon: weiboIcon,
    urls: ['https://weibo.com/', 'https://www.weibo.com/']
  },
  xiaohongshu: {
    icon: xiaohongshuIcon,
    urls: ['https://xiaohongshu.com/', 'https://www.xiaohongshu.com/']
  },
  zhihu: {
    icon: zhihuIcon,
    urls: ['https://zhihu.com/', 'https://www.zhihu.com/']
  },
  juejin: {
    icon: juejinIcon,
    urls: ['https://juejin.cn/']
  },
  x: {
    icon: xIcon,
    monochrome: true,
    offset: 'calc(var(--theme-provider-link-icon-offset,-1px) - 1px)',
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
    offset: 'calc(var(--theme-provider-link-icon-offset,-1px) - 1px)',
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
} as const satisfies Record<string, ProviderIconDefinition>

export const linkIconProviders = Object.keys(providerIcons) as Array<
  keyof typeof providerIcons
>

export type LinkIconProvider = keyof typeof providerIcons

export function resolveProviderLinkText(href: string): string | undefined {
  let url: URL

  try {
    url = new URL(href)
  } catch {
    return undefined
  }

  const providerIcon = Object.values(providerIcons).find(({ urls }) =>
    urls.some((providerUrl) => url.href.startsWith(providerUrl))
  )

  return providerIcon && 'getLinkText' in providerIcon
    ? providerIcon.getLinkText(url)
    : undefined
}

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
      const offset =
        'offset' in providerIcon
          ? providerIcon.offset
          : 'var(--theme-provider-link-icon-offset,-1px)'

      return `${selectors}{content:"";display:inline-block;box-sizing:border-box;inline-size:${inlineSize};block-size:var(--theme-provider-link-icon-size,20px);aspect-ratio:${aspectRatio};margin-inline-end:var(--theme-provider-link-icon-gap,4px);vertical-align:var(--theme-provider-link-icon-align,middle);transform:translateY(${offset});${iconStyle}}`
    })
    .join('')
}
