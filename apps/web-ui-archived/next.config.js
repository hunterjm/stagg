require('dotenv').config()
module.exports = {
  env: {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
  },
  // add webpack config so the request dep in @stagg/api doesn't break client-side for lack of these modules
  webpack: (config) => ({
    ...config,
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    }
  })
}