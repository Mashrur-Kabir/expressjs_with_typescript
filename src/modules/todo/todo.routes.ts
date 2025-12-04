import express from "express";
import { todoController } from "./todo.controller";

const router = express.Router();

//post todo
router.post("/", todoController.createTodo);

//get all todos
router.get("/", todoController.getAllTodos);

//get a single todo
router.get("/:id", todoController.getSingleTodo);

//update todo
router.put("/:id", todoController.updateTodo);

//delete todo
router.delete("/:id", todoController.deleteTodo);

export const todoRoutes = router;
