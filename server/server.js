const path = require('path');

const express = require('express');

const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const http = require('http');

const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000;


const app = express();

const server = http.createServer(app);

const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));

    socket.broadcast.emit('newMessage',generateMessage('Admin', 'New user joined'));

    socket.on('disconnect', () => {
        console.log('the user was disconnected');
    });

    socket.on('createMessage', (message, callback) => {
       console.log(message);
       socket.broadcast.emit('newMessage', generateMessage(message.from,message.text));
       callback();
    });
});


server.listen(port, () => {
    console.log(`server is up on port ${port}`);
});