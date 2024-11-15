const { connectionDb } = require('../config/mongodb.config')

const users = {}

const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id)

        socket.on('register', (userId) => {
            users[userId] = socket.id
            console.log(`User registered with ID: ${userId} and socket ID: ${socket.id}`)
        })

        socket.on('sendMessage', async ({ recipientId, message }) => {
            console.log('Incoming sendMessage payload:', { recipientId, message })

            if (!message || !message.sender || !message.text) {
                console.error('Invalid message payload:', { recipientId, message })
                return
            }

            try {
                const db = await connectionDb()
                const chatCollection = db.collection('chats')

                const chatDocument = {
                    sender: message.sender,
                    recipient: recipientId,
                    text: message.text,
                    timestamp: new Date(),
                }

                await chatCollection.insertOne(chatDocument)

                const recipientSocketId = users[recipientId]
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('receiveMessage', chatDocument)
                    console.log(`Message sent to ${recipientId}:`, message)
                } else {
                    console.log('Recipient not connected')
                }
            } catch (error) {
                console.error('Error saving chat to DB:', error)
            }
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id)

            for (const [userId, socketId] of Object.entries(users)) {
                if (socketId === socket.id) {
                    delete users[userId]
                    break
                }
            }
        })
    })
}

module.exports = initializeSocket
