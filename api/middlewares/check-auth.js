// Importações
    const jwt = require('jsonwebtoken');

// Exportação.
module.exports = (req, res, next) => {
    console.log('req url: ', req.url);

    if (req.url.match(/^\/clientes\/authToken/)){   // Como a rota de autenticação deverá ser a única rota acessível à qualquer um, simplesmente passamos ela adiante, caso uma requisição chegue para ela.
        return next();
    }

    try {

        /* Caso 01: Recebendo o Token por meio do BODY do Request. Não é o mais comum/recomendado. */
        // const decodedToken = jwt.verify(req.body.token, process.env.JWT_KEY);   // Agora a aplicação/cliente deverá enviar no request o Token de acesso para acessar as rotas da REST API.

        /* Caso 01: Recebendo o Token por meio dos Request Headers. É o modo recomendado. */
        const token = req.headers.authorization.split(" ")[1];  // Separa o Token, do indicador comum de authorização "Bearer " que nada mais é que uma convenção usada nesses sistemas para indicar que o Header "authorization" se trata de um Token de um cliente.

        const decoded = jwt.verify(token, process.env.JWT_KEY);     // O módulo "jsonwebtoken" verifica o token de acesso e retorna os dados do token.

        req.userData = decoded;     // Agora o objeto 'userData' da requisição possuirá os dados do usuário "autenticado" atribuidos ao Token na rota "clientes.js" e esses dados poderão ser usados nas rotas protegidas.
        console.log('[Middleware_check-auth] userData:', req.userData);
        return next();

    } catch (error) {

        return res.status(401).json({
            message: 'Auth failed'
        });

    }

}