import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/**/*.ts'],
    outDir: './dist',
    format: ['cjs'],
    experimentalDts: true,
    splitting: false,
    bundle: false,
    sourcemap: false,
    clean: true,
})
