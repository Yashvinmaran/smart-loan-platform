import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 5175,
    proxy: {
      '/user': {
        target: 'http://localhost:9090',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Proxying request:', req.method, proxyReq.path, 'Headers:', req.headers);
    
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Accept', 'application/json');
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Proxy response:', req.method, req.url, 'Status:', proxyRes.statusCode, proxyRes.statusMessage);
          });
          proxy.on('error', (err, req) => {
            console.error('Proxy error for:', req.method, req.url, 'Error:', err.message);
          });
        },
      },
      '/loan': {
        target: 'http://localhost:9090',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
      },
      '/api/v1/user': {
        target: 'http://localhost:9090',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
      },
      '/api/v1/loan': {
        target: 'http://localhost:9090',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  envPrefix: 'VITE_',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});