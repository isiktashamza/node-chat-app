var socket = io();
socket.on('connect', function() {
    console.log('connected to server');


});

socket.on('newMessage', function (newMessage) {
   console.log(newMessage);
   var li = jQuery('<li></li>');
   li.text(`${newMessage.from}: ${newMessage.text}`);
   jQuery('#messages').append(li);
});
socket.on('disconnect', function()  {
    console.log('Disconnected from server');
});

socket.emit('createMessage', {
    from: 'Frank',
    text: 'Hi'
}, function() {
    console.log('Got it');
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function () {
        
    });

});