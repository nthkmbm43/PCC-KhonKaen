import dotenv from 'dotenv';
dotenv.config({path:'.env.local'});
import { sql } from '@vercel/postgres';

async function run() {
  try {
    await sql.query(`
      CREATE TABLE IF NOT EXISTS line_rich_menus (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        image_url text NOT NULL,
        action_a text,
        action_b text,
        action_c text,
        action_d text,
        action_e text,
        action_f text,
        rich_menu_id text,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      );
    `);
    console.log('Table created successfully!');
  } catch (err) {
    console.error('Error creating table:', err);
  }
}
run();
