# BookTrack - Frontend

BookTrack é uma aplicação para gerenciar sua biblioteca pessoal, permitindo que você acompanhe seus livros, status de leitura e avaliações.

## 🚀 Tecnologias

- React
- TypeScript
- Material-UI
- Axios
- React Router DOM

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Backend do BookTrack rodando (verifique o repositório do backend)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/gaba23/booktrack-frontend
cd booktrack/front
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure o arquivo de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
REACT_APP_API_URL=http://localhost:3001
```

## 🚀 Executando o projeto

1. Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
yarn start
```

2. Acesse a aplicação em `http://localhost:3000`

2.1 Caso deseje rodar o back localmente, alterar o endereço do back para local em src/config/aps.ts

## 📝 Funcionalidades

- Autenticação de usuários (login/registro)
- Adicionar novos livros
- Editar informações dos livros
- Excluir livros
- Gerenciar status de leitura (Quero Ler, Lendo, Lido)
- Avaliar livros lidos
- Excluir conta

## 🔄 Rotas da API

### Autenticação
- POST `/auth/login` - Login
- POST `/auth/register` - Registro
- DELETE `/users/deletar/:id` - Excluir conta

### Livros
- GET `/livros/meus-livros` - Listar livros
- POST `/livros/adicionar` - Adicionar livro
- PUT `/livros/editar/:id` - Editar livro
- DELETE `/livros/excluir/:id` - Excluir livro

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
