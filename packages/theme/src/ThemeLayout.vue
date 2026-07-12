<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

type CssVars = Record<`--${string}`, string | number>

const props = defineProps<{
  cssVars?: {
    root?: CssVars
    dark?: CssVars
  }
}>()

const { isDark } = useData()

const style = computed(() => ({
  ...props.cssVars?.root,
  ...(isDark.value ? props.cssVars?.dark : undefined)
}))
</script>

<template>
  <div class="vitepress-theme-root" :style="style">
    <DefaultTheme.Layout />
  </div>
</template>
