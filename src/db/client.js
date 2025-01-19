const { Client } = require('pg');

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const client = new Client({
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT
})

client.connect()

module.exports = {
  client
}