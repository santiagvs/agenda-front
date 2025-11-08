# Agenda (Front-end)

Aplicação web (Vue 3 + Vite + TypeScript) para gerenciar contatos com autenticação, paginação e busca server-side.

__Link do vídeo da apresentação do teste: https://youtu.be/BsesJC2BuJg__

Stack:
- Vue 3, Vite, TypeScript
- Pinia (estado), Vue Router
- Axios (HTTP)
- @vueuse/core (utils), Phosphor Icons

## Requisitos
- Node.js 20+ (recomendado) e npm
- API rodando

## Configuração
1) Instalar dependências: `npm install`

2) Variáveis de ambiente:
- Crie um arquivo .env na raiz:
  `VITE_API_URL="https://api.exemplo.com"`

3) Desenvolvimento:
- `npm run dev`
- abra http://localhost:5173 (ou outra porta disponibilizada pelo Vite)

4) Build e preview:
- `npm run build`
- `npm run preview`

## Estrutura
- src/
  - components/: AppInput (validações), AppHeader, ContactForm, Modal, Paginator, SwipeReveal (gesto de swipe), Brand (logo)
  - views/: Login, Register, Dashboard
  - stores/: auth, contact
  - services/: api (axios + Bearer), contact-service
  - router/: index (rotas e guards)
  - utils/: mask-phone, is-email-valid, unwrap
  - styles/: estilos dos itens e botões

## Funcionalidades
- Autenticação:
  - Login/Registro com validação de e-mail e senha (mín. 8 caracteres, letra e número; confirmação).
  - JWT armazenado em localStorage (jwt_token).
  - Interceptor do Axios envia Authorization: Bearer ${token}.

- Contatos:
  - Listagem com paginação server-side (5 itens/página), ordenação pelo backend.
  - Busca server-side via parâmetro `q` (nome, e-mail e dígitos do telefone).
  - Cache por página no cliente (evita refetch ao voltar páginas já vistas).
  - CRUD com upload de foto (FormData).

- Validações e máscara:
  - Telefone com máscara dinâmica: (99) 99999-9999.
  - E-mail com validação robusta (regex) em AppInput.
  - AppInput unifica validações para text/email/phone.

- UI/UX:
  - SwipeReveal: em mobile, arraste para esquerda para revelar ações (editar/excluir).
  - Hover (desktop): revela ações ao passar o mouse.
  - Brand com ícone PhAddressBook e fonte serifada (Palatino).
  - Paginator simples com janelas de páginas.

- Rotas:
  - “/” redireciona para “/login”.
  - /login e /register exigem guest; /dashboard exige autenticação.
  - Fallback de rotas inválidas para /login.

## Fluxo de dados (contatos)
- Store chama contact-service.fetchAll({ page, per_page, q }).
- Backend retorna:
 ```ts
  {
    success: boolean,
    data: Contact[],
    meta: { current_page, per_page, total, last_page, ... },
    links: { ... }
  }
  ```
- Store indexa contatos (byId), guarda IDs por página (pageCache[page]) na ordem recebida, e expõe list da página atual.

## Scripts
- `npm run dev` — modo desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — servidor de preview do build
