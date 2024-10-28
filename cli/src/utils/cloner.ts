import { exec } from 'child_process'

export async function cloneBranch(link: string, path: string, branch: string) {
    return new Promise((resolve, reject) => {
        const args = ['--single-branch', '-b', branch, '--', link, path]
        const proc = exec('git clone ' + args.join(' '))

        proc.on('close', (status: number) => {
            if (status == 0) {
                resolve(true)
            } else if (status == 128) {
                reject(
                    `Folder already exists. 'git clone' from branch ${branch} failed with status ` +
                        status,
                )
            } else {
                reject(
                    `'git clone' from branch ${branch} failed with status ` +
                        status,
                )
            }
        })
    })
}
