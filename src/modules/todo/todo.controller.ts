import { Request, Response } from "express";
import { todoServices } from "./todo.service";

const createTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.createTodoIntoDB(req.body);
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
};

const getAllTodos = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getAllTodosFromDB();
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
};

const getSingleTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getSingleTodoFromDB(req.params.id!);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Todo with id ${req.params.id} not found!`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Todo with id ${req.params.id} retrieved successfully!`,
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateTodo = async (req: Request, res: Response) => {
  const { title, completed } = req.body;

  try {
    const result = await todoServices.updateTodoIntoDB(
      title,
      completed,
      req.params.id!
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Todo with id ${req.params.id} not found!`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Todo with id ${req.params.id} updated successfully!`,
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.deleteTodoFromDB(req.params.id!);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Todo with id ${req.params.id} not found!`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Todo with title ${result.rows[0].title} deleted successfully!`,
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const todoController = {
  createTodo,
  getAllTodos,
  getSingleTodo,
  updateTodo,
  deleteTodo,
};
