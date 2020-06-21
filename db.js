const Pool = require('pg').Pool;

const pool = new Pool({
  database: 'yojigendb',
  user: 'yojigenUser',
  password: 'yojigenPass',
  host: 'localhost',
  port: 5432,
});

module.exports = pool;