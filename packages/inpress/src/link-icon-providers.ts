export const linkIconProviders = [
  'github',
  'gitlab',
  'npm',
  'discord',
  'telegram',
  'linkedin',
  'reddit',
  'twitch',
  'tiktok',
  'weibo',
  'xiaohongshu',
  'zhihu',
  'juejin',
  'x',
  'instagram',
  'threads',
  'youtube',
  'bilibili'
] as const

export type LinkIconProvider = (typeof linkIconProviders)[number]
