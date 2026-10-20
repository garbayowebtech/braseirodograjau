# Workflow de Desenvolvimento — Braseiro do Grajaú

Este documento define o fluxo de trabalho oficial para manutenção e novidades no site do **Braseiro do Grajaú**.

---

## 1. Princípios de Engenharia
- **Zero Frameworks:** HTML5 + Vanilla CSS + Vanilla JS.
- **Acessibilidade em Primeiro Lugar:** Todos os modais devem prender o foco (`tab`), fechar com `Escape` e suportar navegação por teclado.
- **WhatsApp Centralizado:** Disparos de contato sempre utilizam o número parametrizado em `document.body.dataset.wa`.

## 2. Passos de Desenvolvimento
1. Consultar [checklist_arquivos.md](checklist_arquivos.md) antes de iniciar qualquer ajuste.
2. Implementar respeitando a paleta e tipografia oficial (*Playfair Display* e *Outfit*).
3. Testar em resoluções mobile (< 768px) e desktop (> 1200px).
4. Validar que nenhum erro de console é emitido.
