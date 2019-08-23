//io.emit ==> send to everyone
//socket.emit ==> send to the one socket itself sending
//socket.broadcast.emit ==> send to the all sockets but itself sending

let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let port = 3000
let  users = {}
let chatHistory = []

app.get('/',  (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection',(socket) => {
  
    console.log("a user is connected");
    users[socket.id] = socket.id
    socket.emit("welcome",`Welcome to this chat, you're connected as ${users[socket.id]}`)
    socket.broadcast.emit("user connected", users[socket.id])
    // send history on connection 
    socket.emit("loadHistory", chatHistory);

    //sending message
    socket.on('chat message',(xMsg) => {
      let usr = users[socket.id]
      io.emit("chat message", {msg : xMsg, name : usr})      
      saveInHistory(Date.now(),usr,xMsg)
    })

    //change color
    socket.on('change color',(clr) => {
      io.emit("change color", clr);
    })
    
    socket.on('disconnect', () => {
        console.log("user disconnected", users[socket.id])
    })
})

saveInHistory = (xId,xName,xMsg) => {
  if(chatHistory.length>10)chatHistory.shift()
  chatHistory.push({
    id:xId,
    usr: xName,
    msg:xMsg
  })
  console.log("saving:");
  
  console.log(chatHistory);
}

http.listen(port, () => {
  console.log('listening on :'+port);
});