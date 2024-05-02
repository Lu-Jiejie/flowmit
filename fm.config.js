import { defineConfig } from './src/config'

export default defineConfig({
  types: [
    { title: 'feat', value: 'feat', description: '新功能' },
    { title: 'fix', value: 'fix', description: '修复 bug' },
  ],
})
