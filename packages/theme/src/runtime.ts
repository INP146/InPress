import {
  computed,
  inject,
  shallowRef,
  type ComputedRef,
  type InjectionKey,
  type ShallowRef
} from 'vue'
import type { Inp146ThemeConfig } from './index'

export type ThemeConfigOverrides = Partial<Inp146ThemeConfig>

export interface ThemeRuntime {
  baseTheme: ComputedRef<Inp146ThemeConfig>
  theme: ComputedRef<Inp146ThemeConfig>
  overrides: ShallowRef<ThemeConfigOverrides>
  setOverrides: (value: ThemeConfigOverrides) => void
  reset: () => void
}

export const themeRuntimeKey: InjectionKey<ThemeRuntime> = Symbol(
  'inp146-theme-runtime'
)

function mergeThemeConfig(
  base: Inp146ThemeConfig,
  overrides: ThemeConfigOverrides
): Inp146ThemeConfig {
  return {
    ...base,
    ...overrides,
    cssVars:
      overrides.cssVars === undefined ? base.cssVars : overrides.cssVars
  }
}

export function createThemeRuntime(
  baseTheme: ComputedRef<Inp146ThemeConfig>
): ThemeRuntime {
  const overrides = shallowRef<ThemeConfigOverrides>({})
  const theme = computed(() => mergeThemeConfig(baseTheme.value, overrides.value))

  return {
    baseTheme,
    theme,
    overrides,
    setOverrides(value) {
      overrides.value = value
    },
    reset() {
      overrides.value = {}
    }
  }
}

export function useThemeRuntime(): ThemeRuntime {
  const runtime = inject(themeRuntimeKey)

  if (!runtime) {
    throw new Error(
      'ThemeConfigPlayground must be rendered inside @inp146/vitepress-theme.'
    )
  }

  return runtime
}
