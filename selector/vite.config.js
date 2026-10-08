import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const styledComponentsDir = dirname(require.resolve('styled-components/package.json'))

// When styled-components is external, node (SSR, vitest, jest) loads its CJS build, where the
// default import is the whole module object instead of `styled`. Every styled-components import
// goes through this module, which re-exports the named `styled` export as the default.
const STYLED_INTEROP = '\0styled-components-interop'

const styledComponentsInterop = {
    name: 'styled-components-interop',
    enforce: 'pre',
    resolveId: (id, importer) => id === 'styled-components' && importer !== STYLED_INTEROP
        ? STYLED_INTEROP
        : null,
    load: (id) => id === STYLED_INTEROP
        ? "export * from 'styled-components'\nexport { styled as default } from 'styled-components'"
        : null
}

// default:  only react + react-dom are peer deps, everything else is bundled
// themed:   default + styled-components as a peer dep (shares the host's ThemeProvider)
// internal: every dependency is a peer dep
const builds = {
    default: {
        fileName: 'index',
        external: ['react', 'react-dom']
    },
    themed: {
        fileName: 'themed',
        external: ['react', 'react-dom', 'styled-components']
    },
    internal: {
        fileName: 'internal',
        external: [
            'react',
            'react-dom',
            'styled-components',
            'react-select',
            'react-window',
            'react-icons',
            '@juice789/react-toggle',
            '@juice789/tf2items'
        ]
    }
}

export default defineConfig(({ mode }) => {
    const build = builds[mode]
    if (!build) throw new Error(`unknown build mode "${mode}", use one of: ${Object.keys(builds).join(', ')}`)
    return {
        plugins: [react(), ...(mode === 'default' ? [] : [styledComponentsInterop])],
        resolve: {
            alias: mode === 'default'
                ? [
                    { find: /^styled-components$/, replacement: fileURLToPath(new URL('./build/namespacedStyled.js', import.meta.url)) },
                    { find: /^styled-components-actual$/, replacement: join(styledComponentsDir, 'dist/styled-components.browser.esm.js') }
                ]
                : []
        },
        build: {
            outDir: 'dist',
            emptyOutDir: false,
            // the bundled builds are mostly the item schema, a map would just duplicate it
            sourcemap: mode === 'internal',
            lib: {
                entry: 'src/index.js',
                formats: ['es'],
                fileName: () => `${build.fileName}.js`
            },
            rolldownOptions: {
                external: (id, importer) => id === 'styled-components'
                    ? build.external.includes(id) && importer === STYLED_INTEROP
                    : build.external.some(dep => id === dep || id.startsWith(dep + '/'))
            }
        }
    }
})
