import { NextFunction, Response, Request } from "express";
import ApiError from "../utils/ApiError";
import asyncWrapper from "./asyncWrapper";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
interface MyRequest extends Request {
  playerId: string;
}
interface Authentication {
  iat: number;
  exp: number;
  playerId: string;
}

export default asyncWrapper(
  (req: MyRequest, res: Response, next: NextFunction) => {
    const token = req.get("Authorization").split(" ")[1];
    if (token) {
      const auth =<Authentication> jwt.verify(token, process.env.JWT_PLAYER);
      req.playerId = auth.playerId;
      return next();
    }
    throw new ApiError('invalid token',500)
  }
);
