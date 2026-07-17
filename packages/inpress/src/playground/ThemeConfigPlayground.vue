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
import ThemeCheckbox from '../components/ThemeCheckbox.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'

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
  state.logoMonochrome = value.logoMonochrome
  state.homeLogoMonochrome = value.homeLogoMonochrome
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

function setProvider(provider: LinkIconProvider, checked: boolean): void {
  state.providers = checked
    ? [...new Set([...state.providers, provider])]
    : state.providers.filter((item) => item !== provider)
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
          <span>{{ label('Monochrome logo', '单色 Logo') }}</span>
          <ThemeSwitch
            v-model="state.logoMonochrome"
            :aria-label="label('Monochrome logo', '单色 Logo')"
          />
        </div>

        <div class="inpress-playground-toggle-row">
          <span>{{ label('Monochrome home logo', '主页 Logo 单色') }}</span>
          <ThemeSwitch
            v-model="state.homeLogoMonochrome"
            :aria-label="label('Monochrome home logo', '主页 Logo 单色')"
          />
        </div>

        <div class="inpress-playground-toggle-row">
          <span>{{ label('Provider link icons', '平台链接图标') }}</span>
          <ThemeSwitch
            v-model="state.linkIcons"
            :aria-label="label('Provider link icons', '平台链接图标')"
          />
        </div>

        <div v-if="state.linkIcons" class="inpress-playground-provider-grid">
          <ThemeCheckbox
            v-for="provider in linkIconProviders"
            :key="provider"
            :model-value="state.providers.includes(provider)"
            @update:model-value="setProvider(provider, $event)"
          >
            {{ provider }}
          </ThemeCheckbox>
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

<style scoped>
.inpress-playground {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(260px, 0.85fr);
  margin: 24px 0;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  font-size: 14px;
}

.inpress-playground-body {
  min-width: 0;
}

.inpress-playground-section {
  display: grid;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.inpress-playground-body .inpress-playground-section:last-child {
  border-bottom: 0;
}

.inpress-playground-section h2,
.inpress-playground-output-section h2 {
  margin: 0;
  border: 0;
  padding: 0;
  font-size: 13px;
  line-height: 20px;
}

.inpress-playground-segmented {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2px;
  padding: 2px;
  border-radius: 6px;
  background: var(--vp-c-default-soft);
}

.inpress-playground-segmented button {
  min-height: 32px;
  border: 0;
  border-radius: 4px;
  color: var(--vp-c-text-2);
  background: transparent;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.inpress-playground-segmented button.active {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  box-shadow: var(--vp-shadow-1);
}

.inpress-playground-color-row {
  display: grid;
  grid-template-columns: minmax(100px, 1fr) 32px minmax(108px, 132px);
  align-items: center;
  gap: 8px;
  min-height: 34px;
}

.inpress-playground-color-row > span,
.inpress-playground-toggle-row > span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.inpress-playground-color-row input[type='color'] {
  width: 32px;
  height: 32px;
  padding: 2px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  cursor: pointer;
}

.inpress-playground-color-row input[type='text'] {
  grid-column: 3;
  width: 100%;
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  font: 12px/1.4 var(--vp-font-family-mono);
}

.inpress-playground-color-row input[aria-invalid='true'] {
  border-color: var(--vp-c-danger-1);
}

.inpress-playground-palette {
  display: grid;
  gap: 8px;
}

.inpress-playground-palette-row {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.inpress-playground-palette-row > div {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  height: 28px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
}

.inpress-playground-swatch {
  min-width: 0;
}

.inpress-playground-color-row input:focus-visible,
.inpress-playground-segmented button:focus-visible,
.inpress-playground-footer button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.inpress-playground-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 32px;
}

.inpress-playground-provider-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
  padding: 6px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
}

.inpress-playground-provider-grid :deep(.inpress-checkbox) {
  width: 100%;
  min-height: 32px;
  padding: 0 8px;
  border-radius: 4px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  transition:
    color 0.2s,
    background-color 0.2s;
}

.inpress-playground-provider-grid
  :deep(.inpress-checkbox:hover:not(.is-disabled)) {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
}

.inpress-playground-provider-grid :deep(.inpress-checkbox.is-checked) {
  color: var(--vp-c-text-1);
  background: var(--vp-c-brand-soft);
}

.inpress-playground-provider-grid :deep(.inpress-checkbox .label) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.inpress-playground-output {
  max-height: 420px;
  margin: 0;
  overflow: auto;
  border-radius: 6px;
  padding: 12px;
  background: var(--vp-code-block-bg);
  font-size: 11px;
  line-height: 1.55;
  white-space: pre;
}

.inpress-playground-output-section {
  display: grid;
  align-content: start;
  gap: 12px;
  min-width: 0;
  padding: 20px;
  border-left: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
}

.inpress-playground-footer {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid var(--vp-c-divider);
}

.inpress-playground-footer button {
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid transparent;
  border-radius: 5px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.inpress-playground-footer button.alt {
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
}

.inpress-playground-footer button.brand {
  border-color: var(--vp-button-brand-border, transparent);
  color: var(--vp-button-brand-text, var(--vp-c-white));
  background: var(--vp-button-brand-bg, var(--vp-c-brand-1));
}

@media (max-width: 768px) {
  .inpress-playground {
    grid-template-columns: minmax(0, 1fr);
  }

  .inpress-playground-output-section {
    border-top: 1px solid var(--vp-c-divider);
    border-left: 0;
  }
}

@media (max-width: 520px) {
  .inpress-playground-section,
  .inpress-playground-output-section {
    padding: 16px;
  }

  .inpress-playground-provider-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .inpress-playground-footer {
    padding: 12px 16px;
  }
}
</style>
