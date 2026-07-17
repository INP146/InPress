import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

function injectChunkCss(): Plugin {
  return {
    name: 'inpress:inject-chunk-css',
    enforce: 'post',
    renderChunk(code, chunk) {
      const metadata = chunk as typeof chunk & {
        viteMetadata?: { importedCss?: Set<string> }
      }
      const cssFiles = [...(metadata.viteMetadata?.importedCss ?? [])]
      if (!cssFiles.length) return null

      const imports = cssFiles.map((file) => `import './${file}';`).join('\n')
      return { code: `${imports}\n${code}`, map: null }
    }
  }
}

export default defineConfig({
  plugins: [vue(), injectChunkCss()],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        i18n: fileURLToPath(new URL('./src/i18n.ts', import.meta.url)),
        playground: fileURLToPath(
          new URL('./src/playground.ts', import.meta.url)
        )
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`
    },
    rollupOptions: {
      external: ['vue', 'vitepress', 'vitepress/theme']
    }
  }
})
