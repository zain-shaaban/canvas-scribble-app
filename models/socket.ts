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

const getPlayersNames = async (roomId: string) => {
  const allPlayers = rooms[roomId].players;
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
      if (rooms[this.roomId].players.length < rooms[this.roomId].maxPlayers) {
        if (
          !rooms[this.roomId].players.some((player) => {
            return player.playerId == this.playerId;
          })
        )
          rooms[this.roomId].players.push({
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
  async sendMessage() {
    const { username } = await Player.findById(this.playerId, "username -_id");
    this.socket.on("sendMessage", (message) => {
      this.io.to(this.roomId).emit("send", { playerName: username, message });
    });
  }
  exitRoom() {
    this.socket.on("disconnect", async () => {
      rooms[this.roomId].players = rooms[this.roomId].players.filter(
        (player) => {
          return player.socketId != this.socket.id;
        }
      );
      if (rooms[this.roomId].players.length > 0) {
        return this.io
          .to(this.roomId)
          .emit("players", await getPlayersNames(this.roomId));
      } else {
        delete rooms[this.roomId];
      }
    });
  }
}
