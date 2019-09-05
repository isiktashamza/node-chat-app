const path = require('path');

const express = require('express');

const socketIO = require('socket.io');

const http = require('http');

const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000;


const app = express();

const server = http.createServer(app);

const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');


    socket.emit('newEmail', {
        from: 'abuzer@example.com',
        text: 'whaddya'
    });
    socket.on('disconnect', () => {
        console.log('the user was disconnected');
    });

    socket.on('createEmail', (newEmail) => {
       console.log(newEmail);
    });
});


server.listen(port, () => {
    console.log(`server is up on port ${port}`);
});