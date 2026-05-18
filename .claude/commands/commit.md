---
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*)
description: Cria commits seguindo Conventional Commits — analisa mudanças, agrupa por assunto, apresenta plano e aguarda confirmação antes de commitar
---

## Contexto

- Status atual do git: !`git status --short`
- Branch atual: !`git branch --show-current`
- Últimos commits: !`git log --oneline -10`
- Diff completo (staged + unstaged): !`git diff HEAD`
- Arquivos não rastreados: !`git ls-files --others --exclude-standard`

## Sua tarefa

Analise as mudanças acima e execute o fluxo abaixo **na ordem exata**, sem pular etapas.

---

### Passo 1 — Analise e agrupe as mudanças

Examine cada arquivo modificado/criado/deletado e identifique o **assunto** de cada mudança (ex.: autenticação, repositórios, casos de uso, testes, configuração, documentação).

Regras de agrupamento:

- Arquivos relacionados ao mesmo domínio ou funcionalidade devem ir no mesmo commit.
- Nunca misture tipos radicalmente diferentes no mesmo commit (ex.: feat + chore).
- Se um arquivo aparece em múltiplos assuntos, coloque-o no commit mais relevante.
- Arquivos de teste devem preferencialmente acompanhar o arquivo que testam no mesmo commit.

---

### Passo 2 — Monte o plano de commits

Para cada grupo, defina uma mensagem seguindo o padrão **Conventional Commits**:

```
<type>(<scope>): <descrição curta em português>
```

**Tipos válidos:**
| Tipo | Quando usar |
|------|-------------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `refactor` | Refatoração sem mudar comportamento |
| `test` | Adição ou correção de testes |
| `docs` | Documentação |
| `chore` | Configuração, dependências, ferramentas |
| `style` | Formatação, sem mudança de lógica |
| `perf` | Melhoria de performance |
| `ci` | Mudanças em CI/CD |
| `build` | Build system ou dependências externas |

**Scope** (opcional): nome curto do módulo/domínio (ex.: `auth`, `check-in`, `gym`, `user`).

**Apresente o plano neste formato exato:**

```
PLANO DE COMMITS
================

Commit 1: feat(check-in): adicionar repositório de histórico de check-ins
  Arquivos:
    + src/repositories/check-ins-repository.ts
    + src/repositories/in-memory/in-memory-check-ins-repository.ts

Commit 2: test(check-in): adicionar testes para histórico e métricas de check-ins
  Arquivos:
    + src/use-cases/fetch-user-check-ins-history.spec.ts

...
```

Use `+` para arquivo novo, `M` para modificado, `D` para deletado.

---

### Passo 3 — Aguarde confirmação

**PARE AQUI.** Use a ferramenta `AskUserQuestion` com:

- Pergunta: "O plano acima está correto? Posso prosseguir com os commits?"
- Opções: "Sim, pode commitar", "Quero ajustar o plano"

Se o usuário responder que quer ajustar, peça os detalhes e refaça o plano antes de continuar.

---

### Passo 4 — Execute os commits (somente após confirmação)

Para cada commit do plano aprovado, em ordem:

1. `git add` apenas nos arquivos daquele commit (nunca use `git add .` ou `git add -A`).
2. `git commit -m "mensagem"` usando HEREDOC para mensagens com escapes.

Confirme que cada `git add` e `git commit` foi bem-sucedido antes de passar para o próximo.

---

### Passo 5 — Pergunte sobre o push

Após todos os commits, use `AskUserQuestion` novamente:

- Pergunta: "Commits criados com sucesso! Deseja fazer push agora?"
- Opções: "Sim, fazer push", "Não, farei depois"

Se o usuário confirmar o push, execute `git push` (ou `git push -u origin <branch>` se a branch ainda não tem upstream).

Exiba o resultado final com os commits criados e, se aplicável, o resultado do push.
