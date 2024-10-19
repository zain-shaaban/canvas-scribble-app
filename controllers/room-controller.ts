import { Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import ApiError from "../utils/ApiError";
import asyncWrapper from "../middlewares/asyncWrapper";
import jwt from "jsonwebtoken";
import { CreateRoomInputs, JoinRoomInputs, Room } from "../dto/room-dto";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { players } from "../models/socket";

interface MyRequest extends Request {
  playerId: string;
}

type RoomObject = {
  [key: string]: Room;
};
let rooms: RoomObject = {};

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
    let { roomName, maxPlayers, rounds, password, isPrivate } = createInputs;
    const roomId = uuidv4();
    password = bcrypt.hashSync(password, bcrypt.genSaltSync());
    rooms[roomId] = new Room(
      roomId,
      roomName,
      password,
      maxPlayers,
      rounds,
      isPrivate
    );
    players[roomId] = [];
    const token = jwt.sign(
      { roomId, playerId: req.playerId },
      process.env.JWT_ROOM,
      {
        expiresIn: 1000 * 60 * 60,
      }
    );
    res.json({
      status: true,
      data: { roomToken: token },
    });
    const intervalID = setInterval(() => {
      if (players[roomId].length > 0) {
        clearInterval(intervalID);
        clearTimeout(timeoutID);
      }
    }, 1000);
    const timeoutID = setTimeout(() => {
      clearInterval(intervalID);
      delete rooms[roomId];
    }, 10000);
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
    const MyRoom = rooms[roomId];
    if (MyRoom) {
      if (MyRoom.isPrivate) {
        if (bcrypt.compareSync(password, MyRoom.password)) {
          const token = jwt.sign(
            { roomId: MyRoom.roomId, playerId: req.playerId },
            process.env.JWT_ROOM,
            {
              expiresIn: 1000 * 60 * 60,
            }
          );
          return res.json({
            status: true,
            data: { roomToken: token },
          });
        }
        throw new ApiError("wrong Password", 500);
      }
      const token = jwt.sign(
        { roomId: MyRoom.roomId, playerId: req.playerId },
        process.env.JWT_ROOM,
        {
          expiresIn: 1000 * 60 * 60,
        }
      );
      return res.json({
        status: true,
        data: { roomToken: token },
      });
    }
    throw new ApiError("this room is not exist", 500);
  });
  static getAllRooms = asyncWrapper(async (req: MyRequest, res: Response) => {
    const hidePasswords = (obj: Object) => {
      const result = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const { password, ...rest } = obj[key];
          result[key] = rest;
        }
      }
      return result;
    };
    const roomsWithoutPassword = hidePasswords(rooms);
    res.json({
      status: true,
      data: { rooms: roomsWithoutPassword },
    });
  });
}

export { rooms };
