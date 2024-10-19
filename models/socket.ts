import { Socket, Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
import { rooms } from "../controllers/room-controller";
import Player from "./player-model";

export interface RoomAuthentication {
  iat: number;
  exp: number;
  roomId: string;
  playerId: string;
}
type roomPlayers = {
  [key: string]: { playerId: string; socketId: string }[];
};

let players: roomPlayers = {};
export { players };

const getPlayersNames = async (roomId: string) => {
  const allPlayers = players[roomId];
  let ids: Object[] = [];
  for (let player of allPlayers) {
    ids.push(Object(player.playerId));
  }
  const allPlayersNames = await Player.find(
    { _id: { $in: ids } },
    "username -_id"
  );
  return allPlayersNames;
};
export default class socketIO {
  constructor(
    private socket: Socket,
    private io: Server,
    private roomId: string,
    private playerId: string
  ) {}
  async joinEvent() {
    if (rooms[this.roomId]) {
      if (players[this.roomId].length < rooms[this.roomId].maxPlayers) {
        players[this.roomId].push({
          playerId: this.playerId,
          socketId: this.socket.id,
        });
        this.socket.join(this.roomId);
        return this.io
          .to(this.roomId)
          .emit("players", await getPlayersNames(this.roomId));
      }
      return this.socket.emit("error", "room is full of players");
    }
    this.socket.emit("error", "this room is not exist");
  }
  sendMessage() {
    this.socket.on("sendMessage", (message) => {
      this.io.to(this.roomId).emit("send", message);
    });
  }
  exitRoom() {
    this.socket.on("disconnect", async (reason) => {
      players[this.roomId] = players[this.roomId].filter((player) => {
        return player.socketId != this.socket.id;
      });
      if (players[this.roomId].length > 0) {
        return this.io
          .to(this.roomId)
          .emit("players", await getPlayersNames(this.roomId));
      } else {
        delete players[this.roomId];
        delete rooms[this.roomId];
      }
    });
  }
}
