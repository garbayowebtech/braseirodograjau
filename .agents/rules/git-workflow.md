# Git Workflow & Branching Policy — Braseiro do Grajaú

## 🌳 Fluxo de Branches

```
develop  ───────►  staging  ───────►  main
(Local / Dev)     (Homologação)      (Produção / Hostinger)
```

| Branch | Papel & Ambiente | Como Atualizar |
|---|---|---|
| `develop` | **Desenvolvimento Ativo (Local)** — onde novas seções, ajustes no cardápio e melhorias visuais são testadas. | Commits diários e branches de feature. |
| `staging` | **Validação Online** — ambiente para revisão pelo cliente ou equipe. | **Apenas via MERGE** vindo de `develop`. |
| `main` | **Produção** — código estável conectado à hospedagem Hostinger e domínio oficial. | **Apenas via MERGE** vindo de `staging` (ou `develop`). |

---

## 🤖 Regras Estritas para o Assistente IA (Antigravity)

1. Confirme a branch ativa antes de iniciar qualquer edição.
2. Evite commits diretos na branch `main` sem autorização prévia do usuário.
3. Mensagens de commit no padrão Conventional Commits (`feat:`, `fix:`, `style:`, `docs:`).
