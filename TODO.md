# BirdBox — Roadmap de Tarefas

> Última atualização: 24 fev 2026
> Ferramenta de acompanhamento do projeto. Atualize os status conforme avança.

---

## 🔴 Crítico — Bloqueios e Dívida Técnica

- [x] **Aplicar migração do banco de dados**
  - Arquivo: `supabase/migrations/20260223222147_lead_intelligence_architecture.sql`
  - Tabelas `decision_makers` e `lead_intelligence` já existem em produção
  - Colunas de enriquecimento na tabela `leads` já presentes

- [x] **Gerar TypeScript types do Supabase**
  - `src/types/database.ts` atualizado com types gerados via MCP (fonte da verdade)
  - `src/lib/database.types.ts` reexporta de `@/types/database`
  - Inclui todas as tabelas: audits, decision_makers, email_settings, lead_intelligence, leads, pitch_feedback, pitch_views, pitches, profiles
  - Enum `enrichment_status_enum` tipado corretamente

- [ ] **Commitar e organizar arquivos pendentes**
  - Arquivos novos não rastreados: `src/lib/i18n.ts`, `src/hooks/useI18n.ts`, `src/hooks/useEnrichLead.ts`, `src/components/common/LanguageSwitcher.tsx`, `src/lib/database.types.ts`, `supabase/functions/enrich-lead/`, `supabase/config.toml`, `supabase/migrations/20260223222147...`
  - Arquivos modificados: todos os componentes e páginas

---

## 🟡 Consolidação — Integrações Pendentes

- [ ] **Integrar LanguageSwitcher no Header/Navbar**
  - Componente criado em `src/components/common/LanguageSwitcher.tsx`
  - Verificar se está inserido em `src/components/layout/Header.tsx` ou `src/components/landing/Navbar.tsx`

- [ ] **Auditar cobertura do i18n**
  - Verificar se todas as páginas e componentes usam `useI18n()`
  - Eliminar strings hardcoded em português/inglês no JSX
  - Arquivos principais a revisar: todas as páginas em `src/pages/`

- [ ] **Testar fluxo de enriquecimento end-to-end**
  - Edge function: `supabase/functions/enrich-lead/`
  - Hook: `src/hooks/useEnrichLead.ts`
  - UI: botão "Deep Enrich" na aba Overview do ProspectDetail
  - Verificar: status `pending → enriching → completed/failed` na UI
  - Verificar: criação de registros em `decision_makers`

- [ ] **Verificar edge function `generate-intelligence`**
  - Hook `useGenerateIntelligence` em `src/hooks/usePitches.ts` referencia a função
  - Confirmar se a edge function existe em `supabase/functions/generate-intelligence/`
  - Testar botão "Analyze Opportunity" na aba Intelligence

- [ ] **Validar aba Intelligence no ProspectDetail**
  - Renderização de: AI summary, pain points (com severity), serviços recomendados
  - Scripts de outreach (email e LinkedIn) com botão de copiar
  - Health score e status de qualificação (`is_qualified`)

- [ ] **Revisar fluxo de Pitches (legado)**
  - O fluxo de geração de pitch HTML ainda coexiste com o novo fluxo de prospects
  - Decidir: manter separado, integrar, ou deprecar
  - Rotas `/dashboard/pitches/*` redirecionam para `/dashboard/prospects` — verificar se está OK

---

## 🟢 Melhorias — Após Consolidação

- [ ] **Implementar página Analytics**
  - Atualmente mostra "Coming soon"
  - Métricas sugeridas: leads por status, taxa de conversão (searches → saved → enriched), audits rodadas, pitches abertos

- [ ] **Completar configurações de Email**
  - Tabela `email_settings` existe no banco
  - Verificar se a UI em `src/pages/SettingsPage.tsx` expõe configuração de email (remetente, assinatura)

- [ ] **Adicionar tratamento de erros mais robusto**
  - Edge functions retornam erros detalhados? Verificar feedback ao usuário
  - Loading states consistentes em todas as ações assíncronas

- [ ] **Testes automatizados**
  - Nenhum arquivo de teste encontrado no projeto
  - Prioridade: hooks críticos (`useEnrichLead`, `useRunAudit`) e edge functions

- [ ] **Polish visual e responsividade**
  - Revisar novas telas em mobile (ProspectDetail 4 abas, LeadFilters, etc.)
  - Consistência de espaçamento e tipografia nas páginas recém-adicionadas

- [ ] **Performance — React Query cache tuning**
  - Revisar `staleTime` e `cacheTime` nas queries de leads/pitches/audits
  - Evitar refetches desnecessários durante navegação

---

## 📋 Backlog — Próximas Features

- [ ] **Integração com CRM** — exportar leads para HubSpot / Pipedrive
- [ ] **Notificações** — alertas quando enrichment termina, quando pitch é aberto
- [ ] **Bulk actions** — enriquecer múltiplos leads de uma vez
- [ ] **Templates personalizáveis** — editor de email/LinkedIn script
- [ ] **Relatórios exportáveis** — PDF/CSV de leads e auditorias
- [ ] **Onboarding** — tour interativo para novos usuários

---

## ✅ Concluído

- [x] Arquitetura base (Supabase + React + Vite)
- [x] Autenticação (login/signup com Supabase Auth)
- [x] Fluxo de busca de leads via Google Maps (Apify)
- [x] Fluxo de auditoria de sites (Google PageSpeed)
- [x] Geração e envio de pitches com tracking de abertura
- [x] Schema de lead intelligence (`decision_makers`, `lead_intelligence`)
- [x] Edge function `enrich-lead` (Wappalyzer + LinkedIn + PageSpeed + Instagram)
- [x] Sistema de i18n (PT-BR / EN) com Zustand persistido
- [x] Componente `LanguageSwitcher`
- [x] ProspectDetail com 4 abas (Overview, Network, Tech Stack, Intelligence)
- [x] Landing page (Hero, Features, How It Works, Pricing)
