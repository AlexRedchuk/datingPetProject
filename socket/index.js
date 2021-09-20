const io = require("socket.io")(8900, {
    cors: {
        origin: 'http://localhost:3000'
    }
}); 

let users = []; 

const addUser = (userId, socketId) => {
    if(!users.some(user => user.userId === userId)) {
        users.push({userId, socketId})
    }
     
}

const removeUser = (socketId) => {
    users = users.filter(el => el.socketId !== socketId);
}

const getUser = (userId) => {
        return users.find(el => el.userId === userId)
    }
    
io.on("connection", (socket) => {
    
    // take user id and socket id
    socket.on("addUser", userId => {
        console.log("User connected")
        addUser(userId, socket.id)
        io.emit("getUsers", users);
    })

    

    socket.on("sendMessage", ({recieverId, userId, text, conversationId}) => {
        const user = getUser(recieverId)
        io.to(user?.socketId).emit("getMessage", {
            conversationId,
            sender: userId,
            text,
            isRead: false
        })
    })

    socket.on("disconnect", () => {
        removeUser(socket.id);
        
        io.emit("getUsers", users);
    })
})