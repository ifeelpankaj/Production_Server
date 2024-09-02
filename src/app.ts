import type { Application, NextFunction, Request, Response } from 'express'
import express from 'express'
import path from 'path'

import router from './routes/apiRoute'
import globalErrorHandler from './middleware/globalErrorHandler'
import httpError from './utils/httpError'
import responseMessage from './constants/responseMessage'

const app: Application = express()
const __dirname = path.resolve()
app.use(express.json({ limit: '50mb' }))

app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/v1', router)

//404 Error handler
app.use((req: Request, _: Response, next: NextFunction) => {
    try {
        throw new Error(responseMessage.NOT_FOUND('route'))
    } catch (err) {
        httpError(next, err, req, 404)
    }
})

app.use(globalErrorHandler)

export default app
