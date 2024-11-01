import c from 'chalk'
import { input, select } from '@inquirer/prompts'
import path from 'node:path'
import { cloneBranch } from '../utils/cloner'

const choices = {
    'rpc-react-18': {
        name: 'React 18',
        value: 'rpc-react-18',
        description: 'Vite + React 18 + TypeScript as a front-end',
    },
    'rpc-svelte-5': {
        name: 'Svelte 5',
        value: 'rpc-svelte-5',
        description: 'Vite + Svelte 5 + TypeScript as a front-end',
    },
} as const

export async function testRpc() {
    let folder
    let framework

    if (!folder) {
        folder = await input({
            message: c.gray('Enter project name:'),
            default: 'rage-fw-rpc-example',
        })
    } else {
        console.log(c.gray('Project name:'), folder)
    }

    if (!framework) {
        framework = await select({
            message: c.gray('Select front-end:'),
            default: 'rpc-react-18',
            loop: true,
            choices: Object.values(choices),
        })
    } else {
        console.log(c.gray('Front-end:'), framework)
    }

    console.log(
        c.gray('\nScaffolding template project into'),
        folder,
        c.gray('with'),
        choices[framework].name,
        c.gray('as a frontend..'),
    )

    cloneBranch(
        'https://git.entityseven.com/entityseven/rage-framework-example',
        path.join(process.cwd(), folder),
        framework,
    )
        .then(() => {
            console.log(c.gray('Scaffolded project into'), folder)
            console.log(
                c.gray(
                    `Project was created at dir: ${path.join(process.cwd(), folder)}`,
                ),
            )
        })
        .catch(e => {
            console.log(c.red('Error occured: \n', e))
            console.log(c.red('Please open an issue if you see this'))
        })
}
