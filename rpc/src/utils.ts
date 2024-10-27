export enum Environment {
    BROWSER = 'BROWSER',
    CLIENT = 'CLIENT',
    SERVER = 'SERVER',
    UNKNOWN = 'UNKNOWN',
}

export enum Events {
    LOCAL_EVENT_LISTENER = '__rpc:listener',
    SERVER_EVENT_LISTENER = '__rpc:serverListener',
    EVENT_RESPONSE = '__rpc:response',
}

export enum Errors {
    EVENT_NOT_REGISTERED = 'Event not registered',
    UNKNOWN_ENVIRONMENT = 'Unknown environment',
    NO_BROWSER = 'You need to initialize browser first',
    EVENT_RESPONSE_TIMEOUT = 'Response was timed out after 10s of inactivity',
}

export type RPCState = {
    eventName: string
    uuid: string
    calledFrom: Environment
    calledTo: Environment
    knownError?: string
    data?: any
    type: RPCEventType
}

export type PlayerMp = {
    call: (event: string, args?: unknown[]) => void
}

export interface RpcWrapperConfig {
    forceBrowserDevMode?: boolean
}

export interface RpcConfig extends RpcWrapperConfig {
    debugLogs?: boolean
}

export class Utils {
    public static getEnvironment(): Environment {
        if ('joaat' in mp) return Environment.SERVER
        if (
            'game' in mp &&
            'joaat' in (mp as { game: { joaat?: unknown } }).game
        )
            return Environment.CLIENT
        if (window && 'mp' in window) return Environment.BROWSER
        return Environment.UNKNOWN
    }

    public static prepareExecution(data: string): RPCState {
        return JSON.parse(data)
    }

    public static prepareTransfer(data: RPCState): string {
        return JSON.stringify(data)
    }

    public static generateUUID(): string {
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

    public static generateResponseEventName(uuid: string): string {
        return `${Events.EVENT_RESPONSE}_${uuid}`
    }

    public static errorUnknownEnvironment(environment: Environment) {
        if (environment === Environment.UNKNOWN)
            throw new Error(Errors.UNKNOWN_ENVIRONMENT)
    }
}

export enum RPCEventType {
    EVENT = 'event',
    RESPONSE = 'response',
}

export const nativeClientEvents = new Set([
    'browserCreated',
    'browserDomReady',
    'browserLoadingFailed',
    'playerEnterCheckpoint',
    'playerExitCheckpoint',
    'consoleCommand',
    'click',
    'playerChat',
    'playerCommand',
    'playerDeath',
    'playerJoin',
    'playerQuit',
    'playerReady',
    'playerResurrect',
    'playerRuleTriggered',
    'playerSpawn',
    'playerWeaponShot',
    'dummyEntityCreated',
    'dummyEntityDestroyed',
    'entityControllerChange',
    'incomingDamage',
    'outgoingDamage',
    'meleeActionDamage',
    'playerEnterVehicle',
    'playerLeaveVehicle',
    'playerStartTalking',
    'playerStopTalking',
    'entityStreamIn',
    'entityStreamOut',
    'render',
    'playerCreateWaypoint',
    'playerReachWaypoint',
    'playerEnterColshape',
    'playerExitColshape',
    'explosion',
    'projectile',
    'uncaughtException',
    'unhandledRejection',
])

export const nativeServerEvents = new Set([
    'entityCreated',
    // 'entityDestroyed',
    'entityModelChange',
    'incomingConnection',
    'packagesLoaded',
    'playerChat',
    'playerCommand',
    'playerDamage',
    'playerDeath',
    'playerEnterCheckpoint',
    'playerEnterColshape',
    'playerEnterVehicle',
    'playerExitCheckpoint',
    'playerExitColshape',
    'playerExitVehicle',
    'playerJoin',
    'playerQuit',
    'playerReachWaypoint',
    'playerReady',
    'playerSpawn',
    'playerStartEnterVehicle',
    'playerStartExitVehicle',
    'playerStreamIn',
    'playerStreamOut',
    'playerWeaponChange',
    'serverShutdown',
    'trailerAttached',
    'vehicleDamage',
    'vehicleDeath',
    'vehicleHornToggle',
    'vehicleSirenToggle',
])
