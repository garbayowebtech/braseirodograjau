# Checklist de Arquivos Obrigatórios por Cenário — Braseiro do Grajaú

---

## 🥩 Cenário 1: Novo Prato ou Atualização do Cardápio
- `index.html`: Atualizar o card dentro da seção `#cardapio` (nome, descrição, preço e tags).
- `assets/`: Adicionar imagem otimizada em WebP/JPG (manter proporção padrão).
- `assets/cardapio_frente.png` e `assets/cardapio_verso.png`: Caso o menu impresso em modal HD seja alterado, atualizar as duas pranchas em alta resolução.

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
