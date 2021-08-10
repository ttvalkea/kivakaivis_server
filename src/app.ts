// import express from "express";

// const app = express();
// const port = 3001;
// app.get("/", (req, res) => {
//   res.send("Response from kivakaivis_server");
// });
// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

import express from "express";
import cors from "cors";
const socket = require("socket.io");
const app = express();
app.use(express());

const port = 8000;

app.use(cors());

var server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const io = socket(server);

//initializing the socket io connection
io.on("connection", (socket) => {
  //for a new user joining the room
  socket.on("joinRoom", ({ userName, roomName }) => {
    //* create user
    const user = joinUser(socket.id, userName, roomName);
    console.log(socket.id, "=id");
    socket.join(user.room);

    //display a welcome message to the user who have joined a room
    socket.emit("message", {
      userId: user.id,
      username: user.userName,
      text: `Welcome ${user.userName}`,
    });

    //displays a joined room message to all other room users except that particular user
    socket.broadcast.to(user.room).emit("message", {
      userId: user.id,
      username: user.userName,
      text: `${user.userName} has joined the chat`,
    });
  });

  //user sending message
  socket.on("chat", (text) => {
    //gets the room user and the message sent
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", {
      userId: user.id,
      userName: user.userName,
      text: text,
    });
  });

  //when the user exits the room
  socket.on("disconnect", () => {
    //the user is deleted from array of users and a left room message displayed
    const user = userDisconnect(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        userId: user.id,
        username: user.username,
        text: `${user.username} has left the room`,
      });
    }
  });
});
