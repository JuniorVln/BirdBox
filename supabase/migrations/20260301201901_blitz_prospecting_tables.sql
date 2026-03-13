-- Criar tabela para as Campanhas Blitz
CREATE TABLE public.blitz_campaigns (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  niche text,
  template_link text,
  prompt text, -- Prompt para gerar a mensagem caso não usemos template fixo
  delay_minutes integer DEFAULT 5, -- Delay aproximado entre disparos
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.blitz_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own blitz campaigns" ON public.blitz_campaigns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own blitz campaigns" ON public.blitz_campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blitz campaigns" ON public.blitz_campaigns
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own blitz campaigns" ON public.blitz_campaigns
  FOR DELETE USING (auth.uid() = user_id);


-- Criar tabela para os Prospects da Blitz (Leads capturados na massa)
CREATE TYPE blitz_prospect_status AS ENUM ('pending', 'generated', 'scheduled', 'sent', 'failed', 'replied');

CREATE TABLE public.blitz_prospects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id uuid REFERENCES public.blitz_campaigns(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Dados do Prospect
  company_name text NOT NULL,
  phone text NOT NULL,
  email text,
  website text,
  instagram text,
  bio text, -- Novo campo para contexto adicional
  
  -- Dados de Disparo
  status blitz_prospect_status DEFAULT 'pending',
  generated_message text, -- Mensagem gerada pelo Claude
  scheduled_for timestamp with time zone, -- Quando deve ser disparado (para cadência)
  sent_at timestamp with time zone,
  error_message text,
  
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.blitz_prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own blitz prospects" ON public.blitz_prospects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own blitz prospects" ON public.blitz_prospects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blitz prospects" ON public.blitz_prospects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own blitz prospects" ON public.blitz_prospects
  FOR DELETE USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER handle_updated_at_blitz_campaigns
  BEFORE UPDATE ON public.blitz_campaigns
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

CREATE TRIGGER handle_updated_at_blitz_prospects
  BEFORE UPDATE ON public.blitz_prospects
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-- Index for cron workers to quickly find scheduled prospects
CREATE INDEX IF NOT EXISTS blitz_prospects_scheduled_status_idx ON public.blitz_prospects (status, scheduled_for);
