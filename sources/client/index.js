import { io } from "socket.io-client"

const messageForm = document.getElementById("message")

if (!messageForm) {
    throw new Error("Message form not found")
}

const socket = io("ws://localhost:9000")

socket.on("connect", () => {
    const identifierTitle = document.getElementById("identifier")

    if (!identifierTitle) {
        throw new Error("Identifier title not found")
    }

    identifierTitle.innerText = `Client #${socket.id}`
})

socket.on("message", ({client, content}) => {
    const messagesContainer = document.getElementById("messages")

    if (!messagesContainer) {
        throw new Error("Messages container not found")
    }

    const messageParagraph = document.createElement("p")

    messageParagraph.innerText = `[#${client}] ${content}`

    messagesContainer.appendChild(messageParagraph)
})

messageForm.addEventListener("submit", event => {
    const contentInput = event.target.content
    const clientInput = event.target.client
    const messagesContainer = document.getElementById("messages")

    if (!contentInput) {
        throw new Error("Content input not found")
    }

    if (!clientInput) {
        throw new Error("Client input not found")
    }
    
    if (!messagesContainer) {
        throw new Error("Messages container not found")
    }

    const content = contentInput.value
    const client = clientInput.value
    const messageParagraph = document.createElement("p")

    messageParagraph.innerText = `[#${socket.id}] ${content}`

    messagesContainer.appendChild(messageParagraph)

    socket.emit("message", {
        content,
        client
    })

    event.preventDefault()
})