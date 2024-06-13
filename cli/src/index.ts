import c from 'chalk'
import { select } from '@inquirer/prompts'

import { checkForUpdate } from './utils/update'
import { initProject } from './commands/create'
import { downloadUpdater } from './commands/download-updater'

enum Actions {
    INIT_PROJECT = 'INIT_PROJECT',
    UPDATER = 'UPDATER',
}

;(async () => {
    await checkForUpdate()

    console.log(
        c.blueBright('Rage FW CLI | Powered by Entity Seven Group ️ <3'),
    )

    const action = await select({
        message: c.gray('Select action:'),
        choices: [
            {
                name: 'Initialize new project',
                value: Actions.INIT_PROJECT,
                description: 'Initialize new project and start develop',
            },
            {
                name: 'Install RAGE:MP updater',
                value: Actions.UPDATER,
                description:
                    'Use our custom updater to download and update RAGE:MP server files.',
            },
        ],
        loop: true,
    })

    if (action === Actions.INIT_PROJECT) await initProject()
    if (action === Actions.UPDATER) await downloadUpdater()
})()
