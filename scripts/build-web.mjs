import { cp, mkdir, readdir, copyFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const out = resolve(root, 'dist')
await mkdir(out, { recursive: true })
for (const file of ['index.html', 'manifest.webmanifest', 'icon.svg', 'sw.js']) {
  await copyFile(resolve(root, file), resolve(out, file))
}

const publicDir = resolve(root, 'public')
for (const entry of await readdir(publicDir, { withFileTypes: true })) {
  await cp(resolve(publicDir, entry.name), resolve(out, entry.name), { recursive: true })
}

console.log('Web bundle ready:', out)
