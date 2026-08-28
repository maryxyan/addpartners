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
  created_at timestamptz NOT NULL DEFAULT now()
);

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
