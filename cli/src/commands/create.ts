import type { CommandModule } from 'yargs'
import c from 'chalk'
import { input, select } from '@inquirer/prompts'
import clone from 'git-clone'
import path from 'node:path'

// the handler function will be called when our command is executed
// it will receive the command line arguments parsed by yargs
async function handler() {
    const folder = await input({
        message: c.gray('Enter project name:'),
        default: 'rage-fw',
    })
    const framework = await select({
        message: c.gray('Select frontend:'),
        default: 'react',
        loop: true,
        choices: [
            {
                name: 'React + TypeScript (Vite)',
                value: 'react',
                description: 'React + TypeScript (Vite) as a frontend',
            },
            // {
            //     name: 'vue',
            //     value: 'vue',
            //     description: 'npm is the most popular package manager',
            // },
        ],
    })

    console.log(
        c.gray('\nScaffolding template project into'),
        folder,
        c.gray('with'),
        framework,
        c.gray('as a frontend..'),
    )

    clone(
        'https://git.entityseven.com/entityseven/rage-framework-example',
        path.join(__dirname, folder),
        {},
        err => {
            if (err) {
                console.log(c.red('Error occured: \n', err))
                return
            }
            console.log(c.gray('Scaffolded project into'), folder)
            console.log(
                c.blueBright(
                    'Working on Rage Framework. RageFW © Powered by Entity Seven Group',
                ),
            )
        },
    )
}

// name and description for our command module
const init: CommandModule = {
    command: 'create [template]',
    aliases: 'c',
    describe: 'Scaffold a template project using RageFW',
    handler,
}

export default init
