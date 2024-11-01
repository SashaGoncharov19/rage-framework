import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['./src/index.ts'],
    outDir: './dist',
    format: ['cjs'],
    experimentalDts: true,
    splitting: false,
    sourcemap: false,
    clean: true,
    bundle: false,
})
