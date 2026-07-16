<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { linkIconProviders, type LinkIconProvider } from '../link-icons'
import { useThemeRuntime } from '../runtime'
import type {
  AppearanceTransitionMode,
  Inp146ThemeConfig,
  ThemeCssVars
} from '../index'

interface PlaygroundState {
  root: Record<string, string>
  dark: Record<string, string>
  linkIcons: boolean
  providers: LinkIconProvider[]
  autoLinkText: boolean
  hideLinkUnderline: boolean
  appearanceTransition: boolean
  appearanceTransitionMode: AppearanceTransitionMode
  giscus: boolean
}

const props = withDefaults(
  defineProps<{
    persist?: boolean
    storageKey?: string
    initiallyOpen?: boolean
  }>(),
  {
    persist: false,
    storageKey: 'inp146-theme-playground',
    initiallyOpen: false
  }
)

const variableGroups = [
  {
    en: 'Brand colors',
    zh: '品牌颜色',
    fields: [
      { key: '--vp-c-brand-1', en: 'Brand primary', zh: '主品牌色' },
      { key: '--vp-c-brand-2', en: 'Brand hover', zh: '品牌悬停色' },
      { key: '--vp-c-brand-3', en: 'Brand active', zh: '品牌激活色' },
      { key: '--vp-c-brand-soft', en: 'Brand soft', zh: '品牌柔和色' },
      { key: '--vp-button-brand-bg', en: 'Button background', zh: '按钮背景色' },
      { key: '--vp-button-brand-text', en: 'Button text', zh: '按钮文字色' },
      { key: '--vp-button-brand-border', en: 'Button border', zh: '按钮边框色' },
      {
        key: '--vp-button-brand-hover-bg',
        en: 'Button hover background',
        zh: '按钮悬停背景色'
      },
      {
        key: '--vp-button-brand-hover-text',
        en: 'Button hover text',
        zh: '按钮悬停文字色'
      },
      {
        key: '--vp-button-brand-hover-border',
        en: 'Button hover border',
        zh: '按钮悬停边框色'
      },
      {
        key: '--vp-home-hero-name-color',
        en: 'Hero name color',
        zh: '首页标题颜色'
      },
      {
        key: '--vp-home-hero-name-background',
        en: 'Hero name background',
        zh: '首页标题背景'
      }
    ]
  },
  {
    en: 'Markers',
    zh: '文本记号笔',
    fields: [
      { key: '--theme-marker-color', en: 'Underline color', zh: '下划线颜色' },
      {
        key: '--theme-marker-highlight-color',
        en: 'Highlight color',
        zh: '高亮颜色'
      },
      {
        key: '--theme-marker-thickness',
        en: 'Underline thickness',
        zh: '下划线粗细'
      },
      { key: '--theme-marker-offset', en: 'Underline offset', zh: '下划线偏移' },
      {
        key: '--theme-marker-highlight-radius',
        en: 'Highlight radius',
        zh: '高亮圆角'
      }
    ]
  },
  {
    en: 'Provider icons',
    zh: '平台链接图标',
    fields: [
      { key: '--theme-provider-link-icon-size', en: 'Icon size', zh: '图标尺寸' },
      {
        key: '--theme-provider-link-icon-threads-width',
        en: 'Threads width',
        zh: 'Threads 宽度'
      },
      { key: '--theme-provider-link-icon-gap', en: 'Text gap', zh: '文字间距' },
      {
        key: '--theme-provider-link-icon-align',
        en: 'Vertical align',
        zh: '垂直对齐'
      },
      {
        key: '--theme-provider-link-icon-offset',
        en: 'Vertical offset',
        zh: '垂直偏移'
      }
    ]
  }
] as const

const themeVariableDefaults: Record<string, string> = {
  '--theme-marker-color': 'var(--vp-c-brand-soft)',
  '--theme-marker-highlight-color': 'var(--vp-c-brand-1)',
  '--theme-marker-thickness': '9px',
  '--theme-marker-offset': '-4px',
  '--theme-marker-highlight-radius': '5px',
  '--theme-provider-link-icon-size': '20px',
  '--theme-provider-link-icon-threads-width': '17.5px',
  '--theme-provider-link-icon-gap': '4px',
  '--theme-provider-link-icon-align': 'middle',
  '--theme-provider-link-icon-offset': '-1px'
}

const knownVariableNames = new Set<string>(
  variableGroups.flatMap((group) => group.fields.map((field) => field.key))
)

const runtime = useThemeRuntime()
const { lang } = useData()
const open = ref(props.initiallyOpen)
const mode = ref<'root' | 'dark'>('root')
const copied = ref(false)
const customVarName = ref('')
const customVarValue = ref('')
const isZh = computed(() => lang.value.toLowerCase().startsWith('zh'))
const label = (en: string, zh: string) => (isZh.value ? zh : en)

function stringVars(values: ThemeCssVars | undefined): Record<string, string> {
  return Object.fromEntries(
    Object.entries(values ?? {}).map(([key, value]) => [key, String(value)])
  )
}

function createState(theme: Inp146ThemeConfig): PlaygroundState {
  return {
    root: {
      ...themeVariableDefaults,
      ...stringVars(theme.cssVars?.root)
    },
    dark: stringVars(theme.cssVars?.dark),
    linkIcons: theme.linkIcons !== false,
    providers: Array.isArray(theme.linkIcons)
      ? [...theme.linkIcons]
      : [...linkIconProviders],
    autoLinkText: theme.autoLinkText !== false,
    hideLinkUnderline: theme.hideLinkUnderline !== false,
    appearanceTransition: theme.appearanceTransition !== false,
    appearanceTransitionMode:
      typeof theme.appearanceTransition === 'string'
        ? theme.appearanceTransition
        : 'spread',
    giscus: Boolean(theme.giscus)
  }
}

const state = reactive(createState(runtime.baseTheme.value))
const hasGiscusConfig = computed(() => Boolean(runtime.baseTheme.value.giscus))
const activeVars = computed(() => state[mode.value])
const customVariables = computed(() =>
  Object.keys(activeVars.value)
    .filter((name) => !knownVariableNames.has(name))
    .sort()
)
const canAddCustomVariable = computed(
  () =>
    /^--[a-z0-9_-]+$/i.test(customVarName.value.trim()) &&
    customVarValue.value.trim().length > 0
)

function normalizeState(value: Partial<PlaygroundState>): PlaygroundState {
  const fallback = createState(runtime.baseTheme.value)
  const providers = Array.isArray(value.providers)
    ? value.providers.filter((provider): provider is LinkIconProvider =>
        linkIconProviders.includes(provider as LinkIconProvider)
      )
    : fallback.providers
  const appearanceTransitionMode =
    value.appearanceTransitionMode === 'fade' ||
    value.appearanceTransitionMode === 'spread'
      ? value.appearanceTransitionMode
      : fallback.appearanceTransitionMode

  return {
    root: { ...fallback.root, ...(value.root ?? {}) },
    dark: { ...fallback.dark, ...(value.dark ?? {}) },
    linkIcons: value.linkIcons ?? fallback.linkIcons,
    providers,
    autoLinkText: value.autoLinkText ?? fallback.autoLinkText,
    hideLinkUnderline:
      value.hideLinkUnderline ?? fallback.hideLinkUnderline,
    appearanceTransition:
      value.appearanceTransition ?? fallback.appearanceTransition,
    appearanceTransitionMode,
    giscus: hasGiscusConfig.value && (value.giscus ?? fallback.giscus)
  }
}

function assignState(value: PlaygroundState): void {
  state.root = { ...value.root }
  state.dark = { ...value.dark }
  state.linkIcons = value.linkIcons
  state.providers = [...value.providers]
  state.autoLinkText = value.autoLinkText
  state.hideLinkUnderline = value.hideLinkUnderline
  state.appearanceTransition = value.appearanceTransition
  state.appearanceTransitionMode = value.appearanceTransitionMode
  state.giscus = value.giscus
}

function cleanVars(values: Record<string, string>): ThemeCssVars {
  return Object.fromEntries(
    Object.entries(values)
      .map(([name, value]) => [name.trim(), value.trim()] as const)
      .filter(
        ([name, value]) => /^--[a-z0-9_-]+$/i.test(name) && value.length > 0
      )
  ) as ThemeCssVars
}

function createOverrides(): Partial<Inp146ThemeConfig> {
  return {
    cssVars: {
      root: cleanVars(state.root),
      dark: cleanVars(state.dark)
    },
    linkIcons: state.linkIcons ? [...state.providers] : false,
    autoLinkText: state.autoLinkText,
    hideLinkUnderline: state.hideLinkUnderline,
    appearanceTransition: state.appearanceTransition
      ? state.appearanceTransitionMode
      : false,
    giscus: state.giscus ? runtime.baseTheme.value.giscus : false
  }
}

function createExportConfig(): Partial<Inp146ThemeConfig> {
  const config = createOverrides()

  if (state.giscus) delete config.giscus
  return config
}

const output = computed(
  () => `themeConfig: ${JSON.stringify(createExportConfig(), null, 2)}`
)

watch(
  state,
  () => {
    runtime.setOverrides(createOverrides())

    if (props.persist && typeof localStorage !== 'undefined') {
      localStorage.setItem(props.storageKey, JSON.stringify(state))
    }
  },
  { deep: true, immediate: true }
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)

  if (!props.persist) return

  const saved = localStorage.getItem(props.storageKey)
  if (!saved) return

  try {
    assignState(normalizeState(JSON.parse(saved) as Partial<PlaygroundState>))
  } catch {
    localStorage.removeItem(props.storageKey)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  runtime.reset()
})

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') open.value = false
}

function toggleProvider(provider: LinkIconProvider): void {
  state.providers = state.providers.includes(provider)
    ? state.providers.filter((item) => item !== provider)
    : [...state.providers, provider]
}

function addCustomVariable(): void {
  if (!canAddCustomVariable.value) return

  activeVars.value[customVarName.value.trim()] = customVarValue.value.trim()
  customVarName.value = ''
  customVarValue.value = ''
}

function removeCustomVariable(name: string): void {
  delete activeVars.value[name]
}

function reset(): void {
  assignState(createState(runtime.baseTheme.value))
  runtime.reset()
  if (props.persist) localStorage.removeItem(props.storageKey)
}

async function copyConfig(): Promise<void> {
  try {
    await navigator.clipboard.writeText(output.value)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = output.value
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.append(textarea)
    textarea.select()
    document.execCommand('copy')
    textarea.remove()
  }

  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1600)
}
</script>

<template>
  <Teleport to="body">
    <button
      class="theme-playground-trigger"
      type="button"
      :aria-expanded="open"
      aria-controls="theme-config-playground"
      :title="label('Open theme playground', '打开主题调试面板')"
      @click="open = !open"
    >
      <span aria-hidden="true">◐</span>
      <span>{{ label('Theme', '主题') }}</span>
    </button>

    <Transition name="theme-playground-backdrop">
      <button
        v-if="open"
        class="theme-playground-backdrop"
        type="button"
        :aria-label="label('Close theme playground', '关闭主题调试面板')"
        @click="open = false"
      />
    </Transition>

    <Transition name="theme-playground-panel">
      <aside
        v-if="open"
        id="theme-config-playground"
        class="theme-playground-panel"
        :aria-label="label('Theme configuration', '主题配置')"
      >
        <header class="theme-playground-header">
          <div>
            <strong>{{ label('Theme configuration', '主题配置') }}</strong>
            <span>{{ label('Changes apply to this page', '修改会实时应用到当前页面') }}</span>
          </div>
          <button
            class="theme-playground-icon-button"
            type="button"
            :title="label('Close', '关闭')"
            @click="open = false"
          >
            ×
          </button>
        </header>

        <div class="theme-playground-body">
          <section class="theme-playground-mode-section">
            <div class="theme-playground-segmented" role="tablist">
              <button
                type="button"
                role="tab"
                :aria-selected="mode === 'root'"
                :class="{ active: mode === 'root' }"
                @click="mode = 'root'"
              >
                {{ label('Light', '浅色') }}
              </button>
              <button
                type="button"
                role="tab"
                :aria-selected="mode === 'dark'"
                :class="{ active: mode === 'dark' }"
                @click="mode = 'dark'"
              >
                {{ label('Dark', '深色') }}
              </button>
            </div>
          </section>

          <section
            v-for="group in variableGroups"
            :key="group.en"
            class="theme-playground-section"
          >
            <h2>{{ label(group.en, group.zh) }}</h2>
            <label
              v-for="field in group.fields"
              :key="field.key"
              class="theme-playground-color-row"
            >
              <span>{{ label(field.en, field.zh) }}</span>
              <input
                v-if="/^#[0-9a-f]{6}$/i.test(activeVars[field.key] ?? '')"
                v-model="activeVars[field.key]"
                type="color"
                :aria-label="label(field.en, field.zh)"
              />
              <input
                v-model="activeVars[field.key]"
                type="text"
                spellcheck="false"
                :placeholder="mode === 'dark' ? state.root[field.key] : ''"
              />
            </label>
          </section>

          <section class="theme-playground-section">
            <h2>{{ label('Custom CSS variables', '自定义 CSS 变量') }}</h2>

            <div
              v-for="name in customVariables"
              :key="name"
              class="theme-playground-custom-row"
            >
              <code>{{ name }}</code>
              <input v-model="activeVars[name]" type="text" spellcheck="false" />
              <button
                type="button"
                :title="label('Remove variable', '删除变量')"
                @click="removeCustomVariable(name)"
              >
                ×
              </button>
            </div>

            <form class="theme-playground-custom-form" @submit.prevent="addCustomVariable">
              <input
                v-model="customVarName"
                type="text"
                spellcheck="false"
                placeholder="--theme-example"
                :aria-label="label('Variable name', '变量名')"
              />
              <input
                v-model="customVarValue"
                type="text"
                spellcheck="false"
                placeholder="12px"
                :aria-label="label('Variable value', '变量值')"
              />
              <button
                type="submit"
                :disabled="!canAddCustomVariable"
                :title="label('Add variable', '添加变量')"
              >
                +
              </button>
            </form>
          </section>

          <section class="theme-playground-section">
            <h2>{{ label('Features', '功能') }}</h2>

            <label class="theme-playground-toggle-row">
              <span>{{ label('Provider link icons', '平台链接图标') }}</span>
              <input v-model="state.linkIcons" type="checkbox" role="switch" />
            </label>

            <div v-if="state.linkIcons" class="theme-playground-provider-grid">
              <label v-for="provider in linkIconProviders" :key="provider">
                <input
                  type="checkbox"
                  :checked="state.providers.includes(provider)"
                  @change="toggleProvider(provider)"
                />
                <span>{{ provider }}</span>
              </label>
            </div>

            <label class="theme-playground-toggle-row">
              <span>{{ label('Automatic link text', '自动链接文案') }}</span>
              <input v-model="state.autoLinkText" type="checkbox" role="switch" />
            </label>

            <label class="theme-playground-toggle-row">
              <span>{{ label('Hide link underline', '隐藏链接下划线') }}</span>
              <input
                v-model="state.hideLinkUnderline"
                type="checkbox"
                role="switch"
              />
            </label>

            <label class="theme-playground-toggle-row">
              <span>{{ label('Appearance transition', '深浅色切换动画') }}</span>
              <input
                v-model="state.appearanceTransition"
                type="checkbox"
                role="switch"
              />
            </label>

            <div
              v-if="state.appearanceTransition"
              class="theme-playground-segmented"
              :aria-label="label('Appearance transition style', '深浅色切换动画样式')"
            >
              <button
                type="button"
                :aria-pressed="state.appearanceTransitionMode === 'spread'"
                :class="{ active: state.appearanceTransitionMode === 'spread' }"
                @click="state.appearanceTransitionMode = 'spread'"
              >
                {{ label('Spread', '扩散') }}
              </button>
              <button
                type="button"
                :aria-pressed="state.appearanceTransitionMode === 'fade'"
                :class="{ active: state.appearanceTransitionMode === 'fade' }"
                @click="state.appearanceTransitionMode = 'fade'"
              >
                {{ label('Fade', '渐变') }}
              </button>
            </div>

            <label
              class="theme-playground-toggle-row"
              :title="
                hasGiscusConfig
                  ? ''
                  : label(
                      'Configure Giscus in themeConfig before enabling it.',
                      '请先在 themeConfig 中配置 Giscus。'
                    )
              "
            >
              <span>Giscus</span>
              <input
                v-model="state.giscus"
                type="checkbox"
                role="switch"
                :disabled="!hasGiscusConfig"
              />
            </label>
          </section>

          <section class="theme-playground-section">
            <h2>{{ label('Generated configuration', '生成的配置') }}</h2>
            <pre class="theme-playground-output"><code>{{ output }}</code></pre>
          </section>
        </div>

        <footer class="theme-playground-footer">
          <button type="button" class="alt" @click="reset">
            {{ label('Reset', '重置') }}
          </button>
          <button type="button" class="brand" @click="copyConfig">
            {{ copied ? label('Copied', '已复制') : label('Copy config', '复制配置') }}
          </button>
        </footer>
      </aside>
    </Transition>
  </Teleport>
</template>
