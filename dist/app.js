"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const constants_1 = require("./constants");
const gameMechanics_1 = require("./gameMechanics");
const socket = require("socket.io");
const app = express_1.default();
app.use(express_1.default());
const port = 8000;
app.use(cors_1.default());
var server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
const io = socket(server, {
    cors: {
        origin: "http://localhost:3000", // TODO: Need to be changed before deploying
    },
});
let players = [];
//initializing the socket io connection
io.on("connection", (socket) => {
    // When a player joins, first send the existing players list to this player and then add that playerId to the player list
    console.log(`Player connected. PlayerId: ${socket.id}`);
    io.to(socket.id).emit(constants_1.EMIT_NAME_SET_OTHER_PLAYERS_LIST, players);
    players.push({ playerId: socket.id, x: 0, y: 0 });
    // A player leaves (closes the tab/browser)
    socket.on("disconnect", () => {
        // When a player leaves, remove that playerId from the player list and emit that player's id to all remaining players
        players = players.filter((x) => x.playerId !== socket.id);
        socket.broadcast.emit(constants_1.EMIT_NAME_REMOVE_PLAYER, socket.id);
    });
    // Player moves
    socket.on(constants_1.EMIT_NAME_UPDATE_PLAYER_POSITION, (info) => {
        // Receive
        console.log(constants_1.EMIT_NAME_UPDATE_PLAYER_POSITION, info);
        // Update player position in player list
        const playerInPlayersList = players.find((x) => x.playerId === socket.id);
        if (playerInPlayersList) {
            playerInPlayersList.x = info.x;
            playerInPlayersList.y = info.y;
        }
        socket.broadcast.emit(constants_1.EMIT_NAME_UPDATE_PLAYER_POSITION, Object.assign(Object.assign({}, info), { playerId: socket.id }));
    });
    // A new game starting request
    socket.on(constants_1.EMIT_NAME_START_NEW_GAME, () => {
        // When a player requests a new game start, generate a new map. The position of all players in the lobby is done in the frontend upon receiving the new map.
        const obstacles = gameMechanics_1.generateObstaclesForNewGame();
        io.emit(constants_1.EMIT_NAME_START_NEW_GAME, obstacles);
    });
});
//# sourceMappingURL=app.js.map