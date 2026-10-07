Funcionalidade: Cupom de desconto e frete grátis
    Como cliente da Verzel Store
    Eu quero aplicar um cupom de desconto e ganhar frete grátis em compras maiores
    Para pagar menos nas minhas compras

    Contexto:
        Dado que eu estou na página do carrinho

    @CUPOM-01 @basico
    Cenário: Aplicar cupom válido
        Dado que o subtotal do carrinho é "R$ 239,70"
        Quando aplico o cupom "BEMVINDO10"
        Então o desconto aplicado deve ser "R$ 23,97"
        E devo ver a mensagem "Cupom aplicado: 10% de desconto nos produtos."

    @CUPOM-02 @alternativo
    Cenário: Cupom é case-insensitive e ignora espaços nas pontas
        Dado que o subtotal do carrinho é "R$ 239,70"
        Quando aplico o cupom "  bemvindo10  "
        Então o desconto aplicado deve ser "R$ 23,97"

    @CUPOM-03 @excecao
    Cenário: Aplicar cupom inexistente
        Quando aplico o cupom "CUPOMFALSO"
        Então devo ver a mensagem "Cupom inválido."
        E nenhum desconto deve ser aplicado

    @CUPOM-04 @excecao
    Cenário: Aplicar cupom expirado
        Quando aplico o cupom "VERAO2026"
        Então devo ver a mensagem "Cupom expirado."
        E nenhum desconto deve ser aplicado

    @CUPOM-05 @excecao
    Cenário: Tentar aplicar cupom sem preencher o campo
        Quando clico em "Aplicar cupom" sem informar um código
        Então devo ver a mensagem "Informe um cupom."
        E nenhum desconto deve ser aplicado

    @CUPOM-06 @alternativo
    Cenário: Trocar de cupom aplicado
        Dado que apliquei o cupom "BEMVINDO10"
        Quando removo o cupom atual
        E aplico outro cupom válido
        Então apenas o novo cupom deve estar ativo

    @CUPOM-07 @basico
    Cenário: Frete grátis para subtotal a partir de R$ 200,00
        Dado que o subtotal do carrinho é "R$ 200,00"
        Então o frete deve ser "R$ 0,00"

    @CUPOM-08 @alternativo
    Cenário: Frete fixo abaixo de R$ 200,00
        Dado que o subtotal do carrinho é "R$ 79,80"
        Então o frete deve ser "R$ 19,90"
        E devo ver quanto falta para o frete grátis

    @CUPOM-09 @alternativo
    Esquema do Cenário: Valor faltante para o frete grátis
        Dado que o subtotal do carrinho é "<subtotal>"
        Então a mensagem deve indicar que faltam "<faltante>" para o frete grátis

        Exemplos:
            | subtotal  | faltante  |
            | R$ 59,90  | R$ 140,10 |
            | R$ 150,00 | R$ 50,00  |
            | R$ 200,00 | R$ 0,00   |

    @CUPOM-10 @alternativo
    Cenário: Frete grátis considera o subtotal antes do desconto
        Dado que o subtotal do carrinho é "R$ 200,00"
        Quando aplico o cupom "BEMVINDO10"
        Então o frete deve continuar "R$ 0,00"

    @CUPOM-11 @alternativo
    Cenário: Desconto do cupom não incide sobre o frete
        Dado que o subtotal do carrinho é "R$ 100,00"
        Quando aplico o cupom "BEMVINDO10"
        Então o frete cobrado deve ser "R$ 19,90"