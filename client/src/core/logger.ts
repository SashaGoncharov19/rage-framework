/**
 * Used to log to a client in-game console
 */
export class Logger {
    /**
     * Informational logs. Colored in white
     *
     * @example
     * fw.system.log.info('some information to be logged')
     */
    public info(...message: unknown[]) {
        mp.console.logInfo(
            `[${new Date().toLocaleTimeString()}] [INFO] ${message.join(' ')}`,
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
            `[${new Date().toLocaleTimeString()}] [WARN] ${message.join(' ')}`,
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
            `[${new Date().toLocaleTimeString()}] [ERROR] ${message.join(' ')}`,
        )
    }
}
