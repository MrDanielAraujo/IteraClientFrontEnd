# Como Rodar o Frontend do IteraClient Localmente

Este guia passo a passo ajudará você a configurar e executar o projeto frontend em seu computador, seja ele Windows ou macOS.

## Pré-requisitos

Antes de começar, você precisa ter o **Node.js** instalado. Ele é o ambiente de execução necessário para rodar projetos JavaScript modernos.

1.  Acesse [nodejs.org](https://nodejs.org/).
2.  Baixe a versão **LTS** (Long Term Support), que é a mais estável.
3.  Instale seguindo as instruções padrão do instalador (basta clicar em "Next" até finalizar).

Para verificar se instalou corretamente:
-   Abra seu terminal (Prompt de Comando ou Terminal).
-   Digite `node -v` e aperte Enter. Deve aparecer a versão (ex: `v20.11.0`).

---

## Instruções para Windows

### 1. Preparar o Projeto
1.  Baixe o arquivo do projeto (se baixou via Manus, extraia o arquivo `.zip` para uma pasta de sua preferência, por exemplo: `C:\Projetos\itera-frontend`).

### 2. Abrir o Terminal
1.  Abra a pasta do projeto no Explorador de Arquivos.
2.  Na barra de endereço do topo (onde diz o caminho da pasta), digite `cmd` e aperte **Enter**. Isso abrirá o terminal preto já dentro da pasta correta.
    *   *Alternativa*: Abra o PowerShell ou CMD, e use o comando `cd` para chegar na pasta. Ex: `cd C:\Projetos\itera-frontend`.

### 3. Instalar Dependências
No terminal, digite o seguinte comando e aperte Enter:

```bash
npm install
```

*Isso vai baixar todas as bibliotecas necessárias para o projeto funcionar. Pode levar alguns minutos.*

### 4. Rodar o Projeto
Após a instalação terminar, digite:

```bash
npm run dev
```

Você verá uma mensagem parecida com:
`  ➜  Local:   http://localhost:5173/`

### 5. Acessar
Abra seu navegador (Chrome, Edge, etc.) e digite o endereço mostrado (geralmente `http://localhost:5173`). Pronto! O frontend está rodando.

---

## Instruções para macOS

### 1. Preparar o Projeto
1.  Baixe e extraia o arquivo do projeto para uma pasta (ex: `Downloads/itera-frontend` ou `Documents/itera-frontend`).

### 2. Abrir o Terminal
1.  Pressione `Command + Espaço`, digite **Terminal** e abra o aplicativo.
2.  Navegue até a pasta do projeto usando o comando `cd`.
    *   Dica fácil: Digite `cd ` (com um espaço no final) e arraste a pasta do projeto do Finder para dentro da janela do Terminal. O caminho será preenchido automaticamente.
    *   Aperte **Enter**.

### 3. Instalar Dependências
No terminal, digite e aperte Enter:

```bash
npm install
```

*Aguarde o download das bibliotecas.*

### 4. Rodar o Projeto
Digite e aperte Enter:

```bash
npm run dev
```

Você verá a confirmação de que o servidor iniciou.

### 5. Acessar
Abra seu navegador (Safari, Chrome) e acesse `http://localhost:5173`.

---

## Conectando com sua API C# (.NET)

Por padrão, este frontend está configurado para tentar se comunicar com `http://localhost:5000`.

1.  Certifique-se de que sua API Backend em C# esteja rodando.
2.  Se sua API estiver em uma porta diferente (ex: 7123 ou 5001), você precisa ajustar a configuração no frontend:
    *   Abra o arquivo `client/src/lib/api.ts` em um editor de texto (como VS Code ou Bloco de Notas).
    *   Altere a linha: `const API_BASE_URL = 'http://localhost:5000';` para a porta correta da sua API.
    *   Salve o arquivo. O frontend recarregará automaticamente com a nova configuração.

## Solução de Problemas Comuns

*   **Erro "npm não é reconhecido"**: Você provavelmente não instalou o Node.js ou precisa reiniciar o computador após a instalação.
*   **Erro de Permissão (EACCES) no Mac**: Tente rodar `sudo npm install` e digite sua senha do Mac.
*   **Porta em uso**: Se a porta 5173 estiver ocupada, o Vite usará automaticamente a próxima (5174, 5175, etc.). Olhe no terminal qual endereço ele indicou.

---

## Telas do Sistema

Abaixo você encontra uma visão geral das principais telas do sistema e suas funcionalidades.

### 1. Dashboard
![Dashboard](./docs/images/dashboard.png)

O **Dashboard** é a tela inicial do sistema. Ele oferece uma visão gerencial rápida do processamento de documentos.
*   **Métricas Principais**: Visualize o total de documentos, quantos foram concluídos com sucesso, quantos estão em processamento e se houve erros.
*   **Processamentos Recentes**: Lista os últimos arquivos enviados e seus status atuais.
*   **Status do Sistema**: Monitora a conexão com a API Itera em tempo real, exibindo tempo de resposta e taxa de sucesso.

### 2. Upload de Documentos
![Upload](./docs/images/upload.png)

A tela de **Upload** permite enviar novos documentos para processamento.
*   **Drag & Drop**: Arraste arquivos PDF diretamente para a área pontilhada ou clique para selecionar do seu computador.
*   **Metadados**: Preencha o CNPJ da empresa, a origem do documento e uma descrição opcional antes de enviar.
*   **Envio em Lote**: Suporta o envio de múltiplos arquivos simultaneamente.

### 3. Monitoramento
![Monitoramento](./docs/images/monitoramento.png)

A tela de **Monitoramento** permite acompanhar o status detalhado de cada documento.
*   **Atualização em Tempo Real**: A lista se atualiza automaticamente para refletir mudanças de status (de "Processando" para "Concluído", por exemplo).
*   **Filtros**: Use a barra de busca para encontrar documentos específicos por nome ou CNPJ.
*   **Ações**: Botões rápidos para visualizar detalhes ou baixar os resultados da extração de dados.
