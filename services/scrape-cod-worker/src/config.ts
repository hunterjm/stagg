if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
}

export default {
    mongo: {
        db: 'callofduty',
        host: process.env.MONGO_HOST,
        user: process.env.MONGO_USER,
        password: process.env.MONGO_PASS,
    }
}
