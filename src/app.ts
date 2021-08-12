import express from "express";
import cors from "cors";
import { EMIT_NAME_UPDATE_PLAYER_POSITION } from "./constants";

const socket = require("socket.io");
const app = express();
app.use(express());

const port = 8000;

app.use(cors());

var server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000", // TODO: Need to be changed before deploying
  },
});

//initializing the socket io connection
io.on("connection", (socket) => {
  console.log(`Player connected. PlayerId: ${socket.id}`);

  socket.on(
    EMIT_NAME_UPDATE_PLAYER_POSITION,
    (info: { x: Number; y: Number }) => {
      // Receive
      console.log(EMIT_NAME_UPDATE_PLAYER_POSITION, info);
      socket.broadcast.emit(EMIT_NAME_UPDATE_PLAYER_POSITION, {
        ...info,
        playerId: socket.id,
      });
    }
  );

  // TODO: Remove all the useless stuff

  //Test, receiving a message
  socket.on("hello", (text) => {
    // Receive
    console.log("Hello message received:", text);

    // Send
    // socket.emit("greetings", "a greeting");
    io.to(socket.id).emit("greetings", "a greeting!");
  });

  // A player leaves (closes the tab/browser)
  socket.on("disconnect", () => {
    // TODO
  });
});
