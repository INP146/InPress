import assert from 'node:assert/strict'
import test from 'node:test'
import { computed, ref } from 'vue'
import type { GiscusConfig, InPressThemeConfig } from '../src/index'
import {
  createThemePlaygroundState,
  defaultThemePlaygroundStorageKey
} from '../src/playground-state'
import {
  createThemeRuntime,
  type ThemePlaygroundStorage
} from '../src/runtime'

class MemoryStorage implements ThemePlaygroundStorage {
  readonly values = new Map<string, string>()

  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value)
  }

  removeItem(key: string): void {
    this.values.delete(key)
  }
}

const englishGiscus: GiscusConfig = {
  repo: 'owner/english',
  repoId: 'english-id',
  category: 'General',
  categoryId: 'english-category'
}

const chineseGiscus: GiscusConfig = {
  repo: 'owner/chinese',
  repoId: 'chinese-id',
  category: '讨论',
  categoryId: 'chinese-category'
}

function createBaseTheme(): InPressThemeConfig {
  return {
    color: '#2563eb',
    playground: true,
    appearanceTransition: 'fade',
    giscus: englishGiscus
  }
}

test('restores global playground settings and resolves locale config dynamically', () => {
  const storage = new MemoryStorage()
  const baseTheme = ref(createBaseTheme())
  const runtime = createThemeRuntime(computed(() => baseTheme.value))

  runtime.restorePlayground(storage)
  assert.equal(runtime.playgroundReady.value, true)
  assert.equal(runtime.playgroundActive.value, false)

  runtime.setPlaygroundState({
    ...createThemePlaygroundState(baseTheme.value),
    color: '#ef4444',
    hideLinkUnderline: false,
    giscus: undefined
  })

  assert.equal(runtime.theme.value.color, '#ef4444')
  assert.equal(runtime.theme.value.hideLinkUnderline, false)
  assert.deepEqual(runtime.theme.value.giscus, englishGiscus)
  assert(storage.getItem(defaultThemePlaygroundStorageKey))

  baseTheme.value = {
    ...baseTheme.value,
    giscus: chineseGiscus
  }
  assert.deepEqual(runtime.theme.value.giscus, chineseGiscus)

  const restored = createThemeRuntime(computed(() => baseTheme.value))
  restored.restorePlayground(storage)
  assert.equal(restored.playgroundActive.value, true)
  assert.equal(restored.theme.value.color, '#ef4444')
  assert.deepEqual(restored.theme.value.giscus, chineseGiscus)

  restored.reset()
  assert.equal(restored.playgroundActive.value, false)
  assert.equal(restored.theme.value.color, '#2563eb')
  assert.equal(storage.getItem(defaultThemePlaygroundStorageKey), null)
})

test('supports an explicit empty color and a custom storage key', () => {
  const storage = new MemoryStorage()
  const baseTheme = ref<InPressThemeConfig>({
    color: '#2563eb',
    playground: { storageKey: 'custom-playground' }
  })
  const runtime = createThemeRuntime(computed(() => baseTheme.value))

  runtime.restorePlayground(storage)
  runtime.setPlaygroundState({
    ...createThemePlaygroundState(baseTheme.value),
    color: ''
  })

  assert.equal(runtime.theme.value.color, undefined)
  assert(storage.getItem('custom-playground'))
  assert.equal(storage.getItem(defaultThemePlaygroundStorageKey), null)
})

test('ignores damaged storage and keeps persistence opt-in', () => {
  const storage = new MemoryStorage()
  storage.setItem(defaultThemePlaygroundStorageKey, '{invalid')

  const enabledBase = ref(createBaseTheme())
  const enabled = createThemeRuntime(computed(() => enabledBase.value))
  enabled.restorePlayground(storage)

  assert.equal(enabled.playgroundReady.value, true)
  assert.equal(enabled.playgroundActive.value, false)
  assert.equal(storage.getItem(defaultThemePlaygroundStorageKey), null)

  storage.setItem(defaultThemePlaygroundStorageKey, '{"color":"#ef4444"}')
  const disabledBase = ref<InPressThemeConfig>({ color: '#2563eb' })
  const disabled = createThemeRuntime(computed(() => disabledBase.value))
  disabled.restorePlayground(storage)

  assert.equal(disabled.playgroundActive.value, false)
  disabled.setPlaygroundState({
    ...createThemePlaygroundState(disabledBase.value),
    color: '#14b8a6'
  })
  assert.equal(disabled.theme.value.color, '#14b8a6')
  assert.equal(
    storage.getItem(defaultThemePlaygroundStorageKey),
    '{"color":"#ef4444"}'
  )
})

test('inherits Giscus when the current locale has no Giscus config', () => {
  const storage = new MemoryStorage()
  const baseTheme = ref<InPressThemeConfig>({
    color: '#2563eb',
    playground: true
  })
  const runtime = createThemeRuntime(computed(() => baseTheme.value))

  runtime.restorePlayground(storage)
  runtime.setPlaygroundState({
    ...createThemePlaygroundState(baseTheme.value),
    color: '#ef4444'
  })

  assert.equal(runtime.theme.value.giscus, undefined)

  baseTheme.value = {
    ...baseTheme.value,
    giscus: englishGiscus
  }
  assert.deepEqual(runtime.theme.value.giscus, englishGiscus)

  runtime.setPlaygroundState({
    ...runtime.playgroundState.value,
    giscus: false
  })
  assert.equal(runtime.theme.value.giscus, false)

  baseTheme.value = {
    ...baseTheme.value,
    giscus: chineseGiscus
  }
  assert.equal(runtime.theme.value.giscus, false)
})

test('isolates persisted state when the locale storage key changes', () => {
  const storage = new MemoryStorage()
  const baseTheme = ref<InPressThemeConfig>({
    color: '#2563eb',
    playground: { storageKey: 'locale-a' }
  })
  const runtime = createThemeRuntime(computed(() => baseTheme.value))

  runtime.restorePlayground(storage)
  runtime.setPlaygroundState({
    ...createThemePlaygroundState(baseTheme.value),
    color: '#ef4444'
  })

  baseTheme.value = {
    color: '#2563eb',
    playground: { storageKey: 'locale-b' }
  }
  assert.equal(runtime.playgroundActive.value, false)
  assert.equal(runtime.theme.value.color, '#2563eb')

  runtime.setPlaygroundState({
    ...createThemePlaygroundState(baseTheme.value),
    color: '#14b8a6'
  })

  baseTheme.value = {
    color: '#2563eb',
    playground: { storageKey: 'locale-a' }
  }
  assert.equal(runtime.theme.value.color, '#ef4444')

  runtime.reset()
  assert.equal(storage.getItem('locale-a'), null)
  assert(storage.getItem('locale-b'))

  baseTheme.value = {
    color: '#2563eb',
    playground: { storageKey: 'locale-b' }
  }
  assert.equal(runtime.theme.value.color, '#14b8a6')
})

test('keeps per-key session state when browser storage is unavailable', () => {
  const baseTheme = ref<InPressThemeConfig>({
    color: '#2563eb',
    playground: { storageKey: 'locale-a' }
  })
  const runtime = createThemeRuntime(computed(() => baseTheme.value))

  runtime.restorePlayground()
  runtime.setPlaygroundState({
    ...createThemePlaygroundState(baseTheme.value),
    color: '#ef4444'
  })

  baseTheme.value = {
    color: '#2563eb',
    playground: { storageKey: 'locale-b' }
  }
  runtime.setPlaygroundState({
    ...createThemePlaygroundState(baseTheme.value),
    color: '#14b8a6'
  })

  baseTheme.value = {
    color: '#2563eb',
    playground: { storageKey: 'locale-a' }
  }
  assert.equal(runtime.theme.value.color, '#ef4444')

  baseTheme.value = {
    color: '#2563eb',
    playground: { storageKey: 'locale-b' }
  }
  assert.equal(runtime.theme.value.color, '#14b8a6')
})
