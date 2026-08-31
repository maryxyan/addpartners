ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS workflow_steps jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE properties
SET workflow_steps = '[{"title":"Analiză inițială","description":"Evaluăm contextul proprietății, documentația disponibilă și obiectivele pentru a stabili o direcție clară."},{"title":"Strategie","description":"Definim poziționarea, scenariile de valorificare și pașii necesari pentru pregătirea oportunității."},{"title":"Pregătire și promovare","description":"Pregătim materialele, coordonăm prezentarea și conectăm proprietatea cu partenerii potriviți."},{"title":"Negociere și finalizare","description":"Gestionăm dialogul, clarificările și pașii finali până la încheierea procesului."}]'::jsonb
WHERE workflow_steps = '[]'::jsonb;
