Funcionalidade: Carrinho de compras
    Como cliente da Verzel Store
    Eu quero adicionar e gerenciar produtos ao carrinho
    Para montar meu pedido antes de finalizar compra

    Contexto:
        Dado que eu estou na página de produtos da Verzel Store

    @CARR-01 @basico
    Cenário: Adicionar um produto ao carrinho
        Quando adiciono o produto "Camiseta Essencial" ao carrinho
        Então o carrinho deve exibir 1 item
        E o subtotal do carrinho deve ser "R$ 59,90"

    @CARR-02 @alternativo
    Cenário: Aumentar a quantidade de um produto no carrinho
        Dado que adicionei o produto "Boné Aba Curva" ao carrinho
        Quando aumento a quantidade para 3
        Então o subtotal do item deve ser "R$ 149,70"

    @CARR-03 @excecao
    Cenário: Não permitir mais de 5 unidades do mesmo produto
        Dado que adicionei o produto "Kit 3 Pares de Meias" ao carrinho
        Quando tento aumentar a quantidade para 6
        Então a quantidade deve permanecer em 5

    @CARR-04 @alternativo
    Cenário: Remover um produto do carrinho
        Dado que adicionei o produto "Mochila Urbana 20L" ao carrinho
        Quando removo o produto do carrinho
        Então o carrinho deve estar vazio

    @CARR-05 @alternativo
    Cenário: Esvaziar o carrinho
        Dado que adicionei 3 produtos diferentes ao carrinho
        Quando esvazio o carrinho
        Então o carrinho deve estar vazio

    @CARR-06 @excecao
    Cenário: Não permitir quantidade menor que 1
        Dado que adicionei o produto "Camiseta Essencial" ao carrinho
        Quando tento diminuir a quantidade abaixo de 1
        Então a quantidade deve permanecer em 1

    @CARR-07 @alternativo
    Cenário: Adicionar o mesmo produto duas vezes soma a quantidade
        Dado que adicionei o produto "Camiseta Essencial" ao carrinho
        Quando adiciono o mesmo produto novamente pela vitrine
        Então o carrinho deve ter uma única linha para esse produto
        E a quantidade deve ser 2

    @CARR-08 @alternativo
    Cenário: Carrinho vazio exibe estado vazio
        Dado que o carrinho está vazio
        Então devo ver a mensagem "Seu carrinho está vazio"
        E devo ver um link para voltar aos produtos

    @CARR-09 @excecao
    Cenário: Não é possível finalizar compra com carrinho vazio
        Dado que o carrinho está vazio
        Quando acesso a página de finalizar compra diretamente
        Então devo ser redirecionado para o estado de carrinho vazio