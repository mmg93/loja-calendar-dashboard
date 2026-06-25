# Agenda da Loja — Dashboard de Eventos

Vitrine pública, estática e elegante para exibir os eventos de um **Google Calendar
público** de uma Loja Maçônica. Sem backend, sem banco de dados, sem autenticação:
o navegador consulta a Google Calendar API diretamente com uma **API key pública e
restrita** e atualiza sozinho a cada 60 minutos.

- **URL de produção:** `https://mmg93.github.io/loja-calendar-dashboard/`
- Abre direto na **agenda** (lista cronológica), com visão de **mês** no desktop.
- Janela exibida: **30 dias atrás → 180 dias à frente**, ordenada por data.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **TanStack Query** (React Query) para o polling de 60 min e o botão *Atualizar*
- **date-fns** + **date-fns-tz** para fuso horário e datas
- **lucide-react** para ícones
- Deploy estático em **GitHub Pages** via **GitHub Actions**

> shadcn/ui foi considerado, mas a UI é construída com componentes próprios e
> acessíveis em Tailwind, para manter o bundle pequeno e o visual institucional
> sob controle total.

## Como funciona

1. O visitante abre o dashboard publicado no GitHub Pages.
2. O frontend chama a Google Calendar API (`calendars/{id}/events`) com a API key
   pública restrita — não existe rota `/api/...`, webhook, websocket nem OAuth.
3. Os eventos são normalizados para `{ id, title, start, end, location, description,
   htmlLink, isAllDay }`.
4. A interface mostra resumo (*Hoje*, *Esta semana*, *Próximos*, *Próxima sessão*),
   agenda e calendário mensal.
5. Re-consulta automática a cada **60 min** (`60 * 60 * 1000 = 3.600.000 ms`), além
   do botão manual **Atualizar**.

## Rodando localmente

Pré-requisitos: **Node 20+** e npm.

```bash
npm install
cp .env.example .env.local   # preencha os valores reais
npm run dev                  # http://localhost:5173/loja-calendar-dashboard/
```

Outros comandos:

```bash
npm run lint     # oxlint
npm run build    # checa tipos (tsc -b) e gera dist/
npm run preview  # serve o build local
```

### Configurando `.env.local`

`.env.local` é ignorado pelo git e **nunca deve ser commitado**. Toda variável
`VITE_*` é embutida no JavaScript final e fica **visível no navegador** — por isso a
API key precisa ser tratada como pública e restrita (veja abaixo).

```dotenv
VITE_GOOGLE_API_KEY=AIza...           # key pública restrita
VITE_GOOGLE_CALENDAR_ID=abc123@group.calendar.google.com
VITE_GOOGLE_TIMEZONE=America/Sao_Paulo
```

## Google: API key, restrições e Calendar ID

### 1. Criar uma API key

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/) e crie (ou
   selecione) um projeto.
2. Em **APIs e serviços → Biblioteca**, ative a **Google Calendar API**.
3. Em **APIs e serviços → Credenciais → Criar credenciais → Chave de API**.

### 2. Restringir por domínio (Application restrictions)

Na key, em **Restrições de aplicativo**, escolha **Sites** / **HTTP referrers** e
permita apenas seus domínios:

```
https://mmg93.github.io/*
https://mmg93.github.io/loja-calendar-dashboard/*
# se usar domínio próprio:
https://seudominio.com/*
https://www.seudominio.com/*
```

> Não use restrição por **IP** — as chamadas partem dos navegadores dos visitantes.

### 3. Restringir por API (API restrictions)

Em **Restrições de API**, escolha **Restringir chave** e selecione **somente** a
**Google Calendar API**.

### 4. Duas keys (recomendado)

- **Desenvolvimento** — referrers restritos a `http://localhost:5173/*` e
  `http://127.0.0.1:5173/*`.
- **Produção** — referrers restritos ao GitHub Pages (e ao domínio próprio).
  **Remova `localhost` da key de produção.**

### 5. Encontrar o Calendar ID

Google Agenda → engrenagem **Configurações** → selecione a agenda → seção
**Integrar agenda** → copie o **ID da agenda** (algo como
`...@group.calendar.google.com`, ou o e-mail `@gmail.com` da agenda principal).

### 6. Tornar a agenda pública

Google Agenda → **Configurações** da agenda → **Permissões de acesso a eventos** →
marque **Tornar disponível ao público** e mantenha **Ver todos os detalhes do
evento**. Sem isso, a API responde 404/403 para a key pública.

## Deploy no GitHub Pages (via GitHub Actions)

O workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) faz
build e publica a cada push na branch `main`.

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Settings → Secrets and variables → Actions:**
   - **Secrets** → `VITE_GOOGLE_API_KEY` (a key **de produção**, restrita).
   - **Variables** → `VITE_GOOGLE_CALENDAR_ID` e `VITE_GOOGLE_TIMEZONE`.
3. Faça push para `main`. A aba **Actions** mostra build/deploy; ao final a URL fica
   em **Settings → Pages**.

O job roda `npm ci`, `npm run lint`, `npm run build` e publica `dist/` com
`upload-pages-artifact` + `deploy-pages`.

### Ajustando o `base` do Vite

O Vite precisa saber o subcaminho do GitHub Pages. Em
[`vite.config.ts`](vite.config.ts):

```ts
base: '/loja-calendar-dashboard/',
```

- Renomeou o repositório? Troque para `'/NOVO_NOME/'` (mantenha as barras).
- Usa domínio próprio ou página `usuario.github.io` na raiz? Use `base: '/'`.

## Segurança

- Apenas **API key pública** + **Calendar ID público**. Nada de OAuth, client
  secret, refresh token ou service account.
- A API key **não** pode ficar irrestrita em produção — restrinja por referrer e por
  API (Calendar apenas).
- `.gitignore` bloqueia `.env`, `.env.local`, `.env.*` (exceto `.env.example`),
  além de `*.pem`, `*.key` e JSONs de credenciais/service account.
- Mesmo restrita, a key é visível no navegador — isso é esperado e seguro para uma
  agenda pública.

## Estrutura

```
src/
  lib/        config, tipos, cliente da Calendar API, utilidades de data/fuso
  hooks/      useCalendarEvents (React Query + polling de 60 min)
  components/ Header, SummaryCards, AgendaView, MonthView, EventCard, estados, ui/
  App.tsx     orquestra estados (loading / erro / vazio / conteúdo)
```
