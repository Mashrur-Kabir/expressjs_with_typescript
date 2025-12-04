import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

// '/' --> /users, /users/:id, ....continues after app.use('/someroute', ...)
router.post("/", userControllers.createUser); //promise void type. wont return anything. just sending response

//get all users
router.get("/", auth("admin"), userControllers.getAllUsers);

//get single user
router.get("/:id", userControllers.getSingleUser);

//update user
router.put("/:id", userControllers.updateUser);

//delete user
router.delete("/:id", userControllers.deleteUser);

export const userRoutes = router;
