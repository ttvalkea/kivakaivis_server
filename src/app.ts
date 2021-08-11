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

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000", // TODO: Need to be changed before deploying
  },
});

const users = [];
// joins the user to the specific chatroom
export function joinUser(id, userName, room) {
  const user = { id, userName, room };

  users.push(user);
  console.log(users, "users");

  return user;
}

console.log("user out", users);

// Gets a particular user id to return the current user
export function getCurrentUser(id) {
  return users.find((u) => u.id === id);
}

// called when the user leaves the chat and its user object deleted from array
export function userDisconnect(id) {
  const index = users.findIndex((u) => u.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

//initializing the socket io connection
io.on("connection", (socket) => {
  console.log("connected");
  console.log(socket.id);
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

  //Test, receiving a message
  socket.on("hello", (text) => {
    // Receive
    console.log("Hello message received:", text);

    // Send
    // socket.emit("greetings", "a greeting");
    io.to(socket.id).emit("greetings", "a greeting!");
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
