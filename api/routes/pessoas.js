/* Observações: Como desenvolvedores, ao construir uma REST API, devemos documentar de forma clara e consistente
                quais campos são necessários às rotas de nossa API.
*/

// Importações.
    const express = require('express');
    const router = express.Router();

    const Pessoa = require('../models/Pessoa');     // Modelo ORM da "tbl_pessoa".

    const controller = require('../controllers/pessoas');
    
// Rotas.
    router.get('/', controller.pessoas_getAll);

    router.get('/:idPessoa', controller.pessoas_getOne);

    router.post('/', controller.pessoas_createOne);

    router.patch('/:idPessoa', controller.pessoas_updateOne);

    router.delete('/:idPessoa', controller.pessoas_deleteOne);

// Exportação.
    module.exports = router;    // É necessário exportar os Routers (rotas) para utilizá-los em 'app.js', nosso requestListener.
