//higher order function --> returns a function

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";

//role=["admin"]
const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      console.log({ authToken: token });

      if (!token) {
        return res.status(500).json({
          message: "You are not allowed!",
        });
      }

      const decoded = jwt.verify(
        token,
        config.jwt_secret as string
      ) as JwtPayload; //if token doesn't match, it will return error with status(500)
      console.log({ decoded });
      req.user = decoded;

      //role=["admin"]
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(500).json({
          error: "unauthorized personnel!!",
        });
      } //if roles array have some value and the user doesn't have required role, send error
      next(); //if desired role is included in role ("admin"), proceed..
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default auth;
