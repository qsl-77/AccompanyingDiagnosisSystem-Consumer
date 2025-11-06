import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';


// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 4500
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})


// import vue from '@vitejs/plugin-vue';
// import Components from 'unplugin-vue-components/vite';
// import { VantResolver } from 'unplugin-vue-components/resolvers';

// export default {
//   plugins: [
//     vue(),
//     Components({
//       resolvers: [VantResolver()],
//     }),
//   ],
// };

