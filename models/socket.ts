import { Socket, Server } from "socket.io";
import Room from "./room-model";

const getPlayersName = async (roomId: string) => {
  const room = await Room.findById(roomId, {
    players: true,
    _id: false,
  }).populate("players", "username -_id");
  return room.players;
};

export default class socketIO {
  constructor(private socket: Socket, private io: Server) {}
  async joinEvent() {
    const roomId = this.socket.handshake.query.roomId;
    this.socket.join(roomId);
    this.io.to(roomId).emit("players", await getPlayersName(<string>roomId));
  }
  sendMessage() {
    this.socket.on("sendMessage", (roomName, message) => {
      this.io.to(roomName).emit("send", message);
    });
  }
}
