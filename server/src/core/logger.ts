import winston, { format } from 'winston'

const { timestamp, printf, colorize } = format

/** Used to log in a server console */
export class Logger {
    private format = printf(({ message, level, timestamp }) => {
        return `[${new Date(timestamp).toLocaleTimeString()}] [${level}]: ${message}`
    })

    private systemLogger = winston.createLogger({
        transports: [new winston.transports.Console()],
        format: format.combine(
            colorize({
                level: true,
                colors: {
                    error: 'red',
                    warn: 'yellow',
                    info: 'white',
                },
            }),
            timestamp(),
            this.format,
        ),
    })

    /**
     * Informational logs. Colored in white
     *
     * @example
     * fw.system.log.info('some information to be logged')
     */
    public info(...message: unknown[]) {
        this.systemLogger.info(message.join(' '))
    }

    /**
     * Warning logs. Colored in yellow
     *
     * @example
     * fw.system.log.warn('warning message')
     */
    public warn(...message: unknown[]) {
        this.systemLogger.warn(message.join(' '))
    }

    /**
     * Error logs. Colored in red
     *
     * @example
     * fw.system.log.info('some error information')
     */
    public error(...message: unknown[]) {
        this.systemLogger.error(message.join(' '))
    }
}
