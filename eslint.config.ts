import pluginVue from 'eslint-plugin-vue'
import { configureVueProject } from '@vue/eslint-config-typescript'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

configureVueProject({ scriptLangs: ['ts', 'tsx'] });

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: [],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/*.{ts,mts,tsx,vue}'],
  },

  // pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
)
