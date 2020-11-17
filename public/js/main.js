const chatForm = document.getElementById("chat-form");

//WE CAN USE THIS BECAUSE OF THE SCRIPT TAG IN chat.html
const socket = io();

//CATCH GREY MESSAGES
socket.on("greyMessage", (message) => {
	outputGreyMessage(message);
});

//CATCH BLUE MESSAGES
socket.on("blueMessage", (message) => {
	outputBlueMessage(message);
});

//MESSAGE SUBMIT
chatForm.addEventListener("submit", (e) => {
	e.preventDefault();

	//get chat message from DOM
	const msg = e.target.elements.msg.value;

	//emit chat message to server
	socket.emit("chatMessage", msg);

	//clear field
	chatForm.reset();
});

//OUTPUT GREY MESSAGE TO DOM FUNCTION
function outputGreyMessage(message) {
	const div = document.createElement("div");
	div.classList.add("chat-row");
	div.innerHTML = `
    <div class="bubble-left--container">
        <p class="meta">20.18</p>
        <h6 id="username">User</h6>
        <div class="chat-bubble chat-bubble--left">${message}</div>
    </div>`;

	document.querySelector(".chat-panel").appendChild(div);
}

//OUTPUT BLUE MESSAGE TO DOM FUNCTION
function outputBlueMessage(message) {
	const div = document.createElement("div");
	div.classList.add("chat-row");
	div.innerHTML = `
    <div class="bubble-right--container">
        <div class="chat-bubble chat-bubble--right">
        ${message}
        </div>
        <p class="meta">20.18</p>
    </div>`;

	document.querySelector(".chat-panel").appendChild(div);
}
