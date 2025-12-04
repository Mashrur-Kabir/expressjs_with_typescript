import { Pool } from "pg";
import config from ".";

//(DB) config:
//pool
export const pool = new Pool({
  //name export
  connectionString: `${config.connection_str}`, // from ./config
});

//tables
const initDB = async () => {
  //async = Creating tables in the database takes time, While the database is being created, Node continues starting the server initDB finishes later
  //Send a SQL command to Postgres using an available connection (created by pool),
  //Wait for the response
  //return the results
  await pool.query(` 
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        email VARCHAR(150) NOT NULL,
        password TEXT NOT NULL, 
        age INT,
        phone VARCHAR(15), 
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
    `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
    `);
};

export default initDB; //default export
