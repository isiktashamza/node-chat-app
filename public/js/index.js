var socket = io();
socket.on('connect', function() {
    console.log('connected to server');

    socket.emit('createEmail', {
        to: 'jen@example.com',
        text: 'Hey. This is Andrew.'
    });
});

socket.on('newEmail', function (newEmail) {
   console.log(newEmail);
});
socket.on('disconnect', function()  {
    console.log('Disconnected from server');
});