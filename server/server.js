const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
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


    socket.on('join', (params,callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('name and room name are required');
        }

        callback()
    });

    socket.on('createMessage', (message, callback) => {
       console.log(message);
       io.emit('newMessage', generateMessage(message.from,message.text));
       callback();
    });

    socket.on('createLocationMessage', (coords)=> {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log('the user was disconnected');
    });

});


server.listen(port, () => {
    console.log(`server is up on port ${port}`);
});