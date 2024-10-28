import c from 'chalk'
import yargs from 'yargs'

const latestVersionURL =
    'https://git.entityseven.com/api/v1/repos/entityseven/rage-framework/tags?page=1&limit=1'

type Version = {
    name: string
    message: string
}

export async function checkForUpdates(): Promise<void> {
    const ky = await import('ky').then(ky => ky.default)

    return new Promise(res => {
        yargs.showVersion(version =>
            ky
                .get<Version[]>(latestVersionURL)
                .then(response => response.json<Version[]>())
                .then(data => {
                    const latestVersion = data[0].name

                    if (latestVersion !== `v${version}`)
                        notifyUserAboutUpdate(latestVersion)
                    else console.log(c.yellow(`Version: ${version}`))
                })
                .then(() => res()),
        )
    })
}

function notifyUserAboutUpdate(version: string) {
    console.log(c.green(`Update available. New version: ${version}`))
}
