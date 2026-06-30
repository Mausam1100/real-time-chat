import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

const roomUsers = new Map<string, Set<string>>()

io.on('connection', (socket) => {
    console.log(`User is connecting: ${socket.id}`)

    socket.on('join-room', (roomId) => {
        socket.join(roomId)
        if (!roomUsers.has(roomId)) {
            roomUsers.set(roomId, new Set())
        }
        roomUsers.get(roomId)!.add(socket.id)
        const size = roomUsers.get(roomId)!.size
        io.to(roomId).emit('room-users', size)
    })

    socket.on('chat', ({roomCode, message}) => {
        io.to(roomCode).emit('receive-message', {
            message,
            senderId: socket.id
        })
    })

    socket.on('leave-room', (roomId) => {
        socket.leave(roomId)
        const size = io.sockets.adapter.rooms.get(roomId)?.size || 0
        io.to(roomId).emit('room-users', size)
    })

    socket.on('disconnect', () => {
        for (const [roomId, users] of roomUsers.entries()) {
            if (users.has(socket.id)) {
                users.delete(socket.id)
                const size = users.size
                io.to(roomId).emit('room-users', size)
                if (users.size === 0) {
                    roomUsers.delete(roomId)
                }
            }
        }
    })
})

server.listen(8000, () => {
    console.log("Server is running!")
})