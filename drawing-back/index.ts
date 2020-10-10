const express = require("express")
const http = require("http")
const socketIo = require("socket.io")

const index = require("./routes/index")

const app = express()
app.use(index)

const port = process.env.PORT || 3003
const server = http.createServer(app)

const io = socketIo(server)

let rooms = {}

server.listen(port, () => {
  console.log(`Server listeing on port ${port}`)
})

io.on("connection", (socket) => {
  console.log("New user connection", socket.id)

  socket.on("join", ({ roomName, nickName, userId }) => {
    newUserRoom(roomName, nickName, userId, socket)
  })

  socket.on("disconnecting", () => {
    userDisconnected(socket)
  })

  socket.on("move player", ({ player, roomName, waitlist }) => {
    togglePlayer(player, roomName, waitlist, io)
  })
})

const userDisconnected = (socket) => {
  let connectedRooms = Object.keys(socket.rooms)
  connectedRooms = connectedRooms.filter((room) => room != socket.id) || []
  connectedRooms.forEach((roomName) => {
    let room = rooms[roomName]
    let users = room?.users || []
    let user = users.find((user) => user.id == socket.id)
    users = users.filter((user) => user.id != socket.id)
    if (user) {
      user = {
        ...user,
        connected: false,
      }
    } else {
      return
    }
    rooms[roomName] = { ...room, users: sortUsers([...users, user]) }
    socket.to(roomName).emit("reload room", {
      roomObj: rooms[roomName],
    })
  })
}

const togglePlayer = (player, roomName, waitlist, io) => {
  let room = rooms[roomName]
  let users = room?.users || []
  let user = users.find((user) => user.uid == player.uid) || {}
  users = users.filter((user) => user?.uid != player.uid)
  user = {
    ...user,
    waitlist: waitlist,
  }
  rooms[roomName] = {
    ...room,
    users: sortUsers([...users, user]),
    name: roomName,
  }
  io.in(roomName).emit("reload room", {
    roomObj: rooms[roomName],
  })
}

const newUserRoom = (roomName, nickName, userId, socket) => {
  let room = rooms[roomName]
  let users = room?.users || []
  let user = users.find((user) => user.uid == userId) || {}
  users = users.filter((user) => user?.uid != userId)
  let owner = user.owner || typeof room == "undefined" || false
  let waitlist = typeof user.waitlist == "undefined" ? !owner : user.waitlist
  user = {
    ...user,
    name: nickName,
    id: socket.id,
    uid: userId,
    connected: socket.connected,
    owner: owner,
    waitlist: waitlist,
  }
  rooms[roomName] = {
    ...room,
    users: sortUsers([...users, user]),
    name: roomName,
  }
  socket.join(roomName).emit("user joined", {
    socketId: socket.id,
    roomObj: rooms[roomName],
    nickName: nickName,
  })
  socket.to(roomName).emit("user joined", {
    socketId: socket.id,
    roomObj: rooms[roomName],
    nickName: nickName,
  })
}

const sortUsers = (users) => {
  return users.sort((a, b) => {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  })
}
