# StockDrink

Sistema web para gestão de distribuidora de bebidas, desenvolvido com **Laravel**, **React**, **Inertia.js** e **MySQL**.  
O projeto permite controlar produtos, estoque, pedidos, relatórios e exportação em PDF de forma simples e organizada.

---

## Funcionalidades

- Autenticação de usuário
- Cadastro e edição de produtos
- Controle de categorias
- Controle de estoque por **unidade** e **fardo**
- Registro de entradas, saídas e ajustes de estoque
- Criação e gerenciamento de pedidos
- Atualização de status dos pedidos
- Cancelamento de pedidos com devolução automática ao estoque
- Relatórios gerenciais
- Exportação de relatórios em **PDF**
- Exportação de pedido individual em **PDF**
- Lista de separação diária em **PDF**
- Interface responsiva

---

## Tecnologias utilizadas

### Back-end
- Laravel
- PHP
- MySQL

### Front-end
- React
- Inertia.js
- Tailwind CSS

### Outros
- Laravel Breeze
- DomPDF
- Heroicons
- Chart.js

---

## Arquitetura

O projeto segue a arquitetura **MVC**, utilizando:

- **Model** para representar e manipular os dados
- **View** com React + Inertia.js
- **Controller** para intermediar regras de negócio e fluxo da aplicação

Embora utilize React na interface, o sistema **não foi estruturado como uma API REST independente**, mas sim como uma aplicação web integrada ao padrão MVC do Laravel.

---

## Módulos do sistema

### Produtos
Permite cadastrar, editar e organizar os produtos da distribuidora, incluindo:
- categoria
- preço por unidade
- preço por fardo
- unidades por fardo
- estoque mínimo

### Estoque
Responsável pelo controle das movimentações:
- entrada
- saída
- ajuste manual
- alerta de estoque baixo
- histórico de movimentações

### Pedidos
Permite:
- criar pedidos
- calcular total automaticamente
- escolher venda por unidade ou fardo
- alterar status
- cancelar pedido com devolução ao estoque
- gerar PDF do pedido

### Relatórios
Apresenta:
- visão geral das vendas
- vendas por categoria
- produtos com estoque baixo
- pedidos recentes
- exportação em PDF

---


### Pré-requisitos
- PHP 8+
- Composer
- Node.js
- MySQL
- Git

