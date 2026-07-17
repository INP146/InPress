<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { createColorPalette } from '../color'
import {
  linkIconProviders,
  type LinkIconProvider
} from '../link-icon-providers'
import {
  createThemePlaygroundOverrides,
  isThemeColor,
  type ThemePlaygroundState
} from '../playground-state'
import { useThemeRuntime } from '../runtime'
import ThemeSwitch from './ThemeSwitch.vue'

const FALLBACK_PICKER_COLOR = '#3a5ccc'
const paletteFields = [
  { key: 'brand1', en: 'Text', zh: '文字' },
  { key: 'brand2', en: 'Hover', zh: '悬停' },
  { key: 'brand3', en: 'Solid', zh: '实色' },
  { key: 'soft', en: 'Soft', zh: '柔和' }
] as const

const runtime = useThemeRuntime()
const { lang } = useData()
const copied = ref(false)
const isZh = computed(() => lang.value.toLowerCase().startsWith('zh'))
const label = (en: string, zh: string) => (isZh.value ? zh : en)
const state = reactive<ThemePlaygroundState>({
  ...runtime.playgroundState.value,
  providers: [...runtime.playgroundState.value.providers]
})
let syncingFromRuntime = false

function pickerColor(color: string): string {
  if (/^#[\da-f]{6}$/i.test(color)) return color
  if (/^#[\da-f]{3}$/i.test(color)) {
    return `#${[...color.slice(1)].map((character) => character.repeat(2)).join('')}`
  }
  return FALLBACK_PICKER_COLOR
}

function snapshotState(): ThemePlaygroundState {
  return {
    ...state,
    providers: [...state.providers]
  }
}

const hasGiscusConfig = computed(() => Boolean(runtime.baseTheme.value.giscus))
const giscusEnabled = computed({
  get: () => hasGiscusConfig.value && state.giscus !== false,
  set: (value: boolean) => {
    state.giscus = value ? undefined : false
  }
})
const palette = computed(() => createColorPalette(state.color))
const pickerValue = computed(() => pickerColor(state.color))
const colorIsValid = computed(
  () => state.color.length === 0 || isThemeColor(state.color)
)
const paletteModes = computed(() => {
  if (!palette.value) return []

  return [
    { key: 'light', en: 'Light', zh: '浅色', scale: palette.value.light },
    { key: 'dark', en: 'Dark', zh: '深色', scale: palette.value.dark }
  ] as const
})

function assignState(value: ThemePlaygroundState): void {
  state.color = value.color
  state.linkIcons = value.linkIcons
  state.providers = [...value.providers]
  state.autoLinkText = value.autoLinkText
  state.hideLinkUnderline = value.hideLinkUnderline
  state.appearanceTransition = value.appearanceTransition
  state.appearanceTransitionMode = value.appearanceTransitionMode
  state.giscus = value.giscus
}

function createExportConfig() {
  return createThemePlaygroundOverrides(snapshotState())
}

const output = computed(
  () => `themeConfig: ${JSON.stringify(createExportConfig(), null, 2)}`
)

watch(
  runtime.playgroundState,
  (value) => {
    syncingFromRuntime = true
    assignState(value)
    syncingFromRuntime = false
  },
  { immediate: true, flush: 'sync' }
)

watch(
  state,
  () => {
    if (syncingFromRuntime || !runtime.playgroundReady.value) return
    runtime.setPlaygroundState(snapshotState())
  },
  { deep: true, flush: 'sync' }
)

function toggleProvider(provider: LinkIconProvider): void {
  state.providers = state.providers.includes(provider)
    ? state.providers.filter((item) => item !== provider)
    : [...state.providers, provider]
}

function updateColorFromPicker(event: Event): void {
  state.color = (event.target as HTMLInputElement).value
}

function reset(): void {
  runtime.reset()
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
  <div
    class="inpress-playground"
    :aria-label="label('InPress configuration', 'InPress 配置')"
  >
    <div class="inpress-playground-body">
      <section class="inpress-playground-section">
        <h2>{{ label('Brand color', '品牌颜色') }}</h2>
        <label class="inpress-playground-color-row">
          <span>{{ label('Color seed', '颜色种子') }}</span>
          <input
            type="color"
            :value="pickerValue"
            :aria-label="label('Color seed', '颜色种子')"
            @input="updateColorFromPicker"
          />
          <input
            v-model.trim="state.color"
            type="text"
            spellcheck="false"
            placeholder="#14b8a6"
            :aria-label="label('Color seed', '颜色种子')"
            :aria-invalid="!colorIsValid"
          />
        </label>

        <div v-if="paletteModes.length" class="inpress-playground-palette">
          <div
            v-for="paletteMode in paletteModes"
            :key="paletteMode.key"
            class="inpress-playground-palette-row"
          >
            <span>{{ label(paletteMode.en, paletteMode.zh) }}</span>
            <div>
              <span
                v-for="field in paletteFields"
                :key="field.key"
                class="inpress-playground-swatch"
                :style="{ backgroundColor: paletteMode.scale[field.key] }"
                :title="`${label(field.en, field.zh)}: ${paletteMode.scale[field.key]}`"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="inpress-playground-section">
        <h2>{{ label('Features', '功能') }}</h2>

        <div class="inpress-playground-toggle-row">
          <span>{{ label('Provider link icons', '平台链接图标') }}</span>
          <ThemeSwitch
            v-model="state.linkIcons"
            :aria-label="label('Provider link icons', '平台链接图标')"
          />
        </div>

        <div v-if="state.linkIcons" class="inpress-playground-provider-grid">
          <label v-for="provider in linkIconProviders" :key="provider">
            <input
              type="checkbox"
              :checked="state.providers.includes(provider)"
              @change="toggleProvider(provider)"
            />
            <span>{{ provider }}</span>
          </label>
        </div>

        <div class="inpress-playground-toggle-row">
          <span>{{ label('Automatic link text', '自动链接文案') }}</span>
          <ThemeSwitch
            v-model="state.autoLinkText"
            :aria-label="label('Automatic link text', '自动链接文案')"
          />
        </div>

        <div class="inpress-playground-toggle-row">
          <span>{{ label('Hide link underline', '隐藏链接下划线') }}</span>
          <ThemeSwitch
            v-model="state.hideLinkUnderline"
            :aria-label="label('Hide link underline', '隐藏链接下划线')"
          />
        </div>

        <div class="inpress-playground-toggle-row">
          <span>{{ label('Appearance transition', '深浅色切换动画') }}</span>
          <ThemeSwitch
            v-model="state.appearanceTransition"
            :aria-label="label('Appearance transition', '深浅色切换动画')"
          />
        </div>

        <div
          v-if="state.appearanceTransition"
          class="inpress-playground-segmented"
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

        <div
          class="inpress-playground-toggle-row"
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
          <ThemeSwitch
            v-model="giscusEnabled"
            :disabled="!hasGiscusConfig"
            aria-label="Giscus"
          />
        </div>
      </section>
    </div>

    <section class="inpress-playground-output-section">
      <h2>{{ label('Generated configuration', '生成的配置') }}</h2>
      <pre class="inpress-playground-output"><code>{{ output }}</code></pre>
    </section>

    <footer class="inpress-playground-footer">
      <button type="button" class="alt" @click="reset">
        {{ label('Reset', '重置') }}
      </button>
      <button type="button" class="brand" @click="copyConfig">
        {{ copied ? label('Copied', '已复制') : label('Copy config', '复制配置') }}
      </button>
    </footer>
  </div>
</template>
