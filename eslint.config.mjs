import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'vue/block-order': ['error', {
      order: ['script', 'template', 'style'],
    }],
  },
})
