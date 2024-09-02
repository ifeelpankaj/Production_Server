import dotenvFlow from 'dotenv-flow'

dotenvFlow.config()

export default {
    // General
    ENV: process.env.ENV,
    PORT: process.env.PORT
}
