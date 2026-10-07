Funcionalidade: Finalização do pedido
    Como cliente da Verzel Store
    Eu quero informar meus dados de entrega
    Para confirmar meu pedido

    Contexto:
        Dado que tenho produtos no carrinho
        E estou na página de finalizar compra

    @PED-01 @basico
    Cenário: Confirmar pedido com dados válidos
        Quando preencho nome "Breno Pablo", e-mail "breno@exemplo.com" e CEP "01310-100"
        E confirmo o pedido
        Então devo ver o título "Pedido confirmado"
        E devo ver um número de pedido no formato "VZ-000000"
        E devo ver a saudação "Obrigado, Breno."

    @PED-02 @excecao
    Cenário: Submeter formulário vazio
        Quando confirmo o pedido sem preencher nenhum campo
        Então devo ver "Informe o nome completo."
        E devo ver "Informe o e-mail."
        E devo ver "Informe o CEP."

    @PED-03 @excecao
    Cenário: Nome sem sobrenome é inválido
        Quando preencho o nome com apenas "Breno"
        E confirmo o pedido
        Então devo ver a mensagem "Informe nome e sobrenome."

    @PED-04 @excecao
    Cenário: E-mail em formato inválido
        Quando preencho o e-mail com "Breno-arroba-exemplo.com"
        E confirmo o pedido
        Então devo ver a mensagem "Informe um e-mail válido."

    @PED-05 @excecao
    Cenário: CEP com menos de 8 dígitos é inválido
        Quando preencho o CEP com "1310-10"
        E confirmo o pedido
        Então devo ver a mensagem "Informe um CEP com 8 dígitos."

    @PED-06 @alternativo
    Esquema do Cenário: CEP aceita com ou sem hífen
        Quando preencho o CEP com "<cep>" e os demais dados válidos
        E confirmo o pedido
        Então o pedido deve ser confirmado com sucesso

        Exemplos:
            | cep       |
            | 01310100  |
            | 01310-100 |

    @PED-07 @alternativo
    Cenário: Carrinho é esvaziado após confirmar o pedido
        Dado que confirmei um pedido com sucesso
        Quando acesso a página do carrinho
        Então o carrinho deve estar vazio