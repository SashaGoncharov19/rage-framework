import { build } from 'esbuild'
import { umdWrapper } from 'esbuild-plugin-umd-wrapper'
build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    format: 'umd',
    platform: 'node',
    outdir: './dist',
    plugins: [
        umdWrapper({
            libraryName: 'fw',
        }),
    ],
}).then(() => {
    console.log('Successfully build. Executing types build...')
})
