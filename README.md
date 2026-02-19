# ecossistema-si-frontend

**SI -- Sitio Institucional (Frontend)**

Aplicacao frontend do sitio institucional da Embaixada da Republica de Angola na Alemanha. Website publico com tema institucional (vermelho/branco/dourado -- cores da bandeira de Angola) e painel administrativo para gestao de conteudos. Suporta internacionalizacao em 4 idiomas (PT/EN/DE/CS).

Parte do [Ecossistema Digital -- Embaixada de Angola na Alemanha](https://github.com/embaixada-angola-alemanha/ecossistema-project).

---

## Stack Tecnologica

| Camada | Tecnologia |
|---|---|
| Framework | Angular 18.2 |
| Linguagem | TypeScript 5.5 |
| Estilos | SCSS |
| i18n | @ngx-translate/core 16 |
| SSR | @angular/ssr |
| Componentes | Standalone Components |
| Routing | Angular Router (lazy loading) |
| HTTP | Angular HttpClient com proxy |
| Build | @angular/build (Application builder) |
| Containerizacao | Docker (Node 20 + Nginx 1.25 Alpine) |

---

## Estrutura do Projecto

```
src/
  app/
    app.ts                          # Componente raiz
    app.config.ts                   # Configuracao da aplicacao
    app.routes.ts                   # Definicao de rotas (lazy loading)
    core/
      models/
        page.model.ts               # Modelo de paginas CMS
        event.model.ts              # Modelo de eventos
        menu.model.ts               # Modelo de menus
        contact.model.ts            # Modelo de contactos
        api-response.model.ts       # Modelo generico de resposta API
      services/
        api.service.ts              # Servico HTTP base
        page.service.ts             # Servico de paginas
        event.service.ts            # Servico de eventos
        menu.service.ts             # Servico de menus
        contact.service.ts          # Servico de contactos
        institutional.service.ts    # Servico de conteudo institucional
        language.service.ts         # Gestao de idioma activo
        seo.service.ts              # SEO / meta tags
        sitemap.service.ts          # Geracao de sitemap
    pages/
      home/                         # Pagina inicial
      ambassador/                   # Pagina do Embaixador
      about-angola/                 # Sobre Angola (com subseccoes)
      bilateral/                    # Relacoes bilaterais
      consular/                     # Sector consular
      events/                       # Listagem e detalhe de eventos
      contacts/                     # Informacoes de contacto
      not-found/                    # Pagina 404
      _shared-page.scss             # Estilos partilhados entre paginas
    shared/
      components/
        header/                     # Cabecalho com navegacao e selector de idioma
        footer/                     # Rodape com links e contactos
      pipes/
        localized-content.pipe.ts   # Pipe para seleccao de conteudo traduzido
  assets/
    i18n/
      pt.json                       # Traducoes Portugues
      en.json                       # Traducoes Ingles
      de.json                       # Traducoes Alemao
      cs.json                       # Traducoes Checo
  environments/
    environment.ts                  # Ambiente de desenvolvimento
    environment.staging.ts          # Ambiente staging
    environment.prod.ts             # Ambiente producao
  proxy.conf.json                   # Proxy para backend (dev)
  styles.scss                       # Estilos globais
  index.html                        # HTML principal
  main.ts                           # Bootstrap da aplicacao
```

---

## Paginas e Rotas

| Rota | Componente | Descricao |
|---|---|---|
| `/` | Home | Pagina inicial |
| `/embaixador` | Ambassador | Perfil do Embaixador |
| `/sobre-angola` | AboutAngola | Visao geral de Angola |
| `/sobre-angola/:subsection` | AboutAngolaDetail | Subseccoes: presidente, poderes, geografia, historia, demografia, economia, cultura, simbolos |
| `/relacoes-bilaterais` | Bilateral | Relacoes Angola-Alemanha |
| `/sector-consular` | Consular | Servicos consulares |
| `/eventos` | EventsList | Listagem de eventos |
| `/eventos/:id` | EventDetail | Detalhe de um evento |
| `/contactos` | Contacts | Informacoes de contacto |
| `/**` | NotFound | Pagina 404 |

---

## Funcionalidades

### Website Publico
- Visualizacao de paginas institucionais multilingues
- Listagem e detalhe de eventos
- Menu de navegacao dinamico (HEADER/FOOTER)
- Informacoes de contacto da embaixada
- Selector de idioma (PT/EN/DE/CS)
- SEO com meta tags dinamicas
- Design responsivo com tema institucional angolano

### Internacionalizacao (i18n)
- 4 idiomas suportados: Portugues, Ingles, Alemao, Checo
- Conteudo CMS multilingue via API backend
- Interface traduzida via ficheiros JSON (ngx-translate)
- Pipe `localizedContent` para seleccao automatica de traducoes

---

## Pre-requisitos

- Node.js 20+
- npm 10+
- Angular CLI 18 (`npm i -g @angular/cli@18`)
- Backend SI a correr na porta 8082 (para desenvolvimento)

---

## Como Executar

### Desenvolvimento Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desenvolvimento (porta 3002)
npm start
# ou
ng serve --port 3002

# O proxy redireciona /api/v1/* para http://localhost:8082
```

### Build

```bash
# Build de producao
npm run build:prod

# Build de desenvolvimento (watch mode)
npm run watch

# Executar testes
npm test

# Lint
npm run lint
```

### Docker

```bash
# Build da imagem
docker build -t ecossistema-si-frontend .

# Executar container (porta 80)
docker run -p 3002:80 ecossistema-si-frontend
```

A imagem Docker utiliza build multi-stage:
1. **Stage 1**: Node 20 Alpine -- build da aplicacao Angular
2. **Stage 2**: Nginx 1.25 Alpine -- servir ficheiros estaticos com SPA routing

---

## Configuracao de Ambiente

### Ficheiros de Ambiente

| Ficheiro | Utilizacao |
|---|---|
| `environment.ts` | Desenvolvimento local |
| `environment.staging.ts` | Ambiente de staging |
| `environment.prod.ts` | Producao |

### Variaveis de Ambiente

| Variavel | Descricao | Valor Default |
|---|---|---|
| `apiBaseUrl` | Base URL da API publica | `/api/v1/public` |
| `siteName` | Nome do site | `Embaixada de Angola na Alemanha` |
| `defaultLang` | Idioma por defeito | `pt` |
| `supportedLangs` | Idiomas suportados | `['pt', 'en', 'de', 'cs']` |

### Proxy (Desenvolvimento)

Em desenvolvimento, o proxy (`proxy.conf.json`) redireciona chamadas `/api/v1/*` para o backend na porta 8082.

---

## Portas

| Ambiente | Porta |
|---|---|
| Desenvolvimento | 3002 |
| Docker (Nginx) | 80 |
| Backend API | 8082 |

---

## Projecto Principal

Este repositorio faz parte do **Ecossistema Digital -- Embaixada de Angola na Alemanha**.

Repositorio principal: [ecossistema-project](https://github.com/embaixada-angola-alemanha/ecossistema-project)

Dominio: `embaixada-angola.site`
