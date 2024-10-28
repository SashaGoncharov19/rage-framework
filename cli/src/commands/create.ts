import c from 'chalk'
import { input, select } from '@inquirer/prompts'
import path from 'node:path'
import { cloneBranch } from '../utils/cloner'

export async function initProject() {
    let folder
    let framework

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
            message: c.gray('Select frontend:'),
            default: 'react-18',
            loop: true,
            choices: [
                {
                    name: 'React + TypeScript (Vite)',
                    value: 'react-18',
                    description: 'React + TypeScript (Vite) as a frontend',
                },
            ],
        })
    } else {
        console.log(c.gray('Frontend:'), framework)
    }

    console.log(
        c.gray('\nScaffolding template project into'),
        folder,
        c.gray('with'),
        framework,
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
                    `Project was created ar dir: ${path.join(process.cwd(), folder)}`,
                ),
            )
        })
        .catch(e => {
            console.log(c.red('Error occured: \n', e))
        })
}
