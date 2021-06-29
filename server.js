//io.emit ==> send to everyone
//socket.emit ==> send to the one socket itself sending
//socket.broadcast.emit ==> send to the all sockets but itself sending

let app = require('express')();
let express = require('express');
let http = require('http').createServer(app)
let io = require('socket.io')(http)
let port = 3000
let  users = {}
let chatHistory = []

app.use('/ressources',express.static(__dirname + '/js'));
app.use('/css',express.static(__dirname + '/css'));
app.use('/images',express.static(__dirname + '/img'));

app.get('/',  (req, res) => {
  res.sendFile(__dirname + '/game.html');
});

io.on('connection',(socket) => {
    users[socket.id] = socket.id

    console.log("a user is connected");
    socket.emit("welcome",{
      name : users[socket.id],
      msg : `Welcome to this chat, you're connected as ${users[socket.id]} if you want to change it just type #changeName and your new name example: #changeName toto `
    })
    socket.broadcast.emit("user connected", users[socket.id])
    // send history on connection 
    socket.emit("loadHistory", chatHistory);
    //add itself to the list of usrs online
    io.emit("update list users", users)

    //sending message
    socket.on('chat message',(xMsg) => {
      if(hasFilter(socket.id,xMsg))return;

      let usr = users[socket.id]
      io.emit("chat message", {msg : xMsg, name : usr})      
      saveInHistory(Date.now(),usr,xMsg)
    })

    socket.on('change username', xName => {
      changeName(socket.id,xName)
    })

    //change color
    socket.on('change color',(xColor) => {
      io.emit("change color", xColor);
    })

    socket.on('disconnect', () => {
      socket.emit("user disconnected","You")
      socket.broadcast.emit("user disconnected", users[socket.id])
      delete users[socket.id]
      //delete itself to the list of usrs online
      io.emit("update list users", users)
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

changeName = (xId,xName) =>{
  console.log("newName : "+xName);
  users[xId] = xName
  io.emit("change username", xName)
  //update itself to the list of usrs online
  io.emit("update list users", users)
}

hasFilter = (xId,xMsg) => {
  console.log("xMsg : " + xMsg);
  console.log("start : " + xMsg.startsWith("#changeName "));
  
  if(xMsg.startsWith("#changeName ")){
    let newName = xMsg.substring("#changeName ".length,xMsg.length)
    changeName(xId,newName)
    return true;
  }
  
  return false;
}


http.listen(port, () => {
  console.log('listening on :'+port);
});