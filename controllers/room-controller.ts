import { Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import ApiError from "../utils/ApiError";
import Room from "../models/room-model";
import asyncWrapper from "../middlewares/asyncWrapper";
import jwt from "jsonwebtoken";
import {
  CreateRoomInputs,
  DeleteRoomInputs,
  ExitRoomInputs,
  JoinRoomInputs,
} from "../dto/room-dto";
import bcrypt from "bcryptjs";

interface MyRequest extends Request {
  playerId: string;
}

export class RoomControllers {
  static createRoom = asyncWrapper(async (req: MyRequest, res: Response) => {
    const createInputs = plainToClass(CreateRoomInputs, req.body);
    const validatorError = await validate(createInputs, {
      validationError: { target: false },
    });
    if (validatorError.length > 0)
      throw new ApiError(
        validatorError[0].constraints[
          Object.keys(validatorError[0].constraints)[0]
        ],
        500
      );
    let { roomName, maxPlayers, rounds, password } = createInputs;
    password = bcrypt.hashSync(password, bcrypt.genSaltSync());
    const newRoom = await Room.create({
      roomName,
      maxPlayers,
      rounds,
      password,
      owner: req.playerId,
    });
    const token = jwt.sign({ roomId: newRoom._id }, process.env.JWT_ROOM, {
      expiresIn: 1000 * 60 * 60,
    });
    res.json({
      status: true,
      data: { roomToken: token,
        roomId:newRoom._id
       },
    });
  });
  static joinRoom = asyncWrapper(async (req: MyRequest, res: Response) => {
    const joinInputs = plainToClass(JoinRoomInputs, req.body);
    const validatorError = await validate(joinInputs, {
      validationError: { target: false },
    });
    if (validatorError.length > 0)
      throw new ApiError(
        validatorError[0].constraints[
          Object.keys(validatorError[0].constraints)[0]
        ],
        500
      );
    const { roomId, password } = joinInputs;
    const room = await Room.findById(roomId);
    if (room.Auth(password)) {
      if (room.players.length < room.maxPlayers) {
        room.players.push(Object(req.playerId));

        await room.save();
        const token = jwt.sign({ roomId: room._id }, process.env.JWT_ROOM, {
          expiresIn: 1000 * 60 * 60,
        });
        return res.json({
          status: true,
          data: { roomToken: token },
        });
      }
      throw new ApiError("The room is full of players", 500);
    }
    throw new ApiError("wrong Password", 500);
  });
  static exitRoom = asyncWrapper(async (req: MyRequest, res: Response) => {
    const exitInputs = plainToClass(ExitRoomInputs, req.body);
    const validatorError = await validate(exitInputs, {
      validationError: { target: false },
    });
    if (validatorError.length > 0)
      throw new ApiError(
        validatorError[0].constraints[
          Object.keys(validatorError[0].constraints)[0]
        ],
        500
      );
    const { roomId } = exitInputs;
    const room = await Room.findById(roomId);
    if (room) {
      room.players = room.players.filter((playerId) => {
        return playerId != <Object>req.playerId;
      });
      await room.save();
      return res.json({
        status: true,
        data: null,
      });
    }
    throw new ApiError("this room is not exist", 500);
  });
  static deleteRoom = asyncWrapper(async (req: MyRequest, res: Response) => {
    const deleteInputs = plainToClass(DeleteRoomInputs, req.body);
    const validatorError = await validate(deleteInputs, {
      validationError: { target: false },
    });
    if (validatorError.length > 0)
      throw new ApiError(
        validatorError[0].constraints[
          Object.keys(validatorError[0].constraints)[0]
        ],
        500
      );
    const { roomId } = deleteInputs;
    const room = await Room.findById(roomId);
    if (room) {
      if (room.owner == <Object>req.playerId) {
        await room.deleteOne();
        return res.status(202).json({ status: true, data: null });
      }
      throw new ApiError("You are not the owner", 500);
    }
    throw new ApiError("this room is not exist", 500);
  });
  static getAllRooms = asyncWrapper(async (req: MyRequest, res: Response) => {
    const rooms = await Room.find({}, { roomName: true, _id: true });
    res.json({
      status: true,
      data: { rooms },
    });
  });
}
