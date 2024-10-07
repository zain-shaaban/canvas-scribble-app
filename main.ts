import express, { Request, Response } from "express";
import http from "http";
import { Server as SocketIoServer } from "socket.io";
import { getUsers, addUser, deleteUser } from "./utils/users";
const app = express();

const server = http.createServer(app);
const io = new SocketIoServer(server);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

io.on("connection", (socket) => {
  socket.on("name", (message: string) => {
    console.log(message);
    addUser(message, socket.id);
    console.log(getUsers());
    io.emit("players", getUsers());
  });
  socket.on("disconnect", () => {
    deleteUser(socket.id);
    io.emit("players", getUsers());
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server Listining On Port ${PORT}`);
});
