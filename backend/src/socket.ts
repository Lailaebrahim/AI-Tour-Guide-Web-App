import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
    const sessionId = socket.handshake.query.sessionId;
    console.log(`User connected with sessionId: ${sessionId}`);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});