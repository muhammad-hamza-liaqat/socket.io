require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const initializeSocket = require('./utils/socket.io')

const PORT = process.env.PORT || 8080

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

initializeSocket(io)

app.get('/', (req, res) => {
    res.send(`Server is running at http://localhost:${PORT}`)
})

server.listen(PORT, () => {
    console.warn(`Server is running at http://localhost:${PORT}`)
})
