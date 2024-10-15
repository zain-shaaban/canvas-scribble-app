import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

interface PlayerDoc extends Document {
  email: string;
  username: string;
  password: string;
  Auth(password:string):boolean
}

const playerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

playerSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
  next();
});

playerSchema.method("Auth", function (password) {
  return bcrypt.compareSync(password, this.password);
});

export default mongoose.model<PlayerDoc>("Player", playerSchema);
