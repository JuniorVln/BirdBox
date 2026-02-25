-- Migration: lead_intelligence_architecture
-- Adds deep enrichment columns to the leads table and creates associated intelligence tables.

-- ENUM for enrichment status
CREATE TYPE enrichment_status_enum AS ENUM ('pending', 'enriching', 'completed', 'failed');

-- 1. Extend existing `leads` table with new columns for enrichment data
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS enrichment_status enrichment_status_enum DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS enrichment_data JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS instagram_data JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS linkedin_data JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS tech_stack JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS pagespeed_data JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS scraped_content JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS enrichment_last_run_at TIMESTAMP WITH TIME ZONE;

-- 2. Create `decision_makers` table to hold people associated with leads
CREATE TABLE IF NOT EXISTS public.decision_makers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT,
    linkedin_url TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for decision_makers
ALTER TABLE public.decision_makers ENABLE ROW LEVEL SECURITY;

-- Policies for decision_makers (Users can manage decision makers for their own leads)
CREATE POLICY "Users can view decision makers for their leads"
  ON public.decision_makers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.leads l 
      WHERE l.id = decision_makers.lead_id 
      AND l.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert decision makers for their leads"
  ON public.decision_makers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.leads l 
      WHERE l.id = lead_id 
      AND l.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update decision makers for their leads"
  ON public.decision_makers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.leads l 
      WHERE l.id = decision_makers.lead_id 
      AND l.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete decision makers for their leads"
  ON public.decision_makers FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.leads l 
      WHERE l.id = decision_makers.lead_id 
      AND l.user_id = auth.uid()
    )
  );


-- 3. Create `lead_intelligence` table to hold the final AI-driven analysis
CREATE TABLE IF NOT EXISTS public.lead_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    ai_summary TEXT,
    identified_pain_points JSONB DEFAULT '[]'::jsonb, -- Array of objects: { pain_point, evidence, severity }
    recommended_services JSONB DEFAULT '[]'::jsonb, -- Array of strings indicating the services to pitch
    outreach_script_email TEXT,
    outreach_script_linkedin TEXT,
    health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
    is_qualified BOOLEAN DEFAULT TRUE,
    disqualification_reason TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for lead_intelligence
ALTER TABLE public.lead_intelligence ENABLE ROW LEVEL SECURITY;

-- Policies for lead_intelligence (Users can manage intelligence for their own leads)
CREATE POLICY "Users can view intelligence for their leads"
  ON public.lead_intelligence FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.leads l 
      WHERE l.id = lead_intelligence.lead_id 
      AND l.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert intelligence for their leads"
  ON public.lead_intelligence FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.leads l 
      WHERE l.id = lead_id 
      AND l.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update intelligence for their leads"
  ON public.lead_intelligence FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.leads l 
      WHERE l.id = lead_intelligence.lead_id 
      AND l.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete intelligence for their leads"
  ON public.lead_intelligence FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.leads l 
      WHERE l.id = lead_intelligence.lead_id 
      AND l.user_id = auth.uid()
    )
  );

-- Create updated_at trigger logic for new tables
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_decision_makers_updated_at
  BEFORE UPDATE ON public.decision_makers
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_lead_intelligence_updated_at
  BEFORE UPDATE ON public.lead_intelligence
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
