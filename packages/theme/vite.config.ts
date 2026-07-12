import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        i18n: fileURLToPath(new URL('./src/i18n.ts', import.meta.url))
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'style'
    },
    rollupOptions: {
      external: ['vue', 'vitepress', 'vitepress/theme']
    }
  }
})
