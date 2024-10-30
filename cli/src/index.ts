import c from 'chalk'
import { select } from '@inquirer/prompts'

import { checkForUpdates } from './utils/update'
import { initProject } from './commands/create'
import { downloadUpdater } from './commands/download-updater'
import { testRpc } from './commands/test-rpc'

enum Actions {
    INIT_PROJECT = 'INIT_PROJECT',
    TEST_RPC = 'TEST_RPC',
    UPDATER = 'UPDATER',
}

process.on('exit', () => {
    console.log(c.blueBright('\n\nRage FW CLI | Exiting..'))
    process.exit(0)
})

process.on('SIGINT', () => {
    console.log(c.blueBright('\n\nRage FW CLI | Exiting..'))
    process.exit(0)
})
;(async () => {
    await checkForUpdates()

    console.log(c.blueBright('Rage FW CLI | Powered by Entity Seven Group <3'))

    const action = await select({
        message: c.gray('Select action:'),
        choices: [
            {
                name: 'Initialize a new project',
                value: Actions.INIT_PROJECT,
                description: 'Initialize a new project and start developing',
            },
            {
                name: 'Test our Rpc',
                value: Actions.TEST_RPC,
                description:
                    'Initialize a new skeleton project with our Rpc all set',
            },
            {
                name: 'Install RAGE:MP updater',
                value: Actions.UPDATER,
                description:
                    'Use our tool to download or update RAGE:MP server files in just two clicks',
            },
        ],
        loop: true,
    })

    switch (action) {
        case Actions.INIT_PROJECT:
            await initProject()
            break
        case Actions.TEST_RPC:
            await testRpc()
            break
        case Actions.UPDATER:
            await downloadUpdater()
            break
        default:
            console.log(c.red('Something went wrong..'))
            console.log(c.red('Please open an issue if you see this'))
    }
})()
