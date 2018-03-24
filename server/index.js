let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let moment =  require('moment');
let timeout = false;
//let now = moment().millisecond();
 
io.on('connection', (socket) => {
  
  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.nickname, event: 'left'});   
  });
 
  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    io.emit('users-changed', {user: nickname, event: 'joined'});    
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});    
  });
  //client emits 'typing' broadcast it
  //note: I think i need to pass the time to this function to get now
  socket.on('typing', (now) => {
    console.log(socket.nickname + " is typing...");
    io.emit('isTyping', {nickname: socket.nickname, status: socket.nickname + " is typing..."});
    if (timeout === false) {
      setTimeout(stopTyping, 2000, socket.nickname); 
      timeout = true;   
    }
  });
  /* when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', (stopTyping) => {
    io.emit('stop typing', {user: socket.nickname, event: 'stopTyping'});
  });
  */
});
 
var port = process.env.PORT || 3001;
 
http.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});
/*
function compareTimes(now) {
  var delta = now - then;
  if (delta > 2000) {
    return true;
  }
  else return false;
}
*/
function stopTyping(nickname) {
  io.emit('isTyping', {nickname: nickname, status: ""});
  console.log("Stopped typing.");
  timeout = false;
}
