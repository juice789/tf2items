import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/tf2items/' : '/',
  plugins: [react(), nodePolyfills({ include: ['crypto'] })],
}))
