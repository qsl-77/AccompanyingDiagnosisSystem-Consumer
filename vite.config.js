import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 4500
  },
  plugins: [
    vue(),
    AutoImport({
      // VantResolver 不应该在这里
      // 这里是用来自动导入 vue api (ref, computed) 的
      imports: ['vue', 'vue-router'],
    }),
    Components({
      resolvers: [
        // 告诉 VantResolver 只导入 JS，不要管样式
        VantResolver({ importStyle: false })
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})



// import { fileURLToPath, URL } from 'node:url'

// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'

// import Components from 'unplugin-vue-components/vite';
// import { VantResolver } from 'unplugin-vue-components/resolvers';
// import AutoImport from 'unplugin-auto-import/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   server: {
//     port: 4500
//   },
//   plugins: [
//     vue(),
//     AutoImport({
//       resolvers: [VantResolver()],
//     }),
//     Components({
//       resolvers: [VantResolver()],
//     }),
//   ],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     },
//   },
// })


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

