var express=require('express');
var app=express();
var server = require('http').createServer(app);
var io=require('socket.io').listen(server);

users=[];
connections = [];
server.listen(process.env.PORT || 3001);
console.log("server running");
app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
});

io.on('connection',function(socket){ //<-new syntax from docs
  connections.push(socket);
  console.log('connected %s sockets connected',connections.length);


  //disconnect
  socket.on('disconnect',function(data){
    //if(!socket.username) return;
    users.splice(users.indexOf(socket.username),1);
    updateUsernames();
    connections.splice(connections.indexOf(socket),1);
    console.log('disconnected: %s sockets connected',connections.length);
  });
  //send message
  socket.on('send message',function(data){
    console.log(data);
    //  io.emit('new message',{msg: data}); <- also valid
    io.sockets.emit('new message',{msg: data});
  });
  //new user
  socket.on('new user',function(data,callback){
    callback(true);
    socket.username=data;
    users.push(socket.username);
    updateUsernames();
  });
  function updateUsernames(){
    io.sockets.emit('get users',users);
  }

});
