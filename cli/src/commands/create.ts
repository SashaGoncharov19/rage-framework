import c from 'chalk'
import { input, select } from '@inquirer/prompts'
import path from 'node:path'
import { cloneBranch } from '../utils/cloner'

const choices = {
    'react-18': {
        name: 'React 18',
        value: 'react-18',
        description: 'React 18 + TypeScript (Vite) as a front-end',
    },
    'svelte-5': {
        name: 'Svelte 5',
        value: 'svelte-5',
        description: 'Svelte 5 + TypeScript (Vite) as a front-end',
    },
} as const

export async function initProject() {
    let folder: string | undefined
    let framework: keyof typeof choices | undefined

    if (!folder) {
        folder = await input({
            message: c.gray('Enter project name:'),
            default: 'rage-fw-example',
        })
    } else {
        console.log(c.gray('Project name:'), folder)
    }

    if (!framework) {
        framework = await select({
            message: c.gray('Select front-end:'),
            default: 'react-18',
            loop: true,
            choices: Object.values(choices),
        })
    } else {
        console.log(c.gray('Front-end:'), choices[framework].name)
    }

    console.log(
        c.gray('\nScaffolding template project into'),
        folder,
        c.gray('with'),
        choices[framework].name,
        c.gray('as a front-end..'),
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
                    `Project was created in: ${path.join(process.cwd(), folder)}`,
                ),
            )
        })
        .catch(e => {
            console.log(c.red('Error occurred: \n', e))
            console.log(c.red('Please open an issue if you see this'))
        })
}
