import { Server } from "socket.io";
import moment from "moment";

// Join user to chat
function newUser(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('H:mm a')
  };
}

// Get current user
function getActiveUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function exitRoom(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getIndividualRoomUsers(room) {
  return users.filter(user => user.room === room);
}

const io = new Server(9000, {
    cors: {
        origin: "http://localhost:8000"
    }
})


io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = newUser(socket.id, username, room);

    socket.join(user.room);

     socket.emit('message', formatMessage("ChatApp", 'Messages are limited to this room! '));

     
    // Broadcast everytime users connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage("ChatApp", `${user.username} has joined the room`)
      );

    // Current active users and room name
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getIndividualRoomUsers(user.room)
    });

    // get all clients connected
    // console.log(Object.keys(io.engine.clients));


  });

  // Listen for client message
  socket.on('chatMessage', msg => {
    const user = getActiveUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  socket.on('disconnect', () => {
    const user = exitRoom(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage("ChatApp", `${user.username} has left the room`)
      );
  
      // Current active users and room name
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getIndividualRoomUsers(user.room)
        });
      }
  
    });

    // Message to individual user
    socket.on("messageToUser", ({client, content}) => {
      socket.to(client).emit("messageToUser", {
          client,
          content
      })
  });
    
})