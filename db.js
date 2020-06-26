require("dotenv").config();
const Pool = require('pg').Pool;

const pool = new Pool({
  database: process.env.ENV_DATABASE,
  user: process.env.ENV_USER,
  password: process.env.ENV_PASS,
  host: process.env.ENV_HOST,
  port: process.env.ENV_PORT,
});

module.exports = pool;