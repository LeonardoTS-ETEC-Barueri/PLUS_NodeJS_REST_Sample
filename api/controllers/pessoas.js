// Importações.
    const Pessoa = require('../models/Pessoa');

// Controllers.

    /**
     * Exibe todos os registros da tabela de Pessoas em uma Requisição HTTP do tipo GET.
     * 
     * Exemplo: ( GET: http://localhost:3000/pessoas/ ).
     * 
     */
    const pessoas_getAll = (req, res, next) => {                           // Listará todas as Pessoas da rota /pessoas.

        Pessoa.findAll({ raw: true })
        .then((result) => {

            console.log('GET: "/pessoas" - Pessoas encontradas... \n', result);

            if (result.length === 0){
                res.status(200).json({
                    message: 'Nenhuma pessoa foi encontrada.'
                });
            } else {
                res.status(200).json({
                    message: 'Pessoas encontradas.',
                    pessoas: result
                });
            }

        })
        .catch((error) => {

            console.log('GET: "/pessoas" - Algo deu errado... \n', error);

            res.status(500).json({
                error: error
            });

        });

    };

    /**
    * Exibe o registro de uma Pessoa específica ao passar o ID dessa pessoa na queryString em uma Requisição HTTP do tipo GET.
    * 
    * Exemplo: ( GET: http://localhost:3000/pessoas/1 )
    */
   const pessoas_getOne = (req, res, next) => {                  // Exibirá informações de uma Pessoa específica.

        if (req.params.idPessoa.match(/[^\d]+/g)){
            return res.status(400).json({
                message: "Requisição inválida - O id de um usuário deve ser um dígito."
            });
        }

        Pessoa.findOne({ where: { id_pessoa: req.params.idPessoa }, raw: true })
        .then((result) => {
            console.log(`GET: "/pessoas/${req.params.idPessoa}" - Dados da pessoa.\n`, result);
            res.status(200).json({
                message: "Pessoa encontrada com sucesso.",
                pessoaEncontrada: result

            });
        })
        .catch((error) => {
            console.log(`GET: "/pessoas/${req.params.idPessoa}" - Algo deu errado...\n`, error);
            res.status(500).json({
                error: error
            });
        });

    };

    /**
     * Se os campos corretos forem enviados em uma Requisição HTTP do tipo POST. Uma nova pessoa será cadastrada.
     * 
     * Campos necessários:
     * 
     * (string) -> nome, genero, nacionalidade.
     * 
     * (int) -> idade.
     * 
     */
    const pessoas_createOne = (req, res, next) => {                 // Criará uma nova instância de Pessoa.

        if (req.body.idade.match(/[^\d]+/g)){                       // Exemplo de validação: Caso encontre qualquer caractere que não seja dígito para "idade"...
            return res.status(400).json({
                message: "Requisição inválida - Idade deve ser um número",
            });
        }

        Pessoa.create({ 
            nome: req.body.nome,
            idade: req.body.idade,
            genero: req.body.genero,
            nacionalidade: req.body.nacionalidade
        }, 
        { 
            logging: (result) => { 
                console.log(result) 
            },
            raw: true   // Exiba apenas o (dataValues) - Os dados registrados, em formato JSON.
        })
        .then((result) => {
            console.log('POST: "/pessoas" - Pessoa gerada', result);

            res.status(200).json({
                message: "Nova pessoa cadastrada com sucesso.",
                pessoaGerada: result
            });
        })
        .catch((error) => {
            console.log('POST: "/pessoas" - Algo deu errado...\n', error);

            res.status(500).json({
                error: error
            });
        });
        
    };

    /**
     * Se um ID válido for enviado na queryString da requisição, e os campos corretos forem enviados em uma Requisição HTTP do tipo PATCH.
     * A pessoa relacionada ao ID terá seus dados atualizados.
     * 
     * Campos que podem ser atualizados:
     * 
     * (string) -> nome, genero, nacionalidade.
     * 
     * (int) -> idade.
     * 
     * Ao enviar a requisição, o objeto deverá conter uma chave "propName" cujo valor seja o nome do campo à ser atualizado.
     * 
     * Em aplicações web isso pode ser passado como um atributo data-set.
     * 
     */
    const pessoas_updateOne = (req, res, next) => {                // Atualizará dados de uma Pessoa (Não re-cria, apenas modifica campos específicos).

        if (req.params.idPessoa.match(/[^\d]+/g)){
            return res.status(400).json({
                message: "Requisição inválida - O id de um usuário deve ser um dígito."
            });
        }

        let operacoesUpdate = {};     // Inicialização de um Javascript Object que vai conter as operações enviadas na requisição.

        for (const operacao of req.body){
            /*
                "req.body" é um array que vai conter objetos. Cada um dos objetos será chamado de "operacao".
                "operacao" é um objeto, então, pode conter pares de { "Chave": "valor" }.
            */
            if (operacao.propName !== "id_pessoa"){     // Restrição para que o "id_pessoa" (chave primária) não seja manipulada.
                operacoesUpdate[operacao.propName] = operacao.value;
            } 
            /*
                Cada operacao, contém um atributo "propName" com um valor específico, e outro atributo "value" com um valor específico.
                Então podemos ter...
                [   <-- Abertura do array enviado à "req.body".

                    { "propName": "idade", "value": 8 },    <-- Primeira "operacao"
                    { "propName": "nome", "value": "José"}  <-- Segunda "operacao"

                ]

                No fim, cada loop criará um atributo ao objeto "operacoesUpdate", com o "nome" atribuido à "propName" e o valor atribuído à "value".
                Ex: operacoesUpdate.idade = 8;
                    operacoesUpdate.nome = "José"

                Após o loop visualizarmos o estado de "operacoesUpdate", veremos a seguinte combinação de Chave:Valor...

                    { 
                        idade: 8,
                        nome: "José"
                    }

                E é exatamente isso que desejamos para alterar dados específicos de forma dinâmica nessa requisição.
            */
        }

        console.log(`PATCH: "/pessoas/${req.params.idPessoa}" - Campos a serem alterados...\n`, operacoesUpdate);

        Pessoa.update( operacoesUpdate , { where: { id_pessoa: req.params.idPessoa }, limit: 1 } )      // Normalmente no 1º parâmetros passamos por exemplo: { idade: "valor" }, mas como "operacoesUpdate" já é um Objeto Javascript, não precisamos colocar em chaves.
        .then((resultPatch) => {

            console.log(`PATCH: "/pessoas/${req.params.idPessoa}" - Os dados da pessoa foram atualizados: `, resultPatch);

            Pessoa.findOne({ where: {id_pessoa: req.params.idPessoa}, raw: true }).then((resultFindOne) => {
                console.log(`PATCH: "/pessoas/${req.params.idPessoa}" - Enviando os dados atualizados da pessoa...`);
                res.status(200).json({
                    message: "Os dados da pessoa foram atualizados!",
                    pessoaAtualizada: resultFindOne
                });
            })
            .catch((errorFindOne) => {
                console.log(`PATCH: "/pessoas/${req.params.idPessoa}" - Algo deu errado ao encontrar a pessoa após a atualização...\n`, errorFindOne)
                res.status(500).json({
                    error: errorFindOne
                });
            });

        })
        .catch((errorPatch) => {
            console.log(`PATCH: "/pessoas/${req.params.idPessoa}" - Algo deu errado ao atualizar os dados da pessoa: `, errorPatch);
            res.status(500).json({
                error: errorPatch
            });
        });
       
    };


    /**
     * Se um ID válido for enviado na queryString da requisição em uma Requisição HTTP do tipo DELETE.
     * 
     * A pessoa relacionada ao ID terá seus dados excluídos.
     * 
     * Exemplo: ( DELETE: http://localhost:3000/1 )
     * 
     */
    const pessoas_deleteOne = (req, res, next) => {               // Exclui os dados de uma Pessoa.

        if (req.params.idPessoa.match(/[^\d]+/g)){
            return res.status(400).json({
                message: "Requisição inválida - O id de um usuário deve ser um dígito."
            });
        }

        Pessoa.destroy({ where: { id_pessoa: req.params.idPessoa }, limit: 1 })
        .then((result) => {
            console.log(`DELETE: "/pessoas/${req.params.idPessoa}" - Dados da pessoa foram deletados.`, result);
            res.status(200).json({
                message: "Os dados da pessoa foram deletados!",
            });
        })
        .catch((error) => {
            console.log(`DELETE: "/pessoas/${req.params.idPessoa}" - Algo deu errado...\n`, error);
            res.status(500).json({
                error: error
            });
        });

    };


// Exportação.

module.exports = {
    pessoas_getAll,
    pessoas_getOne,
    pessoas_createOne,
    pessoas_updateOne,
    pessoas_deleteOne
}