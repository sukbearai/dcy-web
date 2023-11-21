import baseConfig from '@dcyjs/config/vite'
import merge from 'deepmerge'
import type { ViteConfig } from 'nuxt/schema'

const config: ViteConfig = {}

export const vite = merge(baseConfig, config)
