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
    serverText: '',
    serverLines: []
};

function connection(socket){
    console.log('a new user with id ' + socket.id + " has entered");
    socket.emit('newUser', text.serverText); //doesnt work

    socket.on('compile', compileJava);
    socket.on('changeObj', changeObjHandler);

    function changeObjHandler(changeObj) {
        var lines = changeObj.lines.split("\n")
        for (var i = changeObj.from; i <= changeObj.to; i++) {
            if (lines[i]!=text.serverLines[i]){
                text.serverLines[i]=lines[i];
            }
        }
        text.serverText = text.serverLines.join("\n");
        io.sockets.emit('text', text.serverText);
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

