init = () => {
    let socket = io(); 

// --------EVENT LISTENERS ----------------- //
    let changeColorListener = (e) => {
        changeColor(e.target.getAttribute('data-id'))
    }

    // on button change color pressed
    let changeColorBtn = document.getElementsByClassName("changeColorBtn");
    
    Array.from(changeColorBtn).forEach(function(el) {
        el.addEventListener('click', changeColorListener);
    });

// --------END EVENT LISTENERS----------------- //

// --------SENDING REQUESTS----------------- //
changeColor = (xColor) => {
    socket.emit('change color', xColor);
}
// --------END SENDING REQUESTS----------------- //


// --------RECEIVING REQUESTS----------------- //
socket.on("update list users", xList => {
    updateUsersList(xList)
})
// answer value with change color from backend
socket.on("change color", function(xColor){
    document.body.style.backgroundColor = xColor;
})

// -------- END RECEIVING REQUESTS----------------- //

}

initCanvas = () => {
    let img = new Image();
    img.src = './images/Green-Cap-Character-16x18.png';
    let canvas = document.querySelector('canvas');
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 16, 18, 0, 0, 16, 18);

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
    console.log(xMsg);
    
    let node = document.createElement("LI")
    let txtNode = document.createTextNode(xMsg)      // Create a text node
    node.appendChild(txtNode)                      // Append the text to <li>
    onlineList.appendChild(node)
}
initCanvas()
init()

