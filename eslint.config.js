import antfu from '@antfu/eslint-config'
import unocss from '@unocss/eslint-plugin'

export default antfu(
  {
    ignores: ['pnpm-lock.yaml', 'auto-imports.d.ts', 'components.d.ts', '.gitignore', 'public'],
  },
  unocss.configs.flat,
)
