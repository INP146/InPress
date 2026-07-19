import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const files = await readdir(dist)
const read = (file: string) => readFile(new URL(`../dist/${file}`, import.meta.url), 'utf8')

const [indexJs, playgroundJs, sidebarJs, indexCss, playgroundCss] =
  await Promise.all([
    read('index.js'),
    read('playground.js'),
    read('sidebar.js'),
    read('index.css'),
    read('playground.css')
  ])

assert.match(indexJs, /import "\.\/index\.css";/)
assert.match(playgroundJs, /import "\.\/playground\.css";/)
assert.match(sidebarJs, /from "vitepress-sidebar"/)
assert.doesNotMatch(indexCss, /\.inpress-playground/)
assert.match(playgroundCss, /\.inpress-playground/)

const componentCssFiles = files.filter(
  (file) => file.endsWith('.css') && !['index.css', 'playground.css'].includes(file)
)
const componentCss = (
  await Promise.all(componentCssFiles.map((file) => read(file)))
).join('\n')

assert.match(componentCss, /\.inpress-checkbox/)
assert.match(componentCss, /\.inpress-switch/)

const packageJson = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8')
) as { exports: Record<string, string | { import?: string }> }
assert.equal(packageJson.exports['./style.css'], './dist/index.css')
assert.deepEqual(packageJson.exports['./sidebar'], {
  types: './dist/sidebar.d.ts',
  import: './dist/sidebar.js'
})
assert(files.includes('index.css'))
assert(files.includes('sidebar.d.ts'))
