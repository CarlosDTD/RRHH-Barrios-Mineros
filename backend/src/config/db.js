const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || '/var/run/postgresql',
  port: process.env.DB_PORT,
};
if (process.env.DB_PASSWORD) poolConfig.password = process.env.DB_PASSWORD;
if (process.env.DB_SSL || (process.env.DB_HOST && process.env.DB_HOST !== '/var/run/postgresql')) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('Base de datos conectada con éxito');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
};
