export class Logger {
    public error(...message: unknown[]) {
        mp.console.logError(
            `[${new Date().toLocaleTimeString()}] [ERROR] ${message.join(' ')}`,
        )
    }

    public warn(...message: unknown[]) {
        mp.console.logWarning(
            `[${new Date().toLocaleTimeString()}] [WARN] ${message.join(' ')}`,
        )
    }

    public info(...message: unknown[]) {
        mp.console.logInfo(
            `[${new Date().toLocaleTimeString()}] [INFO] ${message.join(' ')}`,
        )
    }
}
