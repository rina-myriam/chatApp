import { io } from "socket.io-client";

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const socket = io("ws://localhost:9000");

const countUser = document.querySelector('.count-user');

let url = window.location.search;
let searchParams = new URLSearchParams(url);
let username = searchParams.get('pseudo');
let room = searchParams.get('room');

// Join chatRoom  
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
     outputRoomName(room);
     outputUsers(users);
     countUsers(users);
});
   
// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);

}

// Add room name to DOM
function outputRoomName(room) {
     roomName.innerHTML = room;
}

// Add users to DOM
function outputUsers(users) {
     console.log({users})
      userList.innerHTML = '';
      users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        li.innerHTML += `<span class="green-dot"></span>`;
        userList.appendChild(li);
     });
     
}
    
//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
     const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
     if (leaveRoom) {
          window.location = '../index.html';
     } else {
     }
});

// Count users
function countUsers(users) {
     countUser.innerHTML = users.length;
}
