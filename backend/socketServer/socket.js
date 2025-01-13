
const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);


const socketIo = require('socket.io');
let io;

const socketUsers = new Map();

const socketHandler = (server) => {
    io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('registerUser', (userId) => {
            socketUsers.set(userId, socket.id);
        });

        socket.on('disconnect', () => {
            socketUsers.forEach((value, key) => {
                if (value === socket.id) {
                    socketUsers.delete(key);
                }
            });
            console.log('Client disconnected');
        });
    });
};

const getReceiverSocketId = (receiverId) => {
    return socketUsers.get(receiverId) || null;
};

module.exports = { socketHandler, getReceiverSocketId, io };
