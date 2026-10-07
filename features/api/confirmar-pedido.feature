Funcionalidade: Criação de pedidos via API
    Como consumidor da API da Verzel Store
    Eu quero confirmar um pedido
    Para concluir a compra com os dados do cliente

    @API-PED-01 @basico
    Cenário: Confirmar pedido com dados válidos
        Quando envio POST para "/api/pedidos" com cliente "Breno Pablo", e-mail "breno@exemplo.com", CEP "01310-100" e itens:
            | produtoId | quantidade |
            | P005      | 1          |
        Então o status da resposta deve ser 201
        E o número do pedido deve seguir o formato "VZ-000000"

    @API-PED-02 @excecao
    Cenário: Pedido com cupom inválido retorna erro
        Quando envio POST para "/api/pedidos" com cupom "CUPOMFALSO" e dados válidos
        Então o status da resposta deve ser 422
        E o código de erro deve ser "CUPOM_INVALIDO"

    @API-PED-03 @excecao
    Cenário: Pedido com cupom expirado retorna erro
        Quando envio POST para "/api/pedidos" com cupom "VERAO2026" e dados válidos
        Então o status da resposta deve ser 422
        E o código de erro deve ser "CUPOM_EXPIRADO"

    @API-PED-04 @excecao
    Esquema do Cenário: Validação dos dados do cliente
        Quando envio POST para "/api/pedidos" com "<campo>" = "<valor>"
        Então o status da resposta deve ser 422
        E o código de erro deve ser "DADOS_INVALIDOS"
        E o campo com problema deve ser "<campo>"

        Exemplos:
            | campo | valor              |
            | nome  | Breno              |
            | email | breno-exemplo.com  |
            | cep   | 1310-10            |

    @API-PED-05 @alternativo
    Cenário: Pedido confirmado reflete o mesmo cálculo do carrinho
        Dado que calculei um carrinho com os mesmos itens via "/api/carrinho/calcular"
        Quando envio POST para "/api/pedidos" com os mesmos itens e dados válidos
        Então o subtotal, desconto, frete e total do pedido devem ser iguais aos do cálculo do carrinho