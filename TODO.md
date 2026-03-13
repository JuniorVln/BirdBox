# BirdBox — TODO & Acompanhamento

> Última atualização: 25 fev 2026 — P0 concluído
> Referência estratégica: `docs/PRD-PitchAI.md` | Referência de bugs: `docs/AUDIT.md`
>
> **Como usar:** Marcar `[x]` quando concluído. Items com `⚠️` bloqueiam o item seguinte.

---

## ✅ P0 — Urgente (segurança & bugs críticos) — CONCLUÍDO

- [x] **[SEC-01]** Remover API key hardcoded de `search-leads/index.ts`
  - ⚠️ Ação manual pendente: revogar a chave antiga no Google Cloud Console e gerar nova
- [x] **[BUG-01]** `alert()` substituído por `useToast()` em `ProspectDetailPage.tsx:42`
- [x] **[BUG-02]** "Criar Pitch" hardcoded substituído por `{t.pitches.createPitch}`
- [x] **[QC-01]** `ErrorBoundary` criado em `src/components/common/ErrorBoundary.tsx` e aplicado em `App.tsx`
- [x] **[UX-03]** `onError` com toast adicionado em `useEnrichLead`, `useRunAudit`, `useGeneratePitch`, `useGenerateIntelligence`
- [x] **Bônus:** `@ts-expect-error` obsoleto removido de `useAudits.ts`

---

## 🟡 P1 — Consolidação (fechar o que está in-progress)

### Qualidade de código

- [ ] **[QC-02/03]** Regenerar tipos do Supabase e eliminar `as any`
  - Rodar: `supabase gen types typescript --project-id <id> > src/types/database.ts`
  - Arquivos afetados: `src/hooks/useLeads.ts`, `src/hooks/useAudits.ts`
  - Aceite: Zero ocorrências de `as any` ou `@ts-expect-error` nos hooks de dados

- [ ] **[BUG-03]** Internacionalizar `formatRelativeTime` em utils.ts
  - Arquivo: `src/lib/utils.ts:26-29`
  - Aceite: Strings de tempo relativo ("há 3 dias", "3d ago") respeitam o locale selecionado

- [ ] **[BUG-04]** Corrigir locale fixo `en-US` em `formatDate`
  - Arquivo: `src/lib/utils.ts:9`
  - Aceite: Datas formatadas conforme locale do usuário (PT-BR: "5 de jan. de 2026")

- [ ] **[ARQ-01]** Mover `mockData.ts` para fixtures de teste
  - Arquivo: `src/lib/mockData.ts`
  - Aceite: Arquivo movido para `src/__fixtures__/` ou removido se não utilizado

### Features in-progress

- [ ] **Testar fluxo enrich → intelligence end-to-end com dados reais**
  - Salvar lead → Deep Enrich → aguardar → Analisar Oportunidade → ver aba Intelligence
  - Aceite: Ciclo completo funciona sem erro em produção com lead real

- [ ] **Decisão arquitetural: Pitches vs Proposals**
  - Contexto: Rota `/dashboard/pitches/*` (pitch HTML) coexiste com novo fluxo Prospects
  - Opções: (a) manter ambos separados, (b) integrar Pitch ao ProspectDetail, (c) deprecar Pitch e focar em Proposal Builder
  - Aceite: Decisão documentada aqui e refletida no PRD

- [ ] **Resolver timeout de 150s em `search-leads`**
  - Contexto: 6+ erros 546 na última semana (Apify actor síncrono)
  - Investigar: Apify suporta webhook? Possível retornar `runId` e fazer polling no frontend?
  - Arquivo: `supabase/functions/search-leads/index.ts`, `src/hooks/useSearchLeads.ts`
  - Aceite: Busca de leads tem feedback de progresso e não causa timeout silencioso

---

## 🟢 P2 — North Star Core (próximas features)

> Referência: Seção 4 do `PRD-PitchAI.md`

### Proposal Builder (substitui pitch HTML como entregável ao lead)

- [ ] Definir estrutura da proposta: diagnóstico + evidências de auditoria + portfólio + proposta + CTA
- [ ] Criar tabela `proposals` no banco (migração Supabase)
- [ ] Criar UI de Proposal Builder (integrado ao ProspectDetail ou nova rota)
- [ ] Geração do conteúdo com Claude usando dados do `lead_intelligence` + `audits`
- [ ] Preview público (similar ao pitch atual `/p/:id`)
- [ ] Aceite: Usuário consegue gerar e enviar uma proposta fundamentada em dados de auditoria

### Pipeline CRM (Kanban)

- [ ] Criar tabela `opportunities` e `opportunity_activities`
- [ ] Criar página `/dashboard/pipeline` com Kanban: Novo → Contactado → Visualizou → Respondeu → Fechou
- [ ] Drag-and-drop de cards entre colunas
- [ ] Histórico de atividades por oportunidade
- [ ] Aceite: Usuário consegue mover leads pelo funil e ver histórico de interações

### Gmail OAuth completo

- [ ] Implementar fluxo OAuth 2.0 no frontend (callback URL + token storage)
- [ ] UI de configuração na SettingsPage (conectar/desconectar conta Gmail)
- [ ] Envio direto de email a partir do Proposal/Pitch (sem "Abrir no Gmail")
- [ ] Aceite: Usuário consegue enviar email diretamente pelo BirdBox sem sair da plataforma

### Analytics Dashboard

- [ ] Criar página `/dashboard/analytics` (remover Coming Soon)
- [ ] Métricas de leads: total, por status de enriquecimento, taxa de conversão (search → saved → enriched)
- [ ] Métricas de pitches/proposals: total, open rate, feedback rate
- [ ] Métricas de audits: total rodadas, scores médios
- [ ] Aceite: Dashboard mostra KPIs reais do usuário sem dados mockados

---

## 🔵 P3 — Expansão

### Upwork Hunter

- [ ] Pesquisar viabilidade da API oficial Upwork para busca de jobs
- [ ] Criar edge function `search-upwork-jobs`
- [ ] Criar página `/dashboard/upwork` com lista de jobs filtrados
- [ ] Integrar geração de proposta com Claude (usando perfil do usuário + job description)
- [ ] Aceite: Usuário busca jobs, filtra por budget/skills, gera e revisa proposta antes de enviar

### Multi-source Prospector

- [ ] LinkedIn: pesquisar via Apify actor para busca de empresas
- [ ] Instagram: buscar negócios por hashtag/localização
- [ ] Behance / Dribbble: identificar empresas que postam buscando criativos
- [ ] Aceite: LeadsPage permite selecionar fonte além do Google Maps

### Multi-discipline Audit Engine

- [ ] Branding audit: consistência visual, Google Business, materiais (Instagram Graph API)
- [ ] Motion audit: presença em vídeo, YouTube, reels (YouTube Data API)
- [ ] Social media audit: frequência, engajamento, qualidade (Instagram Graph API)
- [ ] Aceite: AuditsPage permite selecionar disciplina ao rodar auditoria

### Outreach Engine

- [ ] warmup.io dashboard completo (health score, daily capacity, ramp-up visualization)
- [ ] Templates de sequência de email (3-5 touches automáticos)
- [ ] LinkedIn DM via extensão ou API
- [ ] Aceite: Usuário configura sequência de outreach e monitora status de cada touch

---

## 📋 Backlog

- [ ] White-label para agências (multi-usuário por conta)
- [ ] Portfólio integrado no produto (upload de cases do profissional)
- [ ] Bulk enrichment (selecionar múltiplos leads e enriquecer em batch)
- [ ] Relatórios exportáveis (PDF/CSV de leads, audits, proposals)
- [ ] Onboarding interativo (tour guiado para novos usuários)
- [ ] Notificações (push/email quando enrichment termina, pitch visualizado)
- [ ] CRM export (HubSpot, Pipedrive)
- [ ] Magic link auth (além de email/password)
- [ ] README.md reescrito com documentação real do projeto

---

## ✅ Concluído

- [x] Arquitetura base (Supabase + React + Vite + TypeScript)
- [x] Autenticação email/password com auto-criação de perfil
- [x] Landing Page completa (Hero, Features, How It Works, Pricing)
- [x] Fluxo de busca de leads via Google Maps (Places API v1)
- [x] Fluxo completo de criação de pitch (scrape → template → HTML com Claude)
- [x] Preview público `/p/:id` (sem autenticação)
- [x] Tracking de visualizações de pitch (edge fn `track-view`)
- [x] Sistema de feedback no pitch (rating + mensagem)
- [x] Prospects Pipeline (`/dashboard/prospects/*`)
- [x] ProspectDetailPage com 4 abas (Overview / Network / Tech Stack / Intelligence)
- [x] Lead Enrichment multi-source (Apify: site, Instagram, LinkedIn, tech stack, PageSpeed)
- [x] Decision Makers (extração de LinkedIn via Apify → tabela `decision_makers`)
- [x] AI Sales Intelligence (Claude → tabela `lead_intelligence`)
  - Pain points com evidências
  - Serviços recomendados
  - Script de email e LinkedIn
- [x] Website Audit Engine (Google PageSpeed/Lighthouse → tabela `audits`)
- [x] AuditDetailPage (scores + issues + recomendações)
- [x] Sistema de i18n PT-BR / English com Zustand persistido
- [x] LanguageSwitcher no Header (dashboard) e Navbar (landing)
- [x] Schema de banco: migração `lead_intelligence_architecture` aplicada
- [x] TypeScript types gerados do Supabase (`src/types/database.ts`)
- [x] Edge functions deployadas: `enrich-lead` v2, `generate-intelligence` v1, `audit-website`
- [x] PRD atualizado para v3.0 North Star (`PRD-PitchAI.md`)
- [x] Relatório de auditoria de código gerado (`docs/AUDIT.md`)
