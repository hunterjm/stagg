// .env is only used for local
require('dotenv').config()
export default {
    port: process.env.PORT || 8080,
    jwt: process.env.JWT_SECRET,
    mongo: {
        host: process.env.DISCORD_MONGO_HOST,
        user: process.env.DISCORD_MONGO_USER,
        password: process.env.DISCORD_MONGO_PASS,
    },
    discord: {
        token: process.env.DISCORD_CLIENT_TOKEN,
    }
}
