"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const constants_1 = require("./constants");
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
//initializing the socket io connection
io.on("connection", (socket) => {
    console.log(`Player connected. PlayerId: ${socket.id}`);
    socket.on(constants_1.EMIT_NAME_UPDATE_PLAYER_POSITION, (info) => {
        // Receive
        console.log(constants_1.EMIT_NAME_UPDATE_PLAYER_POSITION, info);
        socket.broadcast.emit(constants_1.EMIT_NAME_UPDATE_PLAYER_POSITION, Object.assign(Object.assign({}, info), { playerId: socket.id }));
    });
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
//# sourceMappingURL=app.js.map