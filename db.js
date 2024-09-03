const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'matheus', 
  password: 'matheus123', 
  database: 'dnc_mysql',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.stack);
    return;
  }
  console.log('Conectado ao banco de dados com sucesso!');
});

module.exports = connection;
