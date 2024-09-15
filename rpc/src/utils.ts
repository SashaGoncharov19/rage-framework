import type { RPCData } from './types'
import { RPC_LISTENER } from './events'

export enum Environment {
    CEF = 'CEF',
    CLIENT = 'CLIENT',
    SERVER = 'SERVER',
    UNKNOWN = 'UNKNOWN',
}

function generateUUID(): string {
    let uuid = '',
        random

    for (let i = 0; i < 32; i++) {
        random = (Math.random() * 16) | 0

        if (i === 8 || i === 12 || i === 16 || i === 20) {
            uuid += '-'
        }

        uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(
            16,
        )
    }

    return uuid
}

export const utils = {
    environment: Environment,
    getEnvironment: () => {
        if (mp.joaat) return Environment.SERVER
        if (mp.game && mp.game.joaat) return Environment.CLIENT
        if ('mp' in window) return Environment.CEF
        return Environment.UNKNOWN
    },
    parseData: (data: string): RPCData => JSON.parse(data),
    stringifyData: (data: RPCData): string => JSON.stringify(data),
    generateResponseEventName: (uuid: string) => `${RPC_LISTENER}_${uuid}`,
    generateUUID,
}
