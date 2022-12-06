import { Server } from "socket.io"

const io = new Server(9000, {
    cors: {
        origin: "http://localhost:8000"
    }
})

io.on("connection", socket => {
    socket.on("message", ({client, content}) => {
        socket.to(client).emit("message", {
            client,
            content
        })
    })
})