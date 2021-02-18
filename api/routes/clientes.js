// Importações.

    const express = require('express');
    const router = express.Router();

    const authorizedClients = require('../../configs/authorizations');      // Simulação do banco de dados da autenticação de Aplicações Clientes.

    const jwt = require('jsonwebtoken');

    // const controller = require('../controllers/clientes.js');    -- TODO...

// Rotas.

    router.get('/authToken/', (req, res, next) => {     // Entrega o Token de autenticação aos clientes registrados.

        console.log('[Router_clientes] Verificando se cliente existe para atribuir o JWToken. ');

        let cliente = authorizedClients.find( (cliente) => {
            if (cliente.email === req.query.email && cliente.password === req.query.password){
                return cliente;
            }
        });

        if (cliente){

            console.log('Cliente válido! Entregando Token...');

            const accessToken = jwt.sign({      // Conteúdo acessível que estará dentro Token. (Não envie senhas!)
                email: cliente.email,
                tipoCliente: cliente.tipoCliente
            },
            process.env.JWT_KEY,    // Assinatura particular do Token (Isso só a REST API saberá).
            {
                expiresIn: '1h'     // Tempo de expiração desse Token. (O cliente precisará verificar se o token expirou e fazer um novo "login");
            });

            return res.status(200).json({
                message: 'Cliente válido! O Token de acesso foi entregue.',
                token: accessToken
            });
        } else {
            throw new Error('Cliente inválido, negando acesso à rota...'); // O errorHandler que vai tratar...
        }

    });

// Exportação.
module.exports = router;