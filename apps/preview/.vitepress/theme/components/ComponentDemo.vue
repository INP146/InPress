<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  linkIconProviders,
  ThemeCheckbox,
  ThemeSwitch,
  type LinkIconProvider
} from '@inp146/inpress'

const props = defineProps<{
  kind: 'checkbox' | 'switch' | 'marker' | 'providers'
  locale: 'en' | 'zh'
}>()

const releaseNotes = ref(true)
const productUpdates = ref(false)
const compactNavigation = ref(true)
const reduceMotion = ref(false)
const isZh = computed(() => props.locale === 'zh')

const providerUrls = {
  github: 'https://github.com/vuejs/vitepress',
  gitlab: 'https://gitlab.com/gitlab-org/gitlab',
  npm: 'https://www.npmjs.com/package/vitepress',
  discord: 'https://discord.gg/vitepress',
  telegram: 'https://t.me/vuejs',
  linkedin: 'https://www.linkedin.com/company/vuejs',
  reddit: 'https://www.reddit.com/r/vuejs',
  twitch: 'https://www.twitch.tv/vuejs',
  tiktok: 'https://www.tiktok.com/@vuejs',
  weibo: 'https://www.weibo.com/',
  xiaohongshu: 'https://www.xiaohongshu.com/',
  zhihu: 'https://www.zhihu.com/',
  juejin: 'https://juejin.cn/',
  x: 'https://x.com/vuejs',
  instagram: 'https://www.instagram.com/vuejs',
  threads: 'https://www.threads.net/@vuejs',
  youtube: 'https://www.youtube.com/@vuejs',
  bilibili: 'https://www.bilibili.com/'
} satisfies Record<LinkIconProvider, string>

const providerLabels: Record<
  'en' | 'zh',
  Partial<Record<LinkIconProvider, string>>
> = {
  en: {
    discord: 'Discord',
    telegram: 'Telegram',
    linkedin: 'LinkedIn',
    reddit: 'Reddit',
    twitch: 'Twitch',
    tiktok: 'TikTok',
    weibo: 'Weibo',
    xiaohongshu: 'Xiaohongshu',
    zhihu: 'Zhihu',
    juejin: 'Juejin',
    x: 'X',
    instagram: 'Instagram',
    threads: 'Threads',
    youtube: 'YouTube',
    bilibili: 'Bilibili'
  },
  zh: {
    discord: 'Discord',
    telegram: 'Telegram',
    linkedin: 'LinkedIn',
    reddit: 'Reddit',
    twitch: 'Twitch',
    tiktok: 'TikTok',
    weibo: '微博',
    xiaohongshu: '小红书',
    zhihu: '知乎',
    juejin: '掘金',
    x: 'X',
    instagram: 'Instagram',
    threads: 'Threads',
    youtube: 'YouTube',
    bilibili: '哔哩哔哩'
  }
}
</script>

<template>
  <div class="component-demo" :class="`${kind}-demo`">
    <template v-if="kind === 'checkbox'">
      <ThemeCheckbox v-model="releaseNotes">
        {{ isZh ? '版本更新' : 'Release notes' }}
      </ThemeCheckbox>
      <ThemeCheckbox v-model="productUpdates">
        {{ isZh ? '产品动态' : 'Product updates' }}
      </ThemeCheckbox>
      <ThemeCheckbox :model-value="true" disabled>
        {{ isZh ? '已禁用的选中项' : 'Disabled selection' }}
      </ThemeCheckbox>
      <ThemeCheckbox :model-value="false" disabled>
        {{ isZh ? '已禁用的选项' : 'Disabled option' }}
      </ThemeCheckbox>
    </template>

    <template v-else-if="kind === 'switch'">
      <div class="switch-demo-row">
        <span>{{ isZh ? '紧凑导航' : 'Compact navigation' }}</span>
        <ThemeSwitch
          v-model="compactNavigation"
          :aria-label="isZh ? '紧凑导航' : 'Compact navigation'"
        />
      </div>
      <div class="switch-demo-row">
        <span>{{ isZh ? '减少动画' : 'Reduce motion' }}</span>
        <ThemeSwitch
          v-model="reduceMotion"
          :aria-label="isZh ? '减少动画' : 'Reduce motion'"
        />
      </div>
      <div class="switch-demo-row">
        <span>{{ isZh ? '不可用设置' : 'Unavailable setting' }}</span>
        <ThemeSwitch
          :model-value="false"
          :aria-label="isZh ? '不可用设置' : 'Unavailable setting'"
          disabled
        />
      </div>
    </template>

    <template v-else-if="kind === 'marker'">
      <p v-if="isZh">这句话包含一段<mark>记号笔下划线</mark>。</p>
      <p v-else>This sentence contains a <mark>marker underline</mark>.</p>
      <p v-if="isZh">
        这句话包含一段<mark class="highlight">填充高亮</mark>。
      </p>
      <p v-else>
        This sentence contains a <mark class="highlight">filled highlight</mark>.
      </p>
    </template>

    <template v-else>
      <div
        v-for="provider in linkIconProviders"
        :key="provider"
        class="provider-demo-item"
      >
        <span>{{ provider }}</span>
        <a :href="providerUrls[provider]">
          {{ providerLabels[locale][provider] ?? providerUrls[provider] }}
        </a>
      </div>
    </template>
  </div>
</template>

<style scoped>
.component-demo {
  margin: 16px 0 20px;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
}

.checkbox-demo,
.providers-demo {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.switch-demo {
  display: grid;
  padding-block: 4px;
}

.switch-demo-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 44px;
  padding: 0 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.switch-demo-row:last-child {
  border-bottom: 0;
}

.marker-demo p {
  margin: 8px 0;
}

.provider-demo-item {
  display: grid;
  align-content: center;
  gap: 2px;
  min-width: 0;
  min-height: 52px;
  padding: 4px 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.provider-demo-item > span {
  color: var(--vp-c-text-3);
  font-size: 11px;
  line-height: 16px;
  text-transform: uppercase;
}

.provider-demo-item a {
  min-width: 0;
  overflow-wrap: anywhere;
}

@media (max-width: 640px) {
  .checkbox-demo,
  .providers-demo {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
