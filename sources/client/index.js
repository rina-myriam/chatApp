import { io } from "socket.io-client";

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const f = document.getElementById("chatspace");
const messageUserForm = document.getElementById("messageUser");

const socket = io("ws://localhost:9000");
const maxUsers = 4 ;

const countUser = document.querySelector('.count-user');

// Check users in room and limit to 2
socket.on('roomUsers', ({ room, users }) => {
     if (users.length > maxUsers) {
          alert('Room is full');
          window.location = '../index.html';
     }
});

let url = window.location.search;
let searchParams = new URLSearchParams(url);
let username = searchParams.get('pseudo');
let room = searchParams.get('room');


socket.on("connect", () => {
     const identifierTitle = document.getElementById("identifier")
 
     identifierTitle.innerText = `Client #${socket.id}`
 });
 //celui vers qui on envoie recevra 
 socket.on("messageToUser", ({client, content}) => {
     const messagesContainer = document.getElementById("messagesUser")
 
     const messageParagraph = document.createElement("p");
     
     let idConversation = client; 
     console.log(idConversation);  
      
     //const containerConversation = document.getElementById(idConversation);

     //messageParagraph.innerText = `[#${client}] ${content}`;
     messageParagraph.innerText = `[#${client}] a dit: ${content}`;
     messagesContainer.appendChild(messageParagraph)
 });

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


//Sender part dialogue
messageUserForm.addEventListener("submit", event => {
     const contentInput = event.target.content;
     const clientInput = event.target.client;
     const messagesContainer = document.getElementById("messagesUser");
     const content = contentInput.value;
     const client = clientInput.value;
     const messageParagraph = document.createElement("p");
     let convUser;

     if(document.getElementById(client)){

          convUser = document.getElementById(client)

     } else {
          
          convUser = document.createElement("div");
          convUser.setAttribute("id", client);
          convUser.classList.add("conversation");
          
     }
     messageParagraph.innerText = `Vous: ${content}`
     convUser.appendChild(messageParagraph);
     messagesContainer.appendChild(convUser);
 
     socket.emit("messageToUser", {
         content,
         client
     })
 
     event.preventDefault()
 })

// Count users
function countUsers(users) {
     countUser.innerHTML = users.length;
}

