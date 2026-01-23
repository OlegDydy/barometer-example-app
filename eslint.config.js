import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import prettier from 'eslint-config-prettier/flat';
import vue from 'eslint-plugin-vue';

export default defineConfigWithVueTs(
  vue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    ignores: ['node_modules', 'public'],
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  prettier,
);
