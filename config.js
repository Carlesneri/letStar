const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  DB_URI: process.env.LETSTAR_DB_URI,
  TOKEN_SECRET: process.env.LETSTAR_TOKEN_SECRET
}