const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/message");

//RUN EXPRESS SERVER
const app = express();
//RUN SERVER USING HTTP MODULE REQUIRED BY SOCKET.IO
const server = http.createServer(app);
//INIT SOCKET.IO
const io = socketio(server);

// SET STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

//CHAT BOT NAME
let chatBot = "ChatBot";

//RUN WHEN CLIENT CONNECTS
io.on("connection", (socket) => {
	//message only to me when I connect
	socket.emit("greyMessage", formatMessage("Zakaria", "Welcome to Chat.io!"));

	//message to other users when I connect
	socket.broadcast.emit(
		"greyMessage",
		formatMessage(chatBot, "User has joined the chat")
	);

	//EMIT ONE MESSAGE TO ME AND ONE TO EVERYBODY ELSE
	socket.on("chatMessage", (msg) => {
		socket.broadcast.emit("greyMessage", formatMessage("USER", msg));
		socket.emit("blueMessage", formatMessage("USER", msg));
	});

	//message to other users when I disconnect
	socket.on("disconnect", () => {
		io.emit("greyMessage", formatMessage(chatBot, "User has left the chat"));
	});
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
