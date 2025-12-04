import { pool } from "../../config/db";

const createTodoIntoDB = async (payload: Record<string, unknown>) => {
  const { user_id, title } = payload;
  const result = await pool.query(
    `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
    [user_id, title]
  );
  return result;
};

const getAllTodosFromDB = async () => {
  const result = await pool.query(`SELECT * FROM todos ORDER BY id ASC`);
  return result;
};

const getSingleTodoFromDB = async (id: string) => {
  const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [id]);
  return result;
};

const updateTodoIntoDB = async (
  title: string,
  completed: boolean,
  id: string
) => {
  const result = await pool.query(
    `UPDATE todos SET title=$1, completed=$2 WHERE id=$3 RETURNING *`,
    [title, completed, id]
  );
  return result;
};

const deleteTodoFromDB = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM todos WHERE id = $1 RETURNING *`,
    [id]
  );
  return result;
};

export const todoServices = {
  createTodoIntoDB,
  getAllTodosFromDB,
  getSingleTodoFromDB,
  updateTodoIntoDB,
  deleteTodoFromDB,
};
