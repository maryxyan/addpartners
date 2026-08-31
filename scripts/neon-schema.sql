CREATE TABLE IF NOT EXISTS properties (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  location text NOT NULL,
  size text NOT NULL,
  category text NOT NULL,
  zone text NOT NULL,
  area text NOT NULL,
  status text NOT NULL,
  type text NOT NULL,
  price text NOT NULL,
  image text NOT NULL,
  description text NOT NULL,
  workflow_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  gallery_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS workflow_steps jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS gallery_images jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE properties
SET workflow_steps = '[{"title":"Analiză inițială","description":"Evaluăm contextul proprietății, documentația disponibilă și obiectivele pentru a stabili o direcție clară."},{"title":"Strategie","description":"Definim poziționarea, scenariile de valorificare și pașii necesari pentru pregătirea oportunității."},{"title":"Pregătire și promovare","description":"Pregătim materialele, coordonăm prezentarea și conectăm proprietatea cu partenerii potriviți."},{"title":"Negociere și finalizare","description":"Gestionăm dialogul, clarificările și pașii finali până la încheierea procesului."}]'::jsonb
WHERE workflow_steps = '[]'::jsonb;

CREATE TABLE IF NOT EXISTS inquiries (
  id serial PRIMARY KEY,
  kind text NOT NULL,
  name text NOT NULL,
  contact text NOT NULL,
  location text,
  property_slug text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'nou',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS property_categories (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS property_statuses (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO property_categories (name, slug) VALUES
  ('Terenuri', 'terenuri'),
  ('Comercial', 'comercial'),
  ('Rezidențial', 'rezidential'),
  ('Logistic / Industrial', 'logistic-industrial')
ON CONFLICT DO NOTHING;

INSERT INTO property_statuses (name, slug) VALUES
  ('Disponibil', 'disponibil'),
  ('Oportunitate', 'oportunitate'),
  ('În analiză', 'in-analiza')
ON CONFLICT DO NOTHING;
