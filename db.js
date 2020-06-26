const Pool = require('pg').Pool;

const pool = new Pool({
  database: ENV_DATABASE,
  user: ENV_USER,
  password: ENV_PASS,
  host: ENV_HOST,
  port: ENV_PORT,
});

module.exports = pool;