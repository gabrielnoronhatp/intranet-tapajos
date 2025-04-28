# Projeto Intranet Tapajós

Este projeto é uma aplicação web moderna desenvolvida com **Next.js**, **Redux**, **TypeScript** e outras tecnologias de ponta, destinada a gerenciar diferentes aspectos de uma intranet corporativa. A aplicação é organizada em várias seções, cada uma responsável por uma funcionalidade específica, e utiliza uma estrutura de pastas bem definida para facilitar a manutenção e escalabilidade.

---

## Estrutura do Projeto

### Diretórios Principais

1. **`.next/`**  
   Diretório gerado automaticamente pelo Next.js durante o build. Contém arquivos de build e cache.

2. **`.git/`**  
   Diretório de controle de versão do Git. Armazena o histórico de commits e configurações do repositório.

3. **`node_modules/`**  
   Contém todas as dependências do projeto instaladas via npm.

4. **`types/`**  
   Contém definições de tipos TypeScript para o projeto, garantindo tipagem correta e maior segurança no desenvolvimento.

5. **`hooks/`**  
   Armazena hooks personalizados, incluindo slices do Redux para gerenciamento de estado.

6. **`components/`**  
   Contém componentes React reutilizáveis, organizados por funcionalidade ou seção da aplicação.

7. **`app/`**  
   Diretório principal para páginas e rotas do Next.js. Cada subpasta ou arquivo representa uma rota.

8. **`lib/`**  
   Contém funções utilitárias ou bibliotecas personalizadas usadas em todo o projeto.

9. **`.bolt/`**  
   Diretório específico para configurações ou ferramentas personalizadas utilizadas no projeto.

---

## Tecnologias e Ferramentas

### Stacks Utilizadas

1. **Ant Design (antd)**  
   Biblioteca de componentes UI que fornece uma ampla gama de componentes prontos para uso, como botões, formulários e tabelas. Facilita a criação de interfaces de usuário consistentes e responsivas.

2. **Next.js**  
   Framework React para desenvolvimento de aplicações web. Oferece renderização do lado do servidor, geração de páginas estáticas e um sistema de rotas poderoso. Ideal para SEO e desempenho.

3. **Redux**  
   Biblioteca para gerenciamento de estado global. Utiliza slices para organizar o estado em diferentes partes da aplicação, facilitando a manutenção e escalabilidade.

4. **Tailwind CSS**  
   Framework CSS utilitário que permite criar designs personalizados rapidamente. Usa classes utilitárias para aplicar estilos diretamente nos componentes.

### Ferramentas de Desenvolvimento

1. **Prettier**  
   Ferramenta de formatação de código que garante um estilo consistente em todo o projeto. Configurado via `.prettierrc`.

2. **ESLint**  
   Ferramenta de linting para identificar e corrigir problemas no código JavaScript/TypeScript. Configurado via `.eslintrc.json`, ajuda a manter a qualidade do código e a aderência a padrões de codificação.

---

## Funcionalidades do Projeto

### Aplicações

1. **@vacancies**

    - **Descrição**: Gerencia as vagas de emprego dentro da empresa, permitindo a criação, edição e exclusão de vagas, além de listar candidatos.
    - **Melhorias Sugeridas**:
        - Implementar paginação para listas de vagas e candidatos.
        - Melhorar a interface de usuário para facilitar a navegação e busca de vagas.

2. **@trade**

    - **Descrição**: Gerencia campanhas de vendas, incluindo a criação, edição e exclusão de campanhas, além de gerenciar participantes e itens associados.
    - **Melhorias Sugeridas**:
        - Adicionar relatórios de desempenho das campanhas.
        - Implementar notificações para atualizações de status das campanhas.

3. **@noPaper**
    - **Descrição**: Gerencia ordens de pagamento e fornecedores, permitindo o upload de documentos e a gestão de contas gerenciais.
    - **Melhorias Sugeridas**:
        - Melhorar a segurança no upload de arquivos.
        - Implementar logs de auditoria para ações críticas.

---

### Slices do Redux

1. **@vacancySlice.ts**

    - **Função**: Gerencia o estado das vagas de emprego, incluindo operações assíncronas para buscar, criar, atualizar e deletar vagas.
    - **Melhorias Sugeridas**:
        - Adicionar tratamento de erros mais robusto.
        - Implementar caching para reduzir chamadas desnecessárias à API.

2. **@tradeSlice.ts**

    - **Função**: Gerencia o estado das campanhas de vendas, incluindo operações para buscar, criar, atualizar e deletar campanhas, participantes e itens.
    - **Melhorias Sugeridas**:
        - Melhorar a eficiência das operações de atualização em massa.
        - Adicionar suporte para múltiplos idiomas.

3. **@authSlice.ts**

    - **Função**: Gerencia o estado de autenticação do usuário, incluindo login, logout e persistência de sessão.
    - **Melhorias Sugeridas**:
        - Implementar autenticação multifator.
        - Melhorar a segurança do armazenamento de tokens.

4. **@noPaperSlice.ts**

    - **Função**: Gerencia o estado relacionado a fornecedores e ordens de pagamento, incluindo operações para buscar dados de fornecedores e gerenciar uploads de arquivos.
    - **Melhorias Sugeridas**:
        - Implementar validação de dados mais rigorosa.
        - Melhorar a interface de usuário para a gestão de fornecedores.

5. **@orderSlice.ts**
    - **Função**: Gerencia o estado das ordens de pagamento, incluindo operações para submeter e cancelar ordens.
    - **Melhorias Sugeridas**:
        - Adicionar histórico de alterações para ordens.
        - Implementar notificações para mudanças de status.

---

## Como Executar o Projeto

1. **Instalação**

    - Certifique-se de ter o Node.js instalado.
    - Execute `npm install` para instalar as dependências.

2. **Execução**

    - Use `npm run dev` para iniciar o servidor de desenvolvimento.
    - Acesse `http://localhost:3000` no seu navegador.

3. **Build**
    - Execute `npm run build` para criar uma versão de produção.
    - Use `npm start` para iniciar o servidor de produção.

---

## Considerações Finais

Este projeto é uma base sólida para uma intranet corporativa, utilizando tecnologias modernas e uma estrutura bem organizada. No entanto, há espaço para melhorias em termos de segurança, eficiência e experiência do usuário. A implementação das melhorias sugeridas pode aumentar significativamente a robustez e a usabilidade da aplicação.
