## Projeto de PDS

#### Descrição do projeto

Desenvolvimento de um sistema web para uma distribuidora de bebidas, com foco no controle de estoque, gerenciamento de pedidos e autenticação de acesso. O objetivo é substituir processos manuais por uma solução prática e segura, capaz de melhorar a organização, a agilidade e a confiabilidade das operações internas.

#### Escopo funcional

- Autenticação: cadastro, login e recuperação de senha para acesso ao sistema.
- Gestão de produtos: cadastro, edição, consulta e desativação de produtos, com informações como categoria, preço, quantidade em estoque, estoque mínimo e status.
- Controle de estoque: registro de entradas e saídas, ajustes manuais, histórico de movimentações e alertas de estoque mínimo.
- Gerenciamento de pedidos: criação de pedidos, inclusão de itens, cálculo automático de valores, alteração de status e reserva de estoque ao confirmar o pedido.
- Relatórios e consultas: listagens de produtos, histórico de pedidos, relatórios de vendas e movimentação de estoque.

#### Padrões de arquitetura

- Framework principal: Laravel com arquitetura MVC.
- Front-end integrado com React + Inertia.js.
- Eloquent ORM para acesso e manipulação de dados.
- Migrations e Seeders para versionamento do banco e dados de teste.
- Controllers organizados por responsabilidade.
- Separação de responsabilidades com Services quando necessário para regras de negócio.
- Interface administrativa desenvolvida em React, integrada ao Laravel por meio do Inertia.

#### Regras de negócio

- Campos obrigatórios do produto: nome, categoria, preço, quantidade em estoque, estoque mínimo e status.
- O estoque não pode ficar negativo.
- Ao confirmar um pedido, o sistema deve reservar ou dar baixa na quantidade disponível em estoque.
- O cancelamento de pedido deve liberar a reserva de estoque, quando aplicável.
- Produtos com histórico vinculado a pedidos não devem ser excluídos permanentemente, mas marcados como inativos.
- O pedido deve seguir um fluxo de status, como: Pendente, Confirmado, Em Separação, Enviado, Entregue ou Cancelado.

#### Requisitos não funcionais

- Segurança: proteção contra acesso indevido, hashing de senhas, validação e sanitização de entradas.
- Usabilidade: interface responsiva, navegação intuitiva e linguagem em português.
- Desempenho: consultas paginadas e organização de dados para boa performance.
- Confiabilidade: armazenamento consistente das informações de estoque, pedidos e produtos.
- Manutenibilidade: código estruturado e organizado para facilitar evolução futura.

#### Segurança e controle de acesso

- O sistema utilizará autenticação com cadastro, login e recuperação de senha.
- Todos os usuários cadastrados serão tratados como administradores do sistema.
- As rotas protegidas utilizarão middleware de autenticação.
- O acesso às funcionalidades dependerá de o usuário estar autenticado no sistema.

#### Fluxos principais (resumo)

- Cadastro/Login → acesso ao dashboard administrativo.
- Gestão de produtos: cadastrar produto → validar dados → salvar → exibir na listagem.
- Controle de estoque: registrar entrada ou saída → atualizar quantidade → armazenar no histórico.
- Pedido: criar pedido → selecionar produtos → validar disponibilidade → calcular total → confirmar pedido.
- Relatórios: consultar produtos, pedidos e movimentações cadastradas no sistema.

#### Testes e garantia de qualidade

- Testes unitários para regras de negócio e validações principais.
- Testes de integração/feature para fluxos de autenticação, produtos, pedidos e estoque.
- Uso de seeders e factories para geração de dados de teste.

#### Entregáveis e implantação

- Código-fonte versionado em Git.
- README com instruções de instalação e execução do projeto.
- Migrations e Seeders para inicialização do ambiente.
- Documentação básica de uso do sistema.
- Protótipo funcional e versão implementada para apresentação do TCC.

#### Lembretes importantes

- Não expor senhas, chaves ou credenciais no repositório.
- Todas as informações sensíveis devem permanecer no arquivo `.env`.
- Manter organização do código e consistência entre documentação e implementação.
- Registrar corretamente as ações que impactam estoque, pedidos e produtos.

#### Próximos passos sugeridos

- Elaborar o diagrama de classes e o diagrama de sequência.
- Definir o MVP com as telas essenciais do sistema.
- Criar as migrations iniciais de categorias, produtos, pedidos, itens do pedido e movimentações de estoque.
- Implementar primeiro autenticação, produtos, estoque e pedidos.