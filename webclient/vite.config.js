import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/tf2items/' : '/',
  plugins: [react(), nodePolyfills({ include: ['crypto'] })],
  resolve: {
    // use the selector source directly, no rebuild needed while developing
    alias: {
      '@juice789/tf2items-selector/internal': fileURLToPath(new URL('../selector/src/index.js', import.meta.url))
    },
    // the selector source resolves its dependencies from the webclient, not from selector/node_modules
    dedupe: [
      'react',
      'react-dom',
      'styled-components',
      'react-select',
      'react-window',
      'react-icons',
      '@juice789/react-toggle',
      '@juice789/tf2items'
    ]
  },
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), '../selector/src']
    }
  }
}))
