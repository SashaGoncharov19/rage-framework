import { Environment } from './utils'

export type RPCData = {
    data?: any
    from: Environment
    to: Environment
    eventName: string
    uuid: string
}
