# Checklist de Arquivos Obrigatórios por Cenário — Braseiro do Grajaú

---

## 🥩 Cenário 1: Novo Prato ou Atualização do Cardápio
- `index.html`: Atualizar o item (`<li class="menu-item">`) dentro do grupo da categoria correspondente na seção `#cardapio` (nome, preço e descrição). O cardápio é **somente texto** — não adicionar imagens.
- `assets/cardapio/`: PDFs oficiais do cardápio (fonte dos itens e preços). Ao receber novos PDFs, conferir os valores da seção `#cardapio` contra eles.

## 📅 Cenário 2: Sistema de Reservas
- `index.html`: Campos do formulário `#reservaForm`.
- `js/main.js`: Função de formatação da mensagem que constrói a URL `https://wa.me/...`.
- `document.body.dataset.wa`: Garantir que o DDI + DDD está correto.

## 🎨 Cenário 3: Alterações Visuais e Estilos
- Respeitar os arquivos modulares:
  - `css/global.css`: Tokens de cor e tipografia.
  - `css/navbar.css`: Header e menu lateral mobile.
  - `css/sections.css`: Seções de conteúdo, modais e carrosséis.
  - `css/footer.css`: Rodapé e horários de funcionamento.
