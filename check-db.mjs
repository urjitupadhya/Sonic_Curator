import pg from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function check() {
  try {
    await client.connect();
    console.log("✅ Connected to database");
    
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Tables found:", tables.rows.map(r => r.table_name));

    if (tables.rows.some(r => r.table_name === 'user')) {
      const columns = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'user'
      `);
      console.log("Columns in 'user' table:", columns.rows.map(r => r.column_name));
      
      const users = await client.query('SELECT email, name FROM "user"');
      console.log("Users found:", users.rows);
    } else {
      console.log("❌ 'user' table NOT FOUND");
    }

  } catch (err) {
    console.error("❌ Error checking database:", err.message);
  } finally {
    await client.end();
  }
}

check();
