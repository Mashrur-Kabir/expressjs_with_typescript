import express, { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") }); //path of .env
const app = express(); //creating express application
const port = 5000;

//(middlewares):
//parser
app.use(express.json()); //parsing json data from req body
// app.use(express.urlencoded) //for formdata

//(DB):
//pool
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`,
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
        email VARCHAR(150) NOT NULL,
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

initDB();

//logger middleware
const logger = (req: Request, res: Request, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n`);
  next();
};

app.get("/", logger, (req: Request, res: Response) => {
  res.send(
    "Hello World! Im using express with typescript. Its listening and changing thanks to tsx"
  );
});

//(users CRUD):------------------------------------------------

//post user
app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
      [name, email]
    );
    // console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: "Data inserted successfully!",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/*
1. postman sends a request with json type content in body:
    -req arrives at node/express
    -express matches the route (app.post())
    -nodejs immediately enters async function
2. express parses json with express.json middleware
3. data gets extracted (destructured) from js object (parsed json)
4. nodejs communicates with db using pool.query():
    -nodejs (with pg library) initiates the query
    -takes a free connection (among many others) from pool for faster connection establishment
    -format sql query using placeholder ($1, $2...etc safe variables to avoid sql injection), and sends it over the network to postgres
    -postgres receives the sql, executes it and prepares the result (which could be an error or success, hence the try-catch block)
    -node receives the result from postgres and makes it available as result.rows[0]
[[[it is an async/await operation because: 
    -while postgres processes it, node doesn't wait and goes to handle other requests (maybe a get request from another user)
    -when postgres is done, it calls node back for it to receive the result
]]]
5. node sends the response back to postman (data: result.rows[0])
6. db connection is released back to pool
*/

//get all users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users ORDER BY id ASC`);
    res.status(201).json({
      success: true,
      message: "All data retrieved successfully!",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//get specific user
app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `User with id ${req.params.id} not found!`,
      });
    }

    res.status(200).json({
      success: true,
      message: `User with id ${req.params.id} retrieved successfully!`,
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//update user
app.put("/users/:id", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
      [name, email, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `User with id ${req.params.id} not found!`,
      });
    }

    res.status(200).json({
      success: true,
      message: `User with id ${req.params.id} updated successfully!`,
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/*
For UPDATE and DELETE queries, PostgreSQL returns nothing unless you explicitly say:
    RETURNING *
For GET however → not needed because SELECT always returns rows
*/

//delete user
app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: `User with id ${req.params.id} not found!`,
      });
    }

    res.status(200).json({
      success: true,
      message: `User with name ${result.rows[0].name} deleted successfully!`,
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//(todos CRUD):------------------------------------------------

//post todos
app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
      [user_id, title]
    );
    // console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: "Data inserted successfully!",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//get all todos
app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos ORDER BY id ASC`);
    res.status(201).json({
      success: true,
      message: "All data retrieved successfully!",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//handle 404 not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "route not found",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
