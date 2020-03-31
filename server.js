var express = require('express');
var socket = require('socket.io');
var request = require('request');
var app = express();
var server = app.listen( process.env.PORT || 8080);
app.use(express.static('public'));
console.log('Server listening on port 8080');
var io = socket(server);

io.sockets.on('connection', connection);

var text = {
    serverText: ''
};

function connection(socket){
    console.log('a new user with id ' + socket.id + " has entered");
    socket.emit('newUser', text.serverText); //doesnt work

    socket.on('text', handleTextSent);
    socket.on('compile', compileJava);

    function handleTextSent(data){
        text.serverText = data
        io.sockets.emit('text', data);
    }

    function compileJava(data){
        request.post({
            url : 'https://www.compilejava.net/',
            form : {
                respond : "respond",
                passargs : data.args,
                code : data.code
            }
        }, function(err, response, body) {
            console.log(body)
            socket.emit('compiled', JSON.parse(body).execsout);
        });
    }
}

