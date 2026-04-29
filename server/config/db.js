const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'redwire_auto',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;

pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL conectado en Railway');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Error conexión MySQL:', err.message);
    console.error('  Host:', process.env.DB_HOST);
    console.error('  Port:', process.env.DB_PORT);
    console.error('  User:', process.env.DB_USER);
    console.error('  DB:',   process.env.DB_NAME);
  });