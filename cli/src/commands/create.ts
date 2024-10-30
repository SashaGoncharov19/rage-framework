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
            message: c.gray('Select front-end:'),
            default: 'react-18',
            loop: true,
            choices: [
                {
                    name: 'React 18',
                    value: 'react-18',
                    description: 'React 18 + TypeScript (Vite) as a front-end',
                },
            ],
        })
    } else {
        console.log(c.gray('Front-end:'), framework)
    }

    console.log(
        c.gray('\nScaffolding template project into'),
        folder,
        c.gray('with'),
        framework,
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
                    `Project was created ar dir: ${path.join(process.cwd(), folder)}`,
                ),
            )
        })
        .catch(e => {
            console.log(c.red('Error occured: \n', e))
            console.log(c.red('Please open an issue if you see this'))
        })
}
