import * as fs from 'node:fs'

const latestReleases =
    'https://git.entityseven.com/api/v1/repos/entityseven/rage-server-downloader/releases?page=1&limit=1'

type Release = {
    id: number
}

type Asset = {
    browser_download_url: string
}

export async function downloadUpdater(): Promise<void> {
    const ky = await import('ky').then(ky => ky.default)
    const id = await getLatestReleaseID()

    const latestAssets = `https://git.entityseven.com/api/v1/repos/entityseven/rage-server-downloader/releases/${id}/assets?page=1&limit=1`

    ky.get<Asset[]>(latestAssets)
        .then(response => response.json())
        .then(async data => {
            const downloadURL = data[0].browser_download_url

            const file = await ky.get(data[0].browser_download_url)
            const fileData = Buffer.from(
                file as unknown as WithImplicitCoercion<string>,
                'binary',
            )

            const fileSplit = downloadURL.split('/')
            const fileName = fileSplit[fileSplit.length - 1]

            fs.writeFileSync(`./${fileName}`, fileData)
        })
}

async function getLatestReleaseID() {
    const ky = await import('ky').then(ky => ky.default)
    return ky
        .get<Release[]>(latestReleases)
        .then(response => response.json())
        .then(data => data[0].id)
}
