var express = require('express');
var path = require('path');
var app = express();

// Define the port to run on
app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'public')));

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});

/*

var express = require('express');
var app = express();
app.use(express.static('public'));
var http = require('http').Server(app);
// var io = require('socket.io')(http);

// app.use(express.static(__dirname));
// app.use(express.static('assets'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });
// });

http.listen(8000, function(){
  console.log('listening on *:8000');
});

*/