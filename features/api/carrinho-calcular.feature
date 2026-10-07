Funcionalidade: Cálculo do carrinho via API
    Como consumidor da API da Verzel Store
    Eu quero calcular o total do carrinho
    Para conferir subtotal, desconto, frete e total antes de confirmar o pedido

    @API-CALC-01 @basico
    Cenário: Calcular carrinho sem cupom
        Quando envio POST para "/api/carrinho/calcular" com os itens:
            | produtoId | quantidade |
            | P002      | 1          |
            | P004      | 2          |
        Então o status da resposta deve ser 200
        E o subtotal deve ser 239.7
        E o desconto deve ser 0
        E o total deve ser 239.7

    @API-CALC-02 @alternativo
    Cenário: Calcular carrinho com cupom válido
        Quando envio POST para "/api/carrinho/calcular" com os itens:
            | produtoId | quantidade |
            | P002      | 1          |
            | P004      | 2          |
        E informo o cupom "BEMVINDO10"
        Então o desconto deve ser 23.97
        E o total deve ser 215.73

    @API-CALC-03 @alternativo
    Cenário: Calcular carrinho com cupom inválido não gera erro
        Quando envio POST para "/api/carrinho/calcular" com os itens:
            | produtoId | quantidade |
            | P001      | 1          |
        E informo o cupom "CUPOMFALSO"
        Então o status da resposta deve ser 200
        E "cupom.aplicado" deve ser false
        E "cupom.mensagem" deve ser "Cupom inválido."

    @API-CALC-04 @alternativo
    Cenário: Calcular carrinho com cupom expirado não gera erro
        Quando envio POST para "/api/carrinho/calcular" com os itens:
            | produtoId | quantidade |
            | P001      | 1          |
        E informo o cupom "VERAO2026"
        Então o status da resposta deve ser 200
        E "cupom.mensagem" deve ser "Cupom expirado."

    @API-CALC-05 @excecao
    Esquema do Cenário: Códigos de erro ao calcular o carrinho
        Quando envio POST para "/api/carrinho/calcular" com o corpo "<corpo>"
        Então o status da resposta deve ser <status>
        E o código de erro deve ser "<codigo>"

        Exemplos:
            | corpo                      | status | codigo                     |
            | sem itens                  | 422    | ITENS_OBRIGATORIOS         |
            | item sem quantidade        | 422    | ITEM_INVALIDO              |
            | produto inexistente        | 422    | PRODUTO_NAO_ENCONTRADO     |
            | mesmo produto duas vezes   | 422    | ITEM_DUPLICADO             |
            | quantidade igual a 0       | 422    | QUANTIDADE_INVALIDA        |
            | quantidade igual a 6       | 422    | QUANTIDADE_MAXIMA_EXCEDIDA |
            | corpo não é JSON válido    | 400    | JSON_INVALIDO              |

    @API-CALC-06 @excecao
    Cenário: Rota inexistente
        Quando envio GET para "/api/rota-que-nao-existe"
        Então o status da resposta deve ser 404
        E o código de erro deve ser "ROTA_NAO_ENCONTRADA"

    @API-CALC-07 @excecao
    Cenário: Método HTTP não permitido
        Quando envio DELETE para "/api/carrinho/calcular"
        Então o status da resposta deve ser 405
        E o código de erro deve ser "METODO_NAO_PERMITIDO"