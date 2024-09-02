/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import type { Request } from 'express'
import type { THttpError } from '../types/types'
import responseMessage from '../constants/responseMessage'
import config from '../config/config'
import { EApplicationEnvironment } from '../constants/application'
import logger from './logger'
// import logger from './logger'

export default (err: Error | unknown, req: Request, errorStatusCode: number = 500): THttpError => {
    const errorObj: THttpError = {
        success: false,
        statusCode: errorStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl
        },
        message: err instanceof Error ? err.message || responseMessage.SOMETHING_WENT_WRONG : responseMessage.SOMETHING_WENT_WRONG,
        data: null,
        trace: err instanceof Error ? { error: err.stack } : null
    }

    // Log
    logger.error(`CONTROLLER_ERROR`, {
        meta: errorObj
    })

    // Production Env check
    if (config.ENV === EApplicationEnvironment.PRODUCTION) {
        delete errorObj.request.ip
        delete errorObj.trace
    }

    return errorObj
}
