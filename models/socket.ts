import { Socket, Server } from "socket.io";
import Room from "./room-model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export interface RoomAuthentication {
  iat: number;
  exp: number;
  roomId: string;
}

const getPlayersName = async (roomId: string) => {
  const room = await Room.findById(roomId, {
    players: true,
    _id: false,
  }).populate("players", "username -_id");
  return room.players;
};

export default class socketIO {
  constructor(
    private socket: Socket,
    private io: Server,
    private roomId: string
  ) {}
  async joinEvent() {
    this.socket.join(this.roomId);
    this.io
      .to(this.roomId)
      .emit("players", await getPlayersName(<string>this.roomId));
  }
  sendMessage() {
    this.socket.on("sendMessage", (message) => {
      this.io.to(this.roomId).emit("send", message);
    });
  }
}
