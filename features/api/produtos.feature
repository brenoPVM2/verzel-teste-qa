Funcionalidade: Consulta de produtos via API
    Como consumidor da API da Verzel Store
    Eu quero consultar os produtos disponíveis
    Para exibir ou validar informações de catálogo

    @API-PROD-01 @basico
    Cenário: Listar todos os produtos
        Quando envio uma requisição GET para "/api/produtos"
        Então o status da resposta deve ser 200
        E a resposta deve conter uma lista de produtos com id, nome, descrição, categoria e preço

    @API-PROD-02 @alternativo
    Cenário: Consultar um produto existente pelo id
        Quando envio uma requisição GET para "/api/produtos/P001"
        Então o status da resposta deve ser 200
        E o produto retornado deve ser "Camiseta Essencial"

    @API-PROD-03 @excecao
    Cenário: Consultar um produto inexistente
        Quando envio uma requisição GET para "/api/produtos/P999"
        Então o status da resposta deve ser 404
        E o código de erro deve ser "PRODUTO_NAO_ENCONTRADO"