import { Pool } from "pg"; // Import the Pool class from 'pg'

// Initialize a new Pool instance
export const pool = new Pool({
  user: process.env.USER_NAME,
  host: process.env.HOST_NAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT_NUMBER,
});

export default async function dbConnect() {
  try {
    const client = await pool.connect(); // Connect to the pool
    const result = await client.query("SELECT NOW()");
    client.release(); // Release the client back to the pool
    console.log("Connected to the database", result.rows);
  } catch (err) {
    console.error("Error in connection", err.stack);
  }
}
