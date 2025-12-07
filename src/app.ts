import express, { Request, Response } from "express";
import initDB from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { todoRoutes } from "./modules/todo/todo.routes";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express(); //creating express application

//(middlewares):
//parser
app.use(express.json()); //parsing json data from req body
// app.use(express.urlencoded) //for formdata

//initializing DB:
initDB();

// '/' --> localhost:5000/
app.get("/", logger, (req: Request, res: Response) => {
  res.send(
    "Hello World! Im using express with typescript. Its listening and changing thanks to tsx"
  );
});

//(modules):
//(users CRUD):------------------------------------------------
app.use("/users", userRoutes);

//(todos CRUD):------------------------------------------------
app.use("/todos", todoRoutes);

//(auth operation)
app.use("/auth", authRoutes);

//-------------------------------------------------------------
//handle 404 not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "route not found",
    path: req.path,
  });
});

export default app;
