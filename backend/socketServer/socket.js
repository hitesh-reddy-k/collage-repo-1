
const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);


const socketIo = require('socket.io');
let io;

const socketUsers = new Map();

const socketHandler = (server) => {
    io = socketIo(server, {
        cors: {
            origin: [
                "https://collage-repo-1-qxtl.vercel.app",
                "https://collage-project-pearl.vercel.app",
                "https://collage-repo-1.vercel.app",
                "http://localhost:3000",
                "http://127.0.0.1:3000"
            ],
            credentials: true,
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('New client connected');
        }

        socket.on('registerUser', (userId) => {
            socketUsers.set(userId, socket.id);
        });

        socket.on('disconnect', () => {
            socketUsers.forEach((value, key) => {
                if (value === socket.id) {
                    socketUsers.delete(key);
                }
            });
            if (process.env.NODE_ENV === 'development') {
                console.log('Client disconnected');
            }
        });
    });
};

const getReceiverSocketId = (receiverId) => {
    return socketUsers.get(receiverId) || null;
};

module.exports = { socketHandler, getReceiverSocketId, io };
