import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    outDir: './dist',
    format: ['cjs'],
    noExternal: ['rage-rpc'],
    experimentalDts: true,
    splitting: false,
    sourcemap: false,
    clean: true,
})
