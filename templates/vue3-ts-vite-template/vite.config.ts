import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport from 'vite-plugin-style-import'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    styleImport({
      libs: [
        {
          libraryName: 'vant',
          esModule: true,
          resolveStyle: (name) => `vant/es/${name}/style`
        }
      ]
    })
  ],
  base: './', // 打包路径
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      styles: path.resolve(__dirname, 'src/assets/styles'),
      comps: path.resolve(__dirname, 'src/components')
    }
  },
  server: {
    proxy: {
      // 选项写法
      '/msp': {
        target: '****',
        changeOrigin: true
      },
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  }
})
