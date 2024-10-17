import mongoose, { Document } from "mongoose";
interface RoomDoc extends Document {
  _id: string;
  roomName: string;
  maxPlayers: number;
  rounds: number;
  isPrivate: boolean;
  password: string;
  players: mongoose.Types.ObjectId[];
  owner: mongoose.Types.ObjectId;
  Auth(password: string): boolean;
}

import bcrypt from "bcryptjs";
const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  maxPlayers: {
    type: Number,
    default: 5,
  },
  rounds: {
    type: Number,
    default: 5,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  players: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Player",
    },
  ],
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "Player",
  },
});

roomSchema.method("Auth", function (password) {
  return bcrypt.compareSync(password, this.password);
});

export default mongoose.model<RoomDoc>("Room", roomSchema);
