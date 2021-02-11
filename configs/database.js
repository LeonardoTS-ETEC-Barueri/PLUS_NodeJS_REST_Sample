// Importações.
    const {Sequelize} = require('sequelize');     // ORM que nos ajudará a lidar com SGBDR MySQL.

    // Atenção, uma das dependências é o Driver de conexão com o MySQL --> Instale via NPM o módulo "mysql2"... [ npm install --save mysql2 ].

// Instância do Sequelize ORM.

    const connection = new Sequelize('db_nodejs_rest_sample', 'root', '', {
        host: '127.0.0.1',
        port: '3306',
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 1000 * 30,
            idle: 1000 * 10
        },
        logging: (msg) => { console.log(msg) }
    });

    const checkConnection = () => {
        connection.authenticate()
        .then((res) => {
            console.log('[DB] Conexão estabelecida...');
        })
        .catch((error) => {
            console.log('[DB] Conexão falhou...\n', error);
        });
    }

// Exportação.
module.exports = {
    connection,
    checkConnection
};