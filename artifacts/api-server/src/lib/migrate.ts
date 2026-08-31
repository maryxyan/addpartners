import { pool } from "@workspace/db";

export async function migrateDatabase(): Promise<void> {
  await pool.query(`
    ALTER TABLE properties
      ADD COLUMN IF NOT EXISTS workflow_steps jsonb NOT NULL DEFAULT '[]'::jsonb;

    ALTER TABLE properties
      ADD COLUMN IF NOT EXISTS gallery_images jsonb NOT NULL DEFAULT '[]'::jsonb;
  `);

  await pool.query(
    `UPDATE properties SET workflow_steps = $1::jsonb WHERE workflow_steps = '[]'::jsonb`,
    [JSON.stringify([
      { title: "Analiză inițială", description: "Evaluăm contextul proprietății, documentația disponibilă și obiectivele pentru a stabili o direcție clară." },
      { title: "Strategie", description: "Definim poziționarea, scenariile de valorificare și pașii necesari pentru pregătirea oportunității." },
      { title: "Pregătire și promovare", description: "Pregătim materialele, coordonăm prezentarea și conectăm proprietatea cu partenerii potriviți." },
      { title: "Negociere și finalizare", description: "Gestionăm dialogul, clarificările și pașii finali până la încheierea procesului." },
    ])],
  );
}
