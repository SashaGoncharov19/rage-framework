import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    outDir: './dist',
    bundle: true,
    splitting: false,
    sourcemap: false,
    clean: true,
})
