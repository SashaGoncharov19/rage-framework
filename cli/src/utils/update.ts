import axios from 'axios'
import c from 'chalk'
import yargs from 'yargs'

const latestVersionURL =
    'https://git.entityseven.com/api/v1/repos/entityseven/rage-framework/tags?page=1&limit=1'

type Version = {
    name: string
    message: string
}

export async function checkForUpdate(): Promise<void> {
    return new Promise(res => {
        yargs.showVersion(version =>
            axios
                .get<Version[]>(latestVersionURL)
                .then(({ data }) => {
                    const latestVersion = data[0].name

                    if (latestVersion !== `v${version}`)
                        notifyUserAboutUpdate(latestVersion)
                })
                .then(() => res()),
        )
    })
}

function notifyUserAboutUpdate(version: string) {
    console.log(c.green(`Update available. New version: ${version}`))
}
