init = () => {
    let socket = io();
    let _UserName = window.sessionStorage.getItem("usr")
    if(_UserName!=null){
        setUsername(_UserName)
    }
        

    // on ENTER pressed
    chatInput.addEventListener('keypress', (e) => {
        if(!e) e = window.event
        let keyCode = e.keyCode || e.which
        if(keyCode == "13"){
            sendMessage(chatInput.value)
            return false
        }
    })
    // on button Send pressed
    chatBtn.addEventListener("click", () => {
        sendMessage(chatInput.value)
    })

    // on button change color pressed
    changeColorBtn.addEventListener("click", () => {
        changeColor()
    })

// --------SENDING REQUESTS----------------- //
 sendMessage = msg =>{
    socket.emit('chat message', msg);
    chatInput.value = ""
 }
 setUsername = usr => {
     socket.emit("change username", usr)
 }
 changeColor = () => {
    socket.emit('change color', "red");
 }
// --------END SENDING REQUESTS----------------- //


// --------RECEIVING REQUESTS----------------- //

    socket.on("welcome", (data) => {
        if(_UserName!=null){
            setUsername(data.name)
            addMessage(`Bonjour ${data.name}`)
        }else addMessage(data.msg)
    })

    socket.on("user connected", username => {
        addMessage(`${username} join!☺`)
    })

    socket.on("user disconnected", data => {
        addMessage(`${data} left`)
    })

    socket.on("update list users", xList => {
        updateUsersList(xList)
    })
    // answer value with chat message from backend
    socket.on("chat message", (data) => {
            addMessage(`${data.name} : ${data.msg}`)
    })

    // answer value with chat message from backend
    socket.on("loadHistory", (xHist) => {
        loadHistory(xHist)
    })

    // answer value with new name from backend
    socket.on("change username", (xName) => {
        console.log("username change with : "+xName);
        
        window.sessionStorage.setItem("usr",xName)
    })

    // answer value with change color from backend
    socket.on("change color", function(xColor){
        document.body.style.backgroundColor = xColor;
    })

// -------- END RECEIVING REQUESTS----------------- //

}

addMessage = xMsg => {
    let node = document.createElement("LI")
    let txtNode = document.createTextNode(xMsg)      // Create a text node
    node.appendChild(txtNode)                      // Append the text to <li>
    messages.appendChild(node)
}

updateUsersList = xList => {
    while (onlineList.firstChild)
        onlineList.removeChild(onlineList.firstChild);
      
    for (const key in xList) {
        if (xList.hasOwnProperty(key)) {
            addUserOnline(xList[key])
        }
    }
}

addUserOnline = xMsg => {
    let node = document.createElement("LI")
    let txtNode = document.createTextNode(xMsg)      // Create a text node
    node.appendChild(txtNode)                      // Append the text to <li>
    onlineList.appendChild(node)
}

loadHistory = xHist => {
    xHist.forEach(el => {
        addMessage(`${el.usr} : ${el.msg}`)
    });
}
init()
