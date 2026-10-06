# Braseiro do Grajaú - Website Oficial 🔥🥩🍺

Website institucional e interativo do restaurante e bar **Braseiro do Grajaú** — Brasa, Malte e Petiscaria, localizado na esquina da Rua Grajaú com a Rua Canavieiras, Grajaú, Rio de Janeiro - RJ.

---

## 📋 Sumário
- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura de Arquivos](#-estrutura-de-arquivos)
- [Como Executar Localmente](#-como-executar-localmente)
- [Configuração de Contato e WhatsApp](#-configuração-de-contato-e-whatsapp)
- [Otimizações de SEO & Acessibilidade](#-otimizações-de-seo--acessibilidade)
- [Créditos e Autoria](#-créditos-e-autoria)

---

## 🌟 Visão Geral

O projeto foi desenvolvido com foco em alta performance, estética premium e experiência do usuário (UX), destacando os cortes nobres na brasa, chope gelado, petiscos e ambiente acolhedor sob o cartão-postal da Pedra do Grajaú.

### Principais Funcionalidades:
- **Header Fixo Responsivo** com navegação suave e menu mobile.
- **Hero Section Dinâmica** com efeito de brasa incandescente e digitação inteligente (com suporte a acessibilidade).
- **Faixa de Horários e Endereço** com informações rápidas e CEP oficial.
- **Seção de Diferenciais** com background em vídeo de brasa viva.
- **Cardápio Interativo** com carrossel móvel, abas por categoria e **Modal de Cardápio Completo em Tela Cheia** (frente e verso em alta definição).
- **Sistema de Reservas Integrado** com validação de horário e envio formatado direto para o WhatsApp.
- **Galeria de Fotos** com carrossel tátil e lightbox acessível por teclado (`Enter`, `Espaço`, `Esc`).
- **Seção Onde Estamos** com mapa interativo e atalho direto para o perfil oficial no Google Maps.
- **PWA & Favicons:** Manifesto PWA (`site.webmanifest`), ícones em múltiplos tamanhos e suporte a temas mobile.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico:** Marcação acessível (WCAG 2.1), suporte a leitores de tela (`.skip-link`, `.sr-only`, ARIA) e microdados estruturados.
- **CSS3 Puro (Vanilla CSS):**
  - Design System com variáveis CSS (`--color-amber`, `--color-gold`, `--color-wine`, etc.).
  - Layout flexível com CSS Grid e Flexbox.
  - Carregamento paralelo sem encadeamento de `@import` para máxima velocidade.
  - Media query `prefers-reduced-motion` para respeito à saúde vestibular.
- **JavaScript Vanilla (ES6+):**
  - Zero dependências pesadas de terceiros (sem jQuery ou frameworks desnecessários).
  - Observadores assíncronos (`IntersectionObserver`) para animações e scrollspy.
  - Acesso tolerante a falhas ao `localStorage` com `try/catch`.
- **Fontes & Ícones:**
  - Google Fonts (*Playfair Display* e *Outfit*).
  - Font Awesome 6 (com integridade SRI).

---

## 📁 Estrutura de Arquivos

```text
braseiro_do_grajau/
├── assets/                       # Mídias, fotos, vídeos de fundo e capas
│   ├── ambiente_restaurante.jpg
│   ├── brasa_section.mp4
│   ├── cardapio_frente.png
│   ├── cardapio_verso.png
│   ├── chope_gelado.jpg
│   ├── churrasco_picanha.jpg
│   ├── hero_bg.jpg
│   ├── logo_braseiro.png
│   ├── og-cover.jpg              # Imagem para Open Graph / Redes Sociais
│   ├── petiscos_bar.jpg
│   └── sobre_section.mp4
├── css/                          # Folhas de estilo modulares
│   ├── footer.css                # Estilos do rodapé
│   ├── global.css                # Design system, tipografia, resets e acessibilidade
│   ├── navbar.css                # Header e menu mobile
│   └── sections.css              # Seções do site, modais e carrosséis
├── js/
│   └── main.js                   # Lógica interativa, modais, carrossel e reservas
├── apple-touch-icon.png          # Ícone para iOS (180x180)
├── favicon-32.png                # Favicon padrão PNG (32x32)
├── favicon.ico                   # Favicon legado multi-tamanho
├── icon-192.png                  # Ícone PWA (192x192)
├── icon-512.png                  # Ícone PWA (512x512)
├── index.html                    # Página principal do site
├── robots.txt                    # Diretrizes para indexadores e robôs de busca
├── site.webmanifest              # Manifesto PWA para instalação no celular
├── sitemap.xml                   # Mapa do site para o Google Search Console
├── .gitignore                    # Arquivos ignorados pelo Git
└── README.md                     # Documentação do projeto
```

---

## 🚀 Como Executar Localmente

Como o projeto é construído em HTML/CSS/JS nativo, você não precisa compilar nada. Basta utilizar qualquer servidor HTTP estático:

### Opção 1: Python (Recomendado)
```bash
# Na raiz do projeto:
python -m http.server 3000
```
Acesse: [http://localhost:3000](http://localhost:3000)

### Opção 2: Node.js (via npx)
```bash
npx serve . -l 3000
```

### Opção 3: Extensão Live Server (VS Code)
Abra a pasta no VS Code, clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.

---

## 📱 Configuração de Contato e WhatsApp

O número de WhatsApp do estabelecimento está centralizado no atributo `data-wa` da tag `<body>` em `index.html`:

```html
<body data-wa="55219XXXXXXXX">
```

Quando você tiver o número definitivo (com DDI e DDD, ex: `5521998765432`):
1. Altere o valor de `data-wa` no `index.html`.
2. O script [js/main.js](js/main.js) sincroniza automaticamente:
   - O botão flutuante do WhatsApp.
   - O botão de contato no modal do cardápio.
   - O envio da reserva com os dados formatados do formulário.

---

## 🎯 Otimizações de SEO & Acessibilidade

- **Schema JSON-LD (`Restaurant`):** Dados estruturados cadastrados com endereço, CEP (`20561-144`), geolocalização (`-22.9267, -43.2738`), horários semanais e link do perfil oficial do Google: `https://share.google/JRwB02QmCCbRRpLZP`.
- **Open Graph & Twitter Cards:** Visualização rica configurada com imagem dedicada de 1200x630 px.
- **Acessibilidade Completa:** Foco visível em teclado (`:focus-visible`), link de salto de conteúdo (`.skip-link`) e navegação na galeria via teclado (`Enter`/`Espaço`).

---

## 👨‍💻 Créditos e Autoria

- **Cliente:** Braseiro do Grajaú - Brasa, Malte e Petiscaria
- **Desenvolvimento & Tecnologia:** [Garbayo Web & Technology](https://garbayowebtech.com)
- **Ano:** 2026
