/**
 * Used to log to a client in-game console
 */
export class FW_Logger {
    /**
     * Informational logs. Colored in white
     *
     * @example
     * fw.system.log.info('some information to be logged')
     */
    public info(...message: unknown[]) {
        mp.console.logInfo(
            `[${new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', second: 'numeric', fractionalSecondDigits: 2 })}] [INFO] ${message.join(' ')}`,
        )
    }

    /**
     * Warning logs. Colored in yellow
     *
     * @example
     * fw.system.log.warn('warning message')
     */
    public warn(...message: unknown[]) {
        mp.console.logWarning(
            `[${new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', second: 'numeric', fractionalSecondDigits: 2 })}] [WARN] ${message.join(' ')}`,
        )
    }

    /**
     * Error logs. Colored in red
     *
     * @example
     * fw.system.log.info('some error information')
     */
    public error(...message: unknown[]) {
        mp.console.logError(
            `[${new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', second: 'numeric', fractionalSecondDigits: 2 })}] [ERROR] ${message.join(' ')}`,
        )
    }
}
