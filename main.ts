import express, { Request, Response } from "express";
import http from "http";
import { Server as SocketIoServer } from "socket.io";
import { getUsers, addUser, deleteUser } from "./utils/users";
const app = express();

const server = http.createServer(app);
const io = new SocketIoServer(server);

io.on("connection", (socket) => {
  socket.on("name", (message: string) => {
    addUser(message, socket.id);
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
