const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'db', // Usa 'db' porque así se llama el servicio en tu docker-compose
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'pentest_db',
  port: 5432,
  options: '-c search_path=pentest_lab'
});

module.exports = pool;
