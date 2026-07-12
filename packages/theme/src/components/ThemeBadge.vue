<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: 'Theme component'
  }
)
</script>

<template>
  <span class="theme-badge">{{ label }}</span>
</template>

<style scoped>
.theme-badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 2px 8px;
  border: 1px solid var(--vp-c-brand-2);
  border-radius: 4px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}
</style>
