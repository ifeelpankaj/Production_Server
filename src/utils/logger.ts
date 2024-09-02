/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import util from 'util'
import type { Logger } from 'winston'
import { createLogger, format, transports } from 'winston'
import type { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports'
import config from '../config/config'
import { EApplicationEnvironment } from '../constants/application'
import path from 'path'
import moment from 'moment-timezone'
import { red, blue, yellow, green, magenta } from 'colorette'

const __dirname = path.resolve()
const formatTimestamp = (timestamp: string): string => {
    // Format timestamp to 'DD MMM YYYY HH:mm' in IST
    return moment(timestamp).tz('Asia/Kolkata').format('DD MMM YYYY HH:mm')
}
const consoleLogFormat = format.printf((info) => {
    const timestamp = formatTimestamp(info.timestamp)
    const { level, message, meta = {} } = info

    const customLevel = colorizeLevel(level.toUpperCase())
    const customTimestamp = green(timestamp)
    const customMessage = message

    const customMeta = util.inspect(meta, {
        showHidden: false,
        depth: null,
        colors: true
    })

    const customLog = `${customLevel} ${customTimestamp} : ${customMessage}\n${magenta('META')} ${customMeta}\n`

    return customLog
})

const fileLogFormat = format.printf((info) => {
    const timestamp = formatTimestamp(info.timestamp)
    const { level, message, meta = {} } = info

    const logMeta: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(meta)) {
        if (value instanceof Error) {
            logMeta[key] = {
                name: value.name,
                message: value.message,
                trace: value.stack || ''
            }
        } else {
            logMeta[key] = value
        }
    }

    const logData = {
        level: level.toUpperCase(),
        message,
        timestamp,
        meta: logMeta
    }

    return JSON.stringify(logData, null, 4)
})

const consoleTransport = (): ConsoleTransportInstance[] => {
    if (config.ENV === EApplicationEnvironment.DEVELOPMENT) {
        return [
            new transports.Console({
                level: 'info',
                format: format.combine(format.timestamp(), consoleLogFormat)
            })
        ]
    }
    return []
}

const fileTransport = (): FileTransportInstance[] => {
    return [
        new transports.File({
            filename: path.join(__dirname, '../', '../', 'logs', `${config.ENV}.log`),
            level: 'info',
            format: format.combine(format.timestamp(), fileLogFormat)
        })
    ]
}

const logger: Logger = createLogger({
    defaultMeta: { meta: {} },
    transports: [...fileTransport(), ...consoleTransport()]
})

export default logger

function colorizeLevel(level: string): string {
    switch (level.toUpperCase()) {
        case 'ERROR':
            return red(level)
        case 'INFO':
            return blue(level)
        case 'WARN':
            return yellow(level)
        default:
            return level
    }
}
