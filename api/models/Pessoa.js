// Importações.
    const {DataTypes} = require('sequelize');

// Instância da conexão com a DB.
    const {connection} = require('../../configs/database');

// Definição do Model 'Pessoa' para 'tbl_pessoas'.
    const Pessoa = connection.define('Pessoa', {    // Definição do modelo 'Pessoa'
        
        id_pessoa: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, unique: true, autoIncrement: true,
            primaryKey: true    
        },
        nome: { type: DataTypes.STRING, allowNull: false },
        idade: { type: DataTypes.STRING(3), allowNull: false},
        genero: { type: DataTypes.ENUM(['M', 'F', 'Outros']), allowNull: false},
        nacionalidade: { type: DataTypes.STRING(50), allowNull: false }

    }, {    // Opções...
        freezeTableName: true,
        tableName: 'tbl_pessoas',
        timestamps: false
    });

// Exportação.
    module.exports = Pessoa;