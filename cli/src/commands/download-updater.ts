import axios from 'axios'
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
    const id = await getLatestReleaseID()

    const latestAssets = `https://git.entityseven.com/api/v1/repos/entityseven/rage-server-downloader/releases/${id}/assets?page=1&limit=1`

    axios.get<Asset[]>(latestAssets).then(async ({ data }) => {
        const downloadURL = data[0].browser_download_url

        const file = await axios.get(data[0].browser_download_url, {
            responseType: 'arraybuffer',
        })
        const fileData = Buffer.from(file.data, 'binary')

        const fileSplit = downloadURL.split('/')
        const fileName = fileSplit[fileSplit.length - 1]

        fs.writeFileSync(`./${fileName}`, fileData)
    })
}

async function getLatestReleaseID() {
    return axios.get<Release[]>(latestReleases).then(({ data }) => data[0].id)
}
