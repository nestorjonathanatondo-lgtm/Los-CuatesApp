import { mkdir, copyFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const out = resolve(root, 'dist')
await mkdir(out, { recursive: true })
for (const file of ['index.html', 'manifest.webmanifest', 'icon.svg', 'sw.js']) {
  await copyFile(resolve(root, file), resolve(out, file))
}
console.log('Web bundle ready:', out)
