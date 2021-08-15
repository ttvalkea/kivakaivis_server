import express from "express";
import cors from "cors";
import {
  EMIT_NAME_REMOVE_PLAYER,
  EMIT_NAME_SET_OTHER_PLAYERS_LIST,
  EMIT_NAME_START_NEW_GAME,
  EMIT_NAME_UPDATE_PLAYER_POSITION,
} from "./constants";
import { mapTileType, PlayerType } from "./types";
import { generateObstaclesForNewGame } from "./gameMechanics";

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

// Persistent values
let players: PlayerType[] = [];
let mapTiles: mapTileType[] = [];

//initializing the socket io connection
io.on("connection", (socket) => {
  // When a player joins, first send the existing players list to this player and then add that playerId to the player list
  console.log(`Player connected. PlayerId: ${socket.id}`);
  io.to(socket.id).emit(EMIT_NAME_SET_OTHER_PLAYERS_LIST, players);
  players.push({ playerId: socket.id, x: 0, y: 0 });

  // A player leaves (closes the tab/browser)
  socket.on("disconnect", () => {
    // When a player leaves, remove that playerId from the player list and emit that player's id to all remaining players
    players = players.filter((x) => x.playerId !== socket.id);
    socket.broadcast.emit(EMIT_NAME_REMOVE_PLAYER, socket.id);
  });

  // Player moves
  socket.on(
    EMIT_NAME_UPDATE_PLAYER_POSITION,
    (info: { x: number; y: number }) => {
      // Receive
      console.log(EMIT_NAME_UPDATE_PLAYER_POSITION, info);

      // Update player position in player list
      const playerInPlayersList = players.find((x) => x.playerId === socket.id);
      if (playerInPlayersList) {
        playerInPlayersList.x = info.x;
        playerInPlayersList.y = info.y;
      }

      socket.broadcast.emit(EMIT_NAME_UPDATE_PLAYER_POSITION, {
        ...info,
        playerId: socket.id,
      });
    }
  );

  // A new game starting request
  socket.on(EMIT_NAME_START_NEW_GAME, () => {
    // When a player requests a new game start, generate a new map. The position of all players in the lobby is done in the frontend upon receiving the new map.
    mapTiles = generateObstaclesForNewGame();
    io.emit(EMIT_NAME_START_NEW_GAME, mapTiles);
  });
});
