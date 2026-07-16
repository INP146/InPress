import {
  computed,
  inject,
  shallowRef,
  type ComputedRef,
  type InjectionKey,
  type ShallowRef
} from 'vue'
import type { InPressThemeConfig } from './index'

export type ThemeConfigOverrides = Partial<InPressThemeConfig>

export interface ThemeRuntime {
  baseTheme: ComputedRef<InPressThemeConfig>
  theme: ComputedRef<InPressThemeConfig>
  overrides: ShallowRef<ThemeConfigOverrides>
  setOverrides: (value: ThemeConfigOverrides) => void
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
    ...overrides,
    cssVars:
      overrides.cssVars === undefined ? base.cssVars : overrides.cssVars
  }
}

export function createThemeRuntime(
  baseTheme: ComputedRef<InPressThemeConfig>
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
      'ThemeConfigPlayground must be rendered inside @inp146/inpress.'
    )
  }

  return runtime
}
