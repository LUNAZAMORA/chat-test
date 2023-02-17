"use strict";
// Import libraries
const path = require("path");
const  express = require("express");
const app = express() // Create express app and save it to app variable

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const { Socket } = require("dgram");
const io = new Server(server);

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

io.on("connection", (socket) => {
    console.log("A user connected");
    console.log("id?", socket.id);
    socket.broadcast.emit("connect-notify", socket.id + " just connected");

    socket.on("disconnect", () => {
        console.log("User disconnected");
        socket.broadcast.emit("disconnect-notify", socket.id + " just disconnected");
    });

    socket.on("chat message", (msg) => {
        console.log('message: ' + msg);
        //io.emit('chat message', msg);
        //const id = JSON.stringify(socket.id);
        console.log("msg: ", msg);
        socket.broadcast.emit("chat message", socket.id + ": "+ msg);
    });
});

server.listen(3000, ()=>{
    console.log("Listening on: *3000");
});