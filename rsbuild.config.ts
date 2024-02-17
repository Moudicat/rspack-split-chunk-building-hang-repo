import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';

export default defineConfig({
  source: {
    entry: {
      main: './src/main.js',
    },
  },
  output: {
    distPath: {
      root: './rsbuild-dist',
    },
  },
  plugins: [pluginVue()],
});
