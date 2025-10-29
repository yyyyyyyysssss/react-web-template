import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        'xxx': {
          target: 'xxx',
          changeOrigin: true, // 修改请求头中的Origin字段
          rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径
        }
      }
    }
  };
})