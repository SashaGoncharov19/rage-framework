import { Rpc } from '@entityseven/rage-fw-rpc'

export const rpc = new Rpc({
    forceBrowserDevMode:
        process.env.RageFW_forceBrowserDevMode === 'true' ?? false,
    debugLogs: false,
})
