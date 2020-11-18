const chatForm = document.getElementById("chat-form");
const chatPanel = document.querySelector(".chat-panel");
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users-list");

//*  GET USERNAME AND ROOM WITH qs LIBRARY
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

//* WE CAN USE THIS BECAUSE OF THE SCRIPT TAG IN chat.html
const socket = io();

//* EMIT EVENT WHEN USER JOINS ROOM
socket.emit("joinRoom", { username, room });

//* CATCH THE USERS ARRAY AND ROOM NAME SENT FROM SERVER
socket.on("usersRoom", ({ room, users }) => {
	outputRoomName(room);
	outputUsers(users);
});

//* CATCH GREY MESSAGES
socket.on("greyMessage", (message) => {
	outputGreyMessage(message);

	//scroll down on every new message received
	chatPanel.scrollTop = chatPanel.scrollHeight;
});

//* CATCH BLUE MESSAGES
socket.on("blueMessage", (message) => {
	outputBlueMessage(message);

	//scroll down on every new message received
	chatPanel.scrollTop = chatPanel.scrollHeight;
});

//* MESSAGE SUBMIT
chatForm.addEventListener("submit", (e) => {
	e.preventDefault();

	//get chat message from DOM
	const msg = e.target.elements.msg.value;

	//emit chat message to server
	socket.emit("chatMessage", msg);

	//clear field
	chatForm.reset();

	//keep focus on input field after you send message
	e.target.elements.msg.focus();
});

//* OUTPUT GREY MESSAGE TO DOM FUNCTION
function outputGreyMessage(message) {
	const div = document.createElement("div");
	div.classList.add("chat-row");
	div.innerHTML = `
    <div class="bubble-left--container">
		<div id="meta-username">
            <h6 id="username">${message.username}</h6>
            <p class="meta">${message.time}</p>
		</div>
		<div class="chat-bubble chat-bubble--left">${message.text}</div>
	</div>`;

	document.querySelector(".chat-panel").appendChild(div);
}

//* OUTPUT BLUE MESSAGE TO DOM FUNCTION
function outputBlueMessage(message) {
	const div = document.createElement("div");
	div.classList.add("chat-row");
	div.innerHTML = `
    <div class="bubble-right--container">
        <div class="chat-bubble chat-bubble--right">
        ${message.text}
        </div>
        <p class="meta">${message.time}</p>
    </div>`;

	document.querySelector(".chat-panel").appendChild(div);
}

//* OUTPUT ROOM NAME TO DOM
function outputRoomName(room) {
	roomName.innerText = room;
}

//* OUTPUT USERS LIST TO DOM
function outputUsers(users) {
	usersList.innerHTML = "";

	users.forEach((user) => {
		const div = document.createElement("div");
		div.id = "connected-user";
		div.classList.add("friend-drawer", "friend-drawer--onhover");

		div.innerHTML = `
		<div class="content-left">
			<img 
				class="profile-image"
				src="./imgs/profile-placeholder.png"
				alt="User Profile Image"
			/>
			<div class="text">
				<h6 id="username">${user.username}</h6>
			</div>
		</div>
		`;

		usersList.appendChild(div);
	});
}
