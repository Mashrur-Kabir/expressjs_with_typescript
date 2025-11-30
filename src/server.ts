import express, { Request, Response } from 'express';
import { Pool } from "pg";
import dotenv from "dotenv"
import path from "path"

dotenv.config({path: path.join(process.cwd(), ".env")}) //path of .env
const app = express() //creating express application
const port = 5000

//(middlewares):
//parser
app.use(express.json()); //parsing json data from req body
// app.use(express.urlencoded) //for formdata

//(DB):
//pool
const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STR}`
})

//tables
const initDB = async() => {
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
    `)

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
    `)
}

initDB();


app.get('/', (req: Request , res: Response) => {
  res.send('Hello World! Im using express with typescript. Its listening and changing thanks to tsx')
})

app.post("/", (req: Request, res: Response) => {
  console.log(req.body)

  res.status(201).json({
    success: true,
    message: "API is working!"
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
