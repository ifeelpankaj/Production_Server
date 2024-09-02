import app from './app'
import config from './config/config'
import logger from './utils/logger'

const server = app.listen(config.PORT)

;(() => {
    try {
        logger.info('App_Started', {
            meta: { PORT: config.PORT }
        })
    } catch (error) {
        logger.error(`APPLICATION_ERROR`, { meta: error })

        server.close((error) => {
            if (error) {
                logger.error(`APPLICATION_ERROR`, { meta: error })
            }

            process.exit(1)
        })
    }
})()
