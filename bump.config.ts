import { defineConfig } from 'bumpp'

export default defineConfig({
  files: ['package.json', 'package-lock.json', 'packages/**/package.json', 'apps/**/package.json'],
})
