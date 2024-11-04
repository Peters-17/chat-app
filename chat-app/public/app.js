var socket = io();

var userlist = document.getElementById("active_users_list");
var roomlist = document.getElementById("active_rooms_list");
var message = document.getElementById("messageInput");
var sendMessageBtn = document.getElementById("send_message_btn");
var roomInput = document.getElementById("roomInput");
var createRoomBtn = document.getElementById("room_add_icon_holder");
var chatDisplay = document.getElementById("chat");

var currentRoom = "global";
var myUsername = "";

// Send message when "Send" button is clicked
sendMessageBtn.addEventListener("click", function () {
  socket.emit("sendMessage", message.value);
  message.value = "";  // Clear the input field after sending
});

// Send message with Enter key
message.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    sendMessageBtn.click();
  }
});

// Create a new room when "Create Room" button is clicked
createRoomBtn.addEventListener("click", function () {
  let roomName = roomInput.value.trim();
  if (roomName !== "") {
    socket.emit("createRoom", roomName); // Emit new room creation event
    roomInput.value = "";  // Clear the input field after creating room
  }
});


// Update chat with new messages or announcements
socket.on("updateChat", function (username, data) {
  if (username === "INFO") {
    chatDisplay.innerHTML += `<div class="announcement"><span>${data}</span></div>`;
  } else {
    chatDisplay.innerHTML += `<div class="message_holder ${username === myUsername ? "me" : ""}">
                                <div class="pic"></div>
                                <div class="message_box">
                                  <div id="message" class="message">
                                    <span class="message_name">${username}</span>
                                    <span class="message_text">${data}</span>
                                  </div>
                                </div>
                              </div>`;
  }
  chatDisplay.scrollTop = chatDisplay.scrollHeight; // Scroll to the newest message
});

// Update user list when users join or leave
socket.on("updateUsers", function (usernames) {
  userlist.innerHTML = "";
  for (var user in usernames) {
    userlist.innerHTML += `<div class="user_card">
                              <div class="pic"></div>
                              <span>${user}</span>
                            </div>`;
  }
});

// Update room list and mark the active room
socket.on("updateRooms", function (rooms, newRoom) {
  roomlist.innerHTML = "";
  for (var index in rooms) {
    roomlist.innerHTML += `<div class="room_card" id="${rooms[index].name}"
                                onclick="changeRoom('${rooms[index].name}')">
                                <div class="room_item_content">
                                    <div class="pic"></div>
                                    <div class="roomInfo">
                                    <span class="room_name">#${rooms[index].name}</span>
                                    <span class="room_author">${rooms[index].creator}</span>
                                    </div>
                                </div>
                            </div>`;
  }
  document.getElementById(currentRoom).classList.add("active_item"); // Highlight the current room
});

// Change room and load its chat history
function changeRoom(room) {
  if (room !== currentRoom) {
    chatDisplay.innerHTML = ""; // Clear chat display for new room
    socket.emit("updateRooms", room); // Emit room change event to server

    // Update current room state
    document.getElementById(currentRoom).classList.remove("active_item");
    currentRoom = room;
    document.getElementById(currentRoom).classList.add("active_item");
  }
}
