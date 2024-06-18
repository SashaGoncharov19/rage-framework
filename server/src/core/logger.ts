import winston, { format } from 'winston'

const { timestamp, printf, colorize } = format

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

    public info(message: unknown) {
        this.systemLogger.info(message)
    }

    public warn(message: unknown) {
        this.systemLogger.warn(message)
    }

    public error(message: unknown) {
        this.systemLogger.error(message)
    }
}
