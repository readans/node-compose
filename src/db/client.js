const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  password: 'People123',
  host: 'localhost',
  port: 5432
})

client.connect()

module.exports = {
  client
}