import {
  computed,
  inject,
  shallowRef,
  watch,
  type ComputedRef,
  type InjectionKey,
  type ShallowRef
} from 'vue'
import type { InPressThemeConfig } from './index'
import {
  createThemePlaygroundOverrides,
  createThemePlaygroundState,
  normalizeThemePlaygroundState,
  resolveThemePlaygroundStorageKey,
  type ThemePlaygroundState
} from './playground-state'

export type ThemeConfigOverrides = Partial<InPressThemeConfig>

export interface ThemePlaygroundStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

export interface ThemeRuntime {
  baseTheme: ComputedRef<InPressThemeConfig>
  theme: ComputedRef<InPressThemeConfig>
  playgroundState: ShallowRef<ThemePlaygroundState>
  playgroundActive: ShallowRef<boolean>
  playgroundReady: ShallowRef<boolean>
  restorePlayground: (storage?: ThemePlaygroundStorage) => void
  setPlaygroundState: (value: ThemePlaygroundState) => void
  reset: () => void
}

export const themeRuntimeKey: InjectionKey<ThemeRuntime> = Symbol(
  'inpress-theme-runtime'
)

function mergeThemeConfig(
  base: InPressThemeConfig,
  overrides: ThemeConfigOverrides
): InPressThemeConfig {
  return {
    ...base,
    ...overrides
  }
}

export function createThemeRuntime(
  baseTheme: ComputedRef<InPressThemeConfig>
): ThemeRuntime {
  const playgroundState = shallowRef(
    createThemePlaygroundState(baseTheme.value)
  )
  const playgroundActive = shallowRef(false)
  const playgroundReady = shallowRef(false)
  let playgroundStorage: ThemePlaygroundStorage | undefined
  let activeStorageKey: string | undefined
  const sessionStates = new Map<string | undefined, ThemePlaygroundState>()
  const theme = computed(() =>
    mergeThemeConfig(
      baseTheme.value,
      playgroundActive.value
        ? createThemePlaygroundOverrides(playgroundState.value)
        : {}
    )
  )

  function storageKey(): string | undefined {
    return resolveThemePlaygroundStorageKey(baseTheme.value.playground)
  }

  function copyPlaygroundState(
    value: ThemePlaygroundState
  ): ThemePlaygroundState {
    return {
      ...value,
      providers: [...value.providers]
    }
  }

  function loadPlayground(
    theme: InPressThemeConfig,
    key: string | undefined
  ): void {
    activeStorageKey = key
    playgroundActive.value = false
    playgroundState.value = createThemePlaygroundState(theme)

    const sessionState = sessionStates.get(key)
    if (sessionState) {
      playgroundState.value = normalizeThemePlaygroundState(sessionState, theme)
      playgroundActive.value = true
      return
    }

    if (!key || !playgroundStorage) return

    try {
      const saved = playgroundStorage.getItem(key)

      if (saved) {
        playgroundState.value = normalizeThemePlaygroundState(
          JSON.parse(saved) as Partial<ThemePlaygroundState>,
          theme
        )
        sessionStates.set(key, copyPlaygroundState(playgroundState.value))
        playgroundActive.value = true
      }
    } catch {
      try {
        playgroundStorage.removeItem(key)
      } catch {
        // Ignore storage cleanup failures.
      }
    }
  }

  watch(
    baseTheme,
    (value) => {
      const nextStorageKey = resolveThemePlaygroundStorageKey(value.playground)

      if (playgroundReady.value && nextStorageKey !== activeStorageKey) {
        loadPlayground(value, nextStorageKey)
      } else if (!playgroundActive.value) {
        playgroundState.value = createThemePlaygroundState(value)
      }
    },
    { flush: 'sync' }
  )

  function persistPlayground(): void {
    const key = activeStorageKey
    if (!key || !playgroundStorage) return

    try {
      playgroundStorage.setItem(key, JSON.stringify(playgroundState.value))
    } catch {
      // Storage can be disabled independently of the theme runtime.
    }
  }

  return {
    baseTheme,
    theme,
    playgroundState,
    playgroundActive,
    playgroundReady,
    restorePlayground(storage) {
      playgroundStorage = storage
      loadPlayground(baseTheme.value, storageKey())
      playgroundReady.value = true
    },
    setPlaygroundState(value) {
      playgroundState.value = copyPlaygroundState(value)
      sessionStates.set(
        activeStorageKey,
        copyPlaygroundState(playgroundState.value)
      )
      playgroundActive.value = true
      persistPlayground()
    },
    reset() {
      const key = activeStorageKey
      playgroundActive.value = false
      playgroundState.value = createThemePlaygroundState(baseTheme.value)
      sessionStates.delete(key)

      if (key && playgroundStorage) {
        try {
          playgroundStorage.removeItem(key)
        } catch {
          // Ignore storage cleanup failures.
        }
      }
    }
  }
}

export function useThemeRuntime(): ThemeRuntime {
  const runtime = inject(themeRuntimeKey)

  if (!runtime) {
    throw new Error(
      'ThemeConfigPlayground must be rendered inside @inp146/inpress.'
    )
  }

  return runtime
}
