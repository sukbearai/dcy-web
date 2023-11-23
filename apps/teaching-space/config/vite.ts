import baseConfig from '@dcyjs/config/vite'
import { mergeConfig } from 'vite'
import type { ViteConfig } from 'nuxt/schema'

const config: ViteConfig = {}

export const vite = mergeConfig(baseConfig, config)
