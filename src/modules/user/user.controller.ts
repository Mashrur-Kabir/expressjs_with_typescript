import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUserIntoDB(req.body);
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

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsersFromDB();
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

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getSingleUserFromDB(req.params.id!); //bang (!) or type assertion (..as string)

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
};

const updateUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const result = await userServices.updateUserIntoDB(
      req.params.id!,
      name,
      email
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
};

/*
For UPDATE and DELETE queries, PostgreSQL returns nothing unless you explicitly say:
    RETURNING *
For GET however → not needed because SELECT always returns rows
*/

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUserFromDB(req.params.id!);

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
};

export const userControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
