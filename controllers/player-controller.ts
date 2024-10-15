import { Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import jwt from "jsonwebtoken";
import {
  CreatePlayerInputs,
  LoginInputs,
  DeleteInputs,
} from "../dto/player-dto";
import Player from "../models/player-model";
import asyncWrapper from "../middlewares/asyncWrapper";
import ApiError from "../utils/ApiError";

interface MyRequest extends Request {
  playerId: string;
}

export class PlayerControllers {
  static registerController = asyncWrapper(
    async (req: Request, res: Response) => {
      const playerInputs = plainToClass(CreatePlayerInputs, req.body);
      const validatorError = await validate(playerInputs, {
        validationError: { target: false },
      });
      if (validatorError.length > 0) {
        throw new ApiError(
          validatorError[0].constraints[
            Object.keys(validatorError[0].constraints)[0]
          ],
          500
        );
      }
      const { email, username, password } = playerInputs;
      const newPlayer = await Player.create({
        email,
        username,
        password,
      });
      const token = jwt.sign(
        { playerId: newPlayer._id },
        process.env.JWT_PLAYER,
        { expiresIn: 1000 * 60 * 60 * 24 * 30 }
      );
      res.status(201).json({
        status: true,
        data: { authToken: token },
      });
    }
  );
  static loginController = asyncWrapper(async (req: Request, res: Response) => {
    const loginInputs = plainToClass(LoginInputs, req.body);
    const validatorError = await validate(loginInputs, {
      validationError: { target: false },
    });
    if (validatorError.length > 0) {
      throw new ApiError(
        validatorError[0].constraints[
          Object.keys(validatorError[0].constraints)[0]
        ],
        500
      );
    }
    const { email, password } = loginInputs;
    const player = await Player.findOne({ email });
    if (!player || !player.Auth(password)) {
      throw new ApiError("email or password is incorrect", 500);
    }
    const token = jwt.sign({ playerId: player._id }, process.env.JWT_PLAYER, {
      expiresIn: 1000 * 60 * 60 * 24 * 30,
    });
    res.json({ status: true, data: { authToken: token } });
  });
  static deleteController = asyncWrapper(
    async (req: MyRequest, res: Response) => {
      const deleteInputs = plainToClass(DeleteInputs, req.body);
      const validatorError = await validate(deleteInputs, {
        validationError: { target: false },
      });
      if (validatorError.length > 0) {
        throw new ApiError(
          validatorError[0].constraints[
            Object.keys(validatorError[0].constraints)[0]
          ],
          500
        );
      }
      const { password } = deleteInputs;
      const player = await Player.findById(req.playerId);
      if (player.Auth(password)) {
        await player.deleteOne();
        return res.status(202).json({
          status: true,
          data: null,
        });
      }
      throw new ApiError("wrong password", 500);
    }
  );
}
