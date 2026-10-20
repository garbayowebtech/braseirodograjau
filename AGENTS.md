# Diretrizes para Agentes de IA — Braseiro do Grajaú

Este repositório contém o código-fonte do website oficial do **Braseiro do Grajaú** — Brasa, Malte e Petiscaria, tradicional restaurante localizado na esquina da Rua Grajaú com a Rua Canavieiras, Grajaú, Rio de Janeiro - RJ.

---

## 🏛️ Arquitetura & Stack Tecnológica

- **Frontend:** HTML5 semântico com suporte estrito a acessibilidade (WCAG 2.1, ARIA, skip-links, navegação por teclado).
- **Estilização:** **Vanilla CSS**. Proibido usar TailwindCSS. Respeite os tokens de design system definidos em `css/global.css` (`--color-amber`, `--color-gold`, `--color-wine`, etc.), `css/navbar.css`, `css/sections.css` e `css/footer.css`.
- **Lógica e Interatividade:** Vanilla JavaScript (ES6+ modular) em `js/main.js` com zero dependências externas pesadas (sem jQuery).
- **Reservas & Contato:** Sistema de reservas integrado com validação de data/horário e redirecionamento formatado para o WhatsApp oficial (`data-wa` no `<body>` de `index.html`).
- **Mídia e Animações:** Suporte nativo a `prefers-reduced-motion`, `IntersectionObserver` para animações fluidas e vídeos de brasa em background.

---

## 📋 Regras Cruciais para Agentes

1. **Consulte as Regras Específicas**:
   - Fluxo de branches e commits: [`.agents/rules/git-workflow.md`](.agents/rules/git-workflow.md)
   - Ciclo de desenvolvimento: [`.agents/rules/workflow.md`](.agents/rules/workflow.md)
   - Mapeamento de interdependência de arquivos: [`.agents/rules/checklist_arquivos.md`](.agents/rules/checklist_arquivos.md)

2. **WhatsApp e Contatos**:
   - O número de WhatsApp é centralizado no atributo `data-wa` da tag `<body>` em `index.html`. Nunca hardcode números de WhatsApp em múltiplos lugares do JS.

3. **Acessibilidade e SEO**:
   - Mantenha sempre o Schema JSON-LD de `Restaurant` atualizado com o CEP `20561-144` e coordenadas do Grajaú.
   - Qualquer imagem adicionada deve conter atributo `alt` descritivo.
