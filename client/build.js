import { build } from 'esbuild'

build({
    entryPoints: ['./src/index.ts'],
    format: 'esm',
    platform: 'node',
    target: 'node10.4',
    outdir: './dist',
}).then(r => console.log('Successfully build.'))
