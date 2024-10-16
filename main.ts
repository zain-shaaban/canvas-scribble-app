import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
import http from "http";
import { Server as SocketIoServer } from "socket.io";
import socketIO from "./models/socket";
import playerRouter from "./routes/player-route";
import errorHandler from "./middlewares/error-handler";
import roomRouter from "./routes/room-route";
import swaggerUI from "swagger-ui-express";
import swaggerDoc from "./utils/swaggerDoc";
import cors from "cors";

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("DB connected successfully..."))
  .catch((err: any) => console.log(err.message));

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

const server = http.createServer(app);
const io = new SocketIoServer(server);

io.on("connection", (socket) => {
  const socketObject = new socketIO(socket, io);
  socketObject.joinEvent();
  socketObject.sendMessage();
});

app.use("/api/player", playerRouter);
app.use("/api/room", roomRouter);
app.use("*", (req, res) => {
  res.send("this root is not exist");
});
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server Listining On Port ${PORT}`);
});
