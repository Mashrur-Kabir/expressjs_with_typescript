import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

//Record<string, unknown> = {key: value}
const createUserIntoDB = async (payload: Record<string, unknown>) => {
  const { name, role, email, password } = payload;
  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, role, email, password) VALUES($1, $2, $3, $4) RETURNING *`,
    [name, role, email, hashedPassword]
  );
  return result;
};

const getAllUsersFromDB = async () => {
  const result = await pool.query(`SELECT * FROM users ORDER BY id ASC`);
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result;
};

const updateUserIntoDB = async (id: string, name: string, email: string) => {
  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
    [name, email, id]
  );
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
    [id]
  );
  return result;
};

export const userServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
};
