# BirdBox / Pitch AI — Roadmap & Status

> Última atualização: 2026-02-24
> Stack: React + TypeScript + Tailwind + Supabase + Edge Functions

---

## Estado atual (o que já funciona)

- [x] Auth — login, signup, magic link, Supabase Auth
- [x] Landing page com pricing, features, how-it-works
- [x] Dashboard layout + sidebar + i18n (pt-BR / en)
- [x] Lead Discovery — busca via Apify Google Maps extractor
- [x] Lead save → Prospects list (`/dashboard/prospects`)
- [x] Prospect Detail "War Room" — tabs Overview, Network, Tech, Intelligence
- [x] Deep Enrich — Wappalyzer, LinkedIn, PageSpeed, Instagram via Apify
- [x] Website Audit — PageSpeed Insights mobile + desktop (`/dashboard/audits`)
- [x] Audit Detail — scores, issues, recommendations
- [x] Website Scraping — Firecrawl (`scrape-website` Edge Function)
- [x] AI Website Generation — Claude Sonnet (`generate-pitch` Edge Function)
- [x] 4 templates locais de fallback (modern-professional, bold-creative, minimal-elegant, local-business)
- [x] Public Pitch Page — `/p/:id` com view tracking
- [x] Track View — Edge Function com geolocation via ip-api
- [x] Settings — profile (nome, agency, links sociais)
- [x] **[novo]** Generate Intelligence — Edge Function `generate-intelligence` conectada ao botão na tab Intelligence
- [x] **[novo]** Security fix — API keys removidas do código (enrich-lead)
- [x] **[novo]** Build limpo — TypeScript sem erros, playwright removido

---

## Débito técnico imediato (fazer antes de qualquer feature nova)

- [ ] **Deploy Edge Function nova** → `supabase functions deploy generate-intelligence`
- [ ] **Configurar secrets** no Supabase Dashboard → Edge Functions → Secrets:
  - `ANTHROPIC_API_KEY`
  - `APIFY_API_KEY`
  - `FIRECRAWL_API_KEY`
  - `GOOGLE_API_KEY`
- [ ] **Gerar tipos do Supabase** → elimina os `as any` do código:
  ```bash
  supabase gen types typescript --linked > src/lib/database.types.ts
  ```
- [ ] **Testar fluxo completo** de uma vez: Lead → Enrich → Intelligence → ver output

---

## P0 — Pitch Flow (core do produto, ainda desconectado)

> As páginas e componentes existem (`NewPitchPage`, `PitchDetailPage`, `PitchesPage`, `PitchForm`, `ScrapingProgress`, `TemplateSelector`, `PitchPreview`, `SendEmailModal`) mas as rotas em `App.tsx` redirecionam para prospects/leads. Precisa reconectar.

- [ ] Reconectar rotas em `App.tsx`:
  ```tsx
  <Route path="pitches" element={<PitchesPage />} />
  <Route path="pitches/:id" element={<PitchDetailPage />} />
  ```
- [ ] Adicionar botão "Create Pitch" no `ProspectDetailPage` → navega para `/dashboard/pitches/new?leadId=...`
- [ ] `NewPitchPage` — verificar se o fluxo está completo:
  - [x] Step 1: Form (company name + URL)
  - [x] Step 2: Scraping progress
  - [x] Step 3: Template selector
  - [x] Step 4: Generation + preview
  - [ ] Step 5: Save pitch com `useCreatePitch` → redirect para `/dashboard/pitches/:id`
- [ ] `PitchDetailPage` — verificar tabs:
  - [ ] Preview (iframe com o HTML gerado)
  - [ ] Analytics (views, location)
  - [ ] Feedback (ratings e mensagens do cliente)
- [ ] Testar geração end-to-end com site real

---

## P1 — Email Outreach

> `SendEmailModal.tsx` existe mas não tem backend. Gmail OAuth não implementado.

- [ ] Criar Edge Function `send-email` com Gmail API:
  - OAuth 2.0 flow (redirect → callback → salvar tokens em `email_settings`)
  - Endpoint para enviar email com tracking pixel embutido
- [ ] Settings page — adicionar seção "Email Integration":
  - Botão "Connect Gmail"
  - Status da conexão (email conectado, tokens válidos)
- [ ] `SendEmailModal` — conectar ao backend:
  - Preencher destinatário (do lead), subject, body com URL do pitch
  - Ao enviar: atualizar `pitch.status = 'sent'` e `email_sent_at`
- [ ] Tracking pixel — verificar se `track-view` Edge Function está recebendo pings corretamente

---

## P2 — Analytics

> Rota `/dashboard/analytics` existe mas é "Coming Soon".

- [ ] Dashboard analytics page:
  - Total de pitches enviados
  - Open rate (views / sent)
  - Response/feedback rate
  - Mapa de geolocation dos views (pitch_views.location)
  - Funil: draft → sent → opened → feedback
- [ ] Pitch detail — tab Analytics:
  - Timeline de opens (com timestamp e cidade)
  - Device type (mobile vs desktop via user agent)
  - Tempo médio na página (duration_seconds)

---

## P3 — Polish & Monetização

- [ ] Warmmy.io integration (email warm-up) — Settings page
- [ ] Planos / Stripe — integrar com as tiers da landing page
- [ ] Inline content editing no pitch preview (antes de enviar)
- [ ] Color customization no pitch (primary, secondary, accent)
- [ ] 2 templates a mais (tech-startup, portfolio — no PRD mas não implementados)
- [ ] Feedback system no site gerado — form funcional que salva em `pitch_feedback`

---

## Arquitetura — referência rápida

```
src/
  pages/          → rotas principais
  components/     → UI por feature (pitch/, leads/, audit/, layout/, common/)
  hooks/          → React Query + mutations
  stores/         → Zustand (auth, ui)
  templates/      → geradores de HTML local (fallback)
  lib/            → supabase client, i18n, utils

supabase/
  functions/
    search-leads/         → Apify Google Maps
    enrich-lead/          → Apify (Wappalyzer, LinkedIn, Instagram) + PageSpeed
    scrape-website/       → Firecrawl
    generate-pitch/       → Anthropic Claude (HTML generation)
    generate-intelligence/→ Anthropic Claude (sales intelligence) [novo]
    audit-website/        → Google PageSpeed Insights
    track-view/           → view tracking + ip geolocation
  migrations/
    001_initial_schema.sql
    002_audits.sql
    20260223..._lead_intelligence_architecture.sql
```

---

## Ordem de execução recomendada

```
[Agora]     Deploy generate-intelligence + testar Intelligence tab
[Semana 1]  Reconectar P0 pitch flow (rotas + save + detail page)
[Semana 2]  Gmail OAuth + send email (P1)
[Semana 3]  Analytics page (P2)
[Depois]    Polish + Stripe (P3)
```
