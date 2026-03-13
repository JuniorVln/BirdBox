# Auditoria de Código — BirdBox

> Data: 25 fev 2026
> Revisor: Claude Code
> Escopo: Bugs/i18n · Qualidade de código · UX/Features · Arquivos desnecessários
> Status: Relatório (sem alterações no código)

---

## Resumo Executivo

O projeto está em estágio de MVP funcional com arquitetura sólida (React + Vite + Supabase + Deno Edge Functions). O core do produto está implementado, mas existem problemas acumulados de type safety, i18n incompleto e ausência de error boundaries que podem gerar crashes silenciosos e experiência inconsistente para o usuário.

| Área | Score | Issues |
|---|---|---|
| Bugs / i18n | 7/10 | 1 crítico, 3 médios |
| Qualidade de código | 5/10 | 3 altos, 3 médios |
| UX / Features | 6/10 | 5 itens incompletos |
| Arquivos desnecessários | 8/10 | 3 itens |
| **Segurança** | **4/10** | **1 crítico (ver seção 5)** |

**Total de issues: 16** (1 crítico · 5 altos · 6 médios · 4 baixos)

---

## 1. Bugs & i18n

### CRÍTICO

#### [BUG-01] `alert()` nativo bloqueando a UI
- **Arquivo:** [src/pages/ProspectDetailPage.tsx](src/pages/ProspectDetailPage.tsx#L42)
- **Linha:** 42
- **Código atual:**
  ```tsx
  alert(t.prospectDetail.noWebsiteAlert)
  ```
- **Problema:** `window.alert()` bloqueia a thread principal do browser, é modal nativo sem estilo, e não segue o design system. Em alguns browsers mobile pode se comportar de forma inesperada.
- **Correção sugerida:** Substituir por `useToast()` — o componente `<Toaster />` já está registrado em `App.tsx:62`.

---

### ALTO

#### [BUG-02] String "Criar Pitch" hardcoded em PT-BR
- **Arquivo:** [src/pages/ProspectDetailPage.tsx](src/pages/ProspectDetailPage.tsx#L102)
- **Linha:** 102
- **Código atual:**
  ```tsx
  Criar Pitch
  ```
- **Problema:** Usuários em modo EN veem texto em português. O sistema i18n já tem chaves para pitches (`t.pitches.*`), basta usar a chave adequada.
- **Correção sugerida:** Verificar se existe `t.pitches.createPitch` em `i18n.ts` ou adicionar a chave e usar `{t.pitches.createPitch}`.

---

### MÉDIO

#### [BUG-03] `formatRelativeTime` com strings em inglês fixas
- **Arquivo:** [src/lib/utils.ts](src/lib/utils.ts#L26-L29)
- **Linhas:** 26–29
- **Código atual:**
  ```ts
  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24)   return `${hours}h ago`
  if (days < 7)     return `${days}d ago`
  ```
- **Problema:** Mais grave que o `formatDate` abaixo — retorna texto em inglês literalmente para usuários PT-BR. "há 3 dias" se torna "3d ago".
- **Correção sugerida:** Receber o locale como parâmetro ou usar `Intl.RelativeTimeFormat` com o locale do `useI18n`.

#### [BUG-04] `formatDate` com locale fixo `en-US`
- **Arquivo:** [src/lib/utils.ts](src/lib/utils.ts#L9)
- **Linha:** 9
- **Código atual:**
  ```ts
  return new Intl.DateTimeFormat('en-US', { ... }).format(new Date(date))
  ```
- **Problema:** Datas aparecem no formato americano (Jan 5, 2026) para usuários PT-BR; deveriam aparecer no formato (5 de jan. de 2026).
- **Correção sugerida:** Parametrizar o locale ou buscar do store de i18n.

---

### BAIXO

#### [BUG-05] Erros de API retornados como string bruta (sem i18n)
- **Arquivo:** [src/hooks/useSearchLeads.ts](src/hooks/useSearchLeads.ts)
- **Problema:** Mensagens de erro vindas das edge functions (ex: `"Google Places API error: 503"`) são exibidas diretamente ao usuário sem tradução ou formatação amigável.
- **Correção sugerida:** Mapear códigos de erro para chaves i18n com fallback genérico.

---

## 2. Qualidade de Código

### ALTO

#### [QC-01] Ausência de Error Boundaries
- **Arquivo:** [src/App.tsx](src/App.tsx)
- **Problema:** O `App.tsx` não possui nenhum `<ErrorBoundary>` wrapping as rotas ou o layout. Qualquer exception não tratada em render derruba toda a árvore de componentes — o usuário vê uma tela em branco sem mensagem de erro.
- **Impacto:** Crashes silenciosos impossíveis de debugar em produção.
- **Correção sugerida:** Adicionar `<ErrorBoundary fallback={<ErrorPage />}>` ao redor do `<Routes>` em `App.tsx`. React 19 suporta error boundaries com hooks.

#### [QC-02] Casts `as any` e `as unknown as T` em `useLeads.ts`
- **Arquivo:** [src/hooks/useLeads.ts](src/hooks/useLeads.ts)
- **Linhas afetadas:** 19, 46, 47, 52, 75, 78
- **Exemplos:**
  ```ts
  // L19: conversão forçada do retorno da query
  return data as unknown as Lead[]

  // L46-47: bypass no insert
  ...(input as any),
  } as any)

  // L75: spread com any
  ...(leadRes.data as any),

  // L78: tipo de retorno composto com any[]
  } as Lead & { decision_makers: any[], intelligence: any }
  ```
- **Problema:** Esses casts existem porque os tipos gerados pelo Supabase (`database.types.ts`) não estão totalmente alinhados com as interfaces de domínio (`src/types/index.ts`). Contornar com `any` esconde potenciais erros de runtime e invalida o TypeScript.
- **Raiz do problema:** As interfaces em `src/types/index.ts` (ex: `Lead`) divergem dos tipos gerados em `src/types/database.ts`. As colunas adicionadas nas migrações mais recentes (enriquecimento, tech_stack, etc.) podem não estar refletidas.
- **Correção sugerida:** Regenerar os tipos do Supabase via `supabase gen types` e alinhar as interfaces de domínio com os tipos gerados, eliminando os casts.

#### [QC-03] `@ts-expect-error` e `as any` recorrentes em `useAudits.ts`
- **Arquivo:** [src/hooks/useAudits.ts](src/hooks/useAudits.ts)
- **Linhas afetadas:** 63, 65, 108, 117–120, 122, 125, 128, 132
- **Exemplos:**
  ```ts
  // L108: supress explícito de erro TypeScript
  // @ts-expect-error Supabase types mismatch
  .update({ ... } as any)

  // L132: cast do client inteiro para any
  await (supabase as any).from('audits').update(...)
  ```
- **Problema:** Mesmo que a tabela `audits` exista no banco e na migração, os tipos gerados não a reconhecem — forçando um `(supabase as any)` para acessá-la. Isso sugere que os tipos gerados estão **desatualizados**.
- **Correção sugerida:** `supabase gen types typescript --project-id <id> > src/types/database.ts` para incluir a tabela `audits`.

---

### MÉDIO

#### [QC-04] Sem retry logic nos hooks de mutação
- **Arquivos:** todos os hooks em [src/hooks/](src/hooks/)
- **Problema:** Chamadas às edge functions (enriquecimento, geração de inteligência, auditoria) não têm retry automático. Uma falha de rede transitória resulta em erro permanente para o usuário, que precisa acionar manualmente de novo.
- **Correção sugerida:** Configurar `retry: 2` nas mutations do React Query ou adicionar lógica de retry com exponential backoff para chamadas de edge functions.

#### [QC-05] Zero cobertura de testes
- **Escopo:** Todo o projeto
- **Problema:** Nenhum arquivo de teste foi encontrado (`.test.ts`, `.spec.ts`, `__tests__/`). Sem testes, refatorações e novas features podem introduzir regressões invisíveis.
- **Prioridade para testar:**
  1. `useEnrichLead` — fluxo crítico de negócio
  2. `useRunAudit` — dupla chamada Supabase + edge function com estados complexos
  3. Edge function `search-leads` — lógica de mapeamento dos resultados do Google Places
- **Ferramentas sugeridas:** Vitest (frontend) + Deno test (edge functions)

#### [QC-06] `as any` em tabs de navegação (ProspectDetailPage)
- **Arquivo:** [src/pages/ProspectDetailPage.tsx](src/pages/ProspectDetailPage.tsx#L145)
- **Linha:** 145
- **Código atual:**
  ```tsx
  onClick={() => setActiveTab(tab.id as any)}
  ```
- **Problema:** O tipo de `tab.id` (`string`) não é assignável ao union type `'overview' | 'network' | 'tech' | 'intelligence'` diretamente porque o array `tabs` é inferido como `string[]`. Correção simples com tipagem correta do array.
- **Correção sugerida:** Tipar o array de tabs com o union type explícito.

---

### BAIXO

#### [QC-07] CORS `'*'` em todas as edge functions
- **Arquivo:** [supabase/functions/search-leads/index.ts](supabase/functions/search-leads/index.ts#L4)
- **Linhas:** 3–7 (padrão repetido em todas as funções)
- **Código atual:**
  ```ts
  'Access-Control-Allow-Origin': '*',
  ```
- **Problema:** Permite que qualquer origem faça chamadas às edge functions. Em produção, deveria ser restrito ao domínio da aplicação.
- **Nota:** Em desenvolvimento/staging isso é aceitável. Para produção, substituir `'*'` pelo domínio real.

---

## 3. UX / Features Incompletas

#### [UX-01] Página Analytics inexistente
- **Rota:** `/dashboard/analytics`
- **Arquivo:** [src/App.tsx](src/App.tsx#L51)
- **Situação:** Rota existe e renderiza `<ComingSoon title="Analytics" />`. A opção está desabilitada na sidebar (`enabled: false`).
- **Impacto:** Feature prometida no produto (landing page menciona analytics) mas sem implementação.
- **Métricas sugeridas no TODO.md:** leads por status, taxa de conversão (searches → saved → enriched), audits rodadas, pitches abertos.

#### [UX-02] Timeout de 150s sem feedback adequado no search
- **Arquivo:** [src/hooks/useSearchLeads.ts](src/hooks/useSearchLeads.ts)
- **Situação:** O TODO.md documenta **6+ instâncias de erro 546 (timeout)** na última semana. A função aguarda o actor Apify terminar de forma síncrona por até 150 segundos.
- **Impacto no usuário:** Spinner girando por 2.5 minutos, depois erro genérico. Zero feedback de progresso.
- **Correção arquitetural sugerida:** Retornar um `runId` imediatamente e fazer polling no frontend com progresso visual, ou usar webhooks do Apify.

#### [UX-03] Erros de mutação sem feedback visual (toast)
- **Arquivos:** hooks de mutação em geral (`useEnrichLead`, `useRunAudit`, `useGeneratePitch`)
- **Situação:** Os hooks setam estado de erro interno mas não disparam notificações. O `<Toaster />` já está disponível em `App.tsx`, basta chamar `useToast()` nos callbacks `onError`.
- **Impacto:** O usuário clica em "Enriquecer" e nada acontece visivelmente se houver erro na edge function.

#### [UX-04] Configurações de Email sem UI
- **Tabela:** `email_settings` (existe no banco com campos OAuth, warmup, etc.)
- **Situação:** A infraestrutura de banco existe, mas a UI de configuração de email em `SettingsPage.tsx` não foi implementada.
- **Impacto:** Integração Gmail/warmup não configurável pelo usuário.

#### [UX-05] Decisão arquitetural pendente: Pitches vs Prospects
- **Arquivo:** [TODO.md](TODO.md#L56-L59)
- **Situação:** Dois fluxos coexistem sem decisão clara:
  - `/dashboard/pitches/*` — fluxo original de geração de HTML com IA
  - `/dashboard/prospects/*` — novo fluxo de pipeline de leads
- **Nota no TODO.md:** "Decidir: manter separado, integrar, ou deprecar"
- **Impacto:** Risco de confusão para novos desenvolvedores e para o usuário se ambos ficarem acessíveis.

---

## 4. Arquivos Desnecessários / Tech Debt

#### [ARQ-01] `src/lib/mockData.ts` — dados de teste em produção
- **Arquivo:** [src/lib/mockData.ts](src/lib/mockData.ts)
- **Conteúdo:** Dados fictícios de 4 negócios (barbearia, restaurante, dentista, academia) usados para desenvolvimento local e testes de templates de pitch.
- **Problema:** Arquivo de mock no bundle de produção. Se importado acidentalmente em contexto errado, pode poluir dados reais.
- **Ação sugerida:** Mover para `src/__fixtures__/mockData.ts` ou para um diretório de testes. Adicionar ao `.gitignore` se contiver dados sensíveis.

#### [ARQ-02] `README.md` — conteúdo de template Vite
- **Arquivo:** [README.md](README.md)
- **Conteúdo atual:** README genérico do template Vite + React, sem qualquer documentação do projeto BirdBox.
- **Ação sugerida:** Substituir com documentação real: setup local, variáveis de ambiente necessárias, comandos de desenvolvimento, arquitetura de alto nível.

#### [ARQ-03] Imports acumulados não utilizados (a verificar)
- **Situação:** O `ProspectDetailPage.tsx` importa `Loader2` e `FileText` do Lucide que são usados, mas o arquivo tem 377 linhas com densidade alta. Vale rodar `eslint --fix` para verificar imports mortos.
- **Ação sugerida:** `npm run lint` ou `npx eslint src/ --ext .tsx,.ts` para listar unused imports.

---

## 5. Segurança (referência)

> Estes itens não foram o foco principal da auditoria mas merecem atenção antes de ir a produção.

#### [SEC-01] CRÍTICO — API key do Google exposta no source code
- **Arquivo:** [supabase/functions/search-leads/index.ts](supabase/functions/search-leads/index.ts#L11)
- **Linha:** 11
- **Código atual (CORRIGIDO):**
  ```ts
  const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')
  ```
- **Problema:** Uma chave de API real estava hardcoded como fallback. A key foi removida do código e deve ser configurada apenas via Supabase Secrets.
- **Ações necessárias:**
  1. Revogar imediatamente a chave exposta no Google Cloud Console
  2. Gerar nova chave e configurar apenas como secret no Supabase Dashboard
  3. Remover o fallback hardcoded — a função deve falhar com erro claro se a secret não estiver configurada
  4. Considerar `git filter-branch` ou BFG Repo-Cleaner para remover do histórico

#### [SEC-02] Sem rate limiting nas edge functions
- **Problema:** Um usuário autenticado pode fazer centenas de chamadas a `search-leads` consecutivamente, gerando custos na Google Places API e Apify sem limite.
- **Sugestão:** Implementar rate limiting por `user_id` na camada de edge function ou no Supabase.

---

## 6. Recomendações Priorizadas

Ordenadas por impacto vs. esforço:

| # | Ação | Severidade | Esforço | Impacto |
|---|---|---|---|---|
| 1 | **[SEC-01]** Revogar e remover API key do Google exposta | CRÍTICO | Baixo | Segurança |
| 2 | **[BUG-01]** Substituir `alert()` por `useToast()` em ProspectDetailPage | ALTO | Baixo | UX |
| 3 | **[BUG-02]** Corrigir string "Criar Pitch" hardcoded | ALTO | Baixo | i18n |
| 4 | **[QC-01]** Adicionar Error Boundary em App.tsx | ALTO | Baixo | Estabilidade |
| 5 | **[UX-03]** Adicionar `onError` com toast nos hooks de mutação | ALTO | Baixo | UX |
| 6 | **[BUG-03]** Internacionalizar `formatRelativeTime` | MÉDIO | Baixo | i18n |
| 7 | **[QC-02/03]** Regenerar tipos do Supabase e eliminar `as any` | ALTO | Médio | Type safety |
| 8 | **[QC-06]** Tipar array de tabs em ProspectDetailPage | BAIXO | Baixo | Type safety |
| 9 | **[ARQ-01]** Mover `mockData.ts` para fixtures de teste | MÉDIO | Baixo | Organização |
| 10 | **[ARQ-02]** Reescrever `README.md` com documentação real | MÉDIO | Médio | DX |
| 11 | **[UX-02]** Implementar polling/webhook para search timeout | ALTO | Alto | UX crítica |
| 12 | **[BUG-04]** Parametrizar locale em `formatDate` | MÉDIO | Baixo | i18n |
| 13 | **[QC-05]** Adicionar testes (Vitest + Deno test) | MÉDIO | Alto | Confiabilidade |
| 14 | **[UX-05]** Definir direção arquitetural Pitches vs Prospects | MÉDIO | Médio | Arquitetura |
| 15 | **[UX-01]** Implementar página Analytics | BAIXO | Alto | Feature |
| 16 | **[QC-07]** Restringir CORS para domínio de produção | BAIXO | Baixo | Segurança |

---

## Arquivos Críticos para Revisão

| Arquivo | Issues |
|---|---|
| [src/pages/ProspectDetailPage.tsx](src/pages/ProspectDetailPage.tsx) | BUG-01, BUG-02, QC-06 |
| [src/hooks/useLeads.ts](src/hooks/useLeads.ts) | QC-02 |
| [src/hooks/useAudits.ts](src/hooks/useAudits.ts) | QC-03 |
| [src/lib/utils.ts](src/lib/utils.ts) | BUG-03, BUG-04 |
| [src/App.tsx](src/App.tsx) | QC-01, UX-01 |
| [src/hooks/useSearchLeads.ts](src/hooks/useSearchLeads.ts) | UX-02, BUG-05 |
| [supabase/functions/search-leads/index.ts](supabase/functions/search-leads/index.ts) | SEC-01, QC-07 |
| [src/lib/mockData.ts](src/lib/mockData.ts) | ARQ-01 |
| [README.md](README.md) | ARQ-02 |

---

*Auditoria gerada em 25/02/2026. Para ver o estado atualizado do roadmap, consultar [TODO.md](TODO.md).*
