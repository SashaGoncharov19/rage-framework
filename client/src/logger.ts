export default class Logger {
    public error(message: unknown) {
        mp.console.logError(
            `[${new Date().toLocaleTimeString()}] [ERROR] ${message}`,
        )
    }

    public warn(message: unknown) {
        mp.console.logWarning(
            `[${new Date().toLocaleTimeString()}] [WARN] ${message}`,
        )
    }

    public info(message: unknown) {
        mp.console.logInfo(
            `[${new Date().toLocaleTimeString()}] [INFO] ${message}`,
        )
    }
}
