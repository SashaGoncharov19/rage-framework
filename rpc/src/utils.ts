import { EVENT_RESPONSE } from './events'

export enum Environment {
    CEF = 'CEF',
    CLIENT = 'CLIENT',
    SERVER = 'SERVER',
    UNKNOWN = 'UNKNOWN',
}

export enum Errors {
    EVENT_NOT_REGISTERED = 'Event not registered',
}

export type RPCState = {
    eventName: string
    uuid: string
    knownError?: string
    data?: any
    calledFrom: Environment
}

class Utils {
    public getEnvironment(): Environment {
        if (mp.joaat) return Environment.SERVER
        if (mp.game && mp.game.joaat) return Environment.CLIENT
        if ('mp' in window) return Environment.CEF
        return Environment.UNKNOWN
    }

    public prepareForExecute(data: string): RPCState {
        return JSON.parse(data)
    }

    public prepareForTransfer(data: RPCState): string {
        return JSON.stringify(data)
    }

    public generateUUID(): string {
        let uuid = '',
            random

        for (let i = 0; i < 32; i++) {
            random = (Math.random() * 16) | 0

            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-'
            }

            uuid += (
                i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random
            ).toString(16)
        }

        return uuid
    }

    public generateResponseEventName(uuid: string): string {
        return `${EVENT_RESPONSE}_${uuid}`
    }
}

export const utils = new Utils()
