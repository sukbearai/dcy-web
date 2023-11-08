import antfu from '@antfu/eslint-config'
import unocss from '@unocss/eslint-plugin'

export default antfu(
  {
    rules: {
      'style/no-tabs': 'off',
    },
  },
  unocss.configs.flat,
)
