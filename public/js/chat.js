const socket = io();

function scrollToBottom(){
    var messages = jQuery('#messages');
    var newMessage= messages.children('li:last-child');

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMesssageHeight = newMessage.prev().innerHeight();

    if(clientHeight+scrollTop+newMessageHeight+lastMesssageHeight >= scrollHeight){
        messages.$scrollTop(scrollHeight);
    }
}

socket.on('connect', function() {
    const params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if(err){
            alert(err);
            window.location.href = '/'
        }
        else {
            console.log('no error');
        }
    })
});

socket.on('disconnect', function()  {
    console.log('Disconnected from server');
});


socket.on('newMessage', function (newMessage) {
    const formattedTime = moment(newMessage.createdAt).format('h:mm a');
    const li = jQuery('<li></li>');
    li.text(`${newMessage.from} ${formattedTime}: ${newMessage.text}`);
   jQuery('#messages').append(li);
    scrollToBottom();

});

socket.on('newLocationMessage', function (message) {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    const li = jQuery('<li><li/>');
    const a = jQuery('<a target="_blank">My Current Location</a>');
    li.text(`${message.from} ${formattedTime}: `);

   a.attr('href', message.url);
   li.append(a);
   jQuery('#messages').append(li);
   scrollToBottom();

});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    const messageTextbox = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('');
    });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function () {
   if(!navigator.geolocation){
       return alert('Geolocation not supported by your browser');
   }

   locationButton.attr('disabled', 'disabled').text('Sending location...');
   navigator.geolocation.getCurrentPosition(function (position) {
       locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
   }, function () {
       locationButton.removeAttr('disabled').text('Send location');
       alert('Unable to fetch location');
   });
});