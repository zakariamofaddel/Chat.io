const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

//RUN EXPRESS SERVER
const app = express();
//RUN SERVER USING HTTP MODULE REQUIRED BY SOCKET.IO
const server = http.createServer(app);
//INIT SOCKET.IO
const io = socketio(server);

// SET STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

//RUN WHEN CLIENT CONNECTS
io.on("connection", (socket) => {
	//message only to me when I connect
	socket.emit("greyMessage", "Welcome to Chat.io");

	//message to other users when I connect
	socket.broadcast.emit("greyMessage", "User has joined the chat");

	//message to other users when I disconnect
	socket.on("disconnect", () => {
		io.emit("greyMessage", "User has left the chat");
	});

	socket.on("chatMessage", (msg) => {
		socket.broadcast.emit("greyMessage", msg);
		socket.emit("blueMessage", msg);
	});
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
