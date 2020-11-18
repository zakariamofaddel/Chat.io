const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/message");
const {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
} = require("./utils/users");

//* RUN EXPRESS SERVER
const app = express();
//* RUN SERVER USING HTTP MODULE REQUIRED BY SOCKET.IO
const server = http.createServer(app);
//* INIT SOCKET.IO
const io = socketio(server);

//* SET STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

//* CHAT BOT NAME
let chatBot = "ChatBot";

//* RUN WHEN CLIENT CONNECTS
io.on("connection", (socket) => {
	socket.on("joinRoom", ({ username, room }) => {
		//create user object with userJoin function
		const user = userJoin(socket.id, username, room);

		//join user to the room using the room parameter
		socket.join(user.room);

		//message only to me when I connect
		socket.emit(
			"greyMessage",
			formatMessage(
				"Zakaria",
				`Hi ${user.username}, welcome to Chat.io! The room you are in is "${user.room}", enjoy your stay!`
			)
		);

		//message to other users when I connect
		socket.broadcast
			.to(user.room)
			.emit(
				"greyMessage",
				formatMessage(chatBot, `${user.username} has joined the chat`)
			);

		//emit to frontend the users list when a user connects
		io.to(user.room).emit("usersRoom", {
			room: user.room,
			users: getRoomUsers(user.room),
		});
	});

	//*EMIT ONE MESSAGE TO ME AND ONE TO EVERYBODY ELSE
	socket.on("chatMessage", (msg) => {
		const user = getCurrentUser(socket.id);

		socket.broadcast
			.to(user.room)
			.emit("greyMessage", formatMessage(user.username, msg));
		socket.emit("blueMessage", formatMessage(user.username, msg));
	});

	//message to other users when I disconnect
	socket.on("disconnect", () => {
		//returns a user the matches the socket.id we passed in the function
		const user = userLeave(socket.id);

		//check if user exists and if exists:
		if (user) {
			io.to(user.room).emit(
				"greyMessage",
				formatMessage(chatBot, `${user.username} has left the chat`)
			);

			//emit to frontend the users list when a user disconnects
			io.to(user.room).emit("usersRoom", {
				room: user.room,
				users: getRoomUsers(user.room),
			});
		}
	});
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
