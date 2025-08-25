-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.client_abilities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  intuition integer CHECK (intuition >= 0 AND intuition <= 10),
  empathy integer CHECK (empathy >= 0 AND empathy <= 10),
  ambition integer CHECK (ambition >= 0 AND ambition <= 10),
  intellect integer CHECK (intellect >= 0 AND intellect <= 10),
  creativity integer CHECK (creativity >= 0 AND creativity <= 10),
  self_awareness integer CHECK (self_awareness >= 0 AND self_awareness <= 10),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT client_abilities_pkey PRIMARY KEY (id),
  CONSTRAINT client_abilities_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id)
);
CREATE TABLE public.client_attachment (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  anxiety_score integer CHECK (anxiety_score >= 0 AND anxiety_score <= 10),
  avoidance_score integer CHECK (avoidance_score >= 0 AND avoidance_score <= 10),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT client_attachment_pkey PRIMARY KEY (id),
  CONSTRAINT client_attachment_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id)
);
CREATE TABLE public.client_mbti (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  mbti_type text,
  ie_score integer CHECK (ie_score >= 0 AND ie_score <= 100),
  ns_score integer CHECK (ns_score >= 0 AND ns_score <= 100),
  ft_score integer CHECK (ft_score >= 0 AND ft_score <= 100),
  jp_score integer CHECK (jp_score >= 0 AND jp_score <= 100),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT client_mbti_pkey PRIMARY KEY (id),
  CONSTRAINT client_mbti_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id)
);
CREATE TABLE public.clients (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  pronouns text,
  how_we_met text,
  current_vibe text,
  relationship_goal text,
  work_industry text,
  spiritual_beliefs text,
  communication_style text,
  core_value text,
  birth_day date,
  ethnicity text,
  client_since date,
  reader_notes text,
  avatar text,
  tags ARRAY,
  last_contact text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT clients_pkey PRIMARY KEY (id),
  CONSTRAINT clients_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.readings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  user_id uuid NOT NULL,
  reading_type text DEFAULT 'reading'::text,
  question text,
  cards ARRAY,
  subjective text,
  assessment text,
  plan text,
  content text,
  reading_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT readings_pkey PRIMARY KEY (id),
  CONSTRAINT readings_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id),
  CONSTRAINT readings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);