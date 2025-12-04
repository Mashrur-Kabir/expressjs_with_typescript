import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]); //searches inside users table whose email matches $1

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password); //user.password = hashed password, password = written password in req

  if (!match) {
    return false;
  }

  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role },
    config.jwt_secret as string,
    {
      expiresIn: "7d",
    }
  );

  console.log({ token });

  return { token, user };
};

export const authServices = {
  loginUser,
};
