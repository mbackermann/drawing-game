import io from "socket.io-client"
let socket

export const initiateSocket = (setSocketLoaded) => {
  socket = io("http://localhost:3003")
  console.log(`Connecting socket...`)
  setSocketLoaded(true)
}

export const joinRoom = (roomName, nickName) => {
  let userId = window.localStorage.getItem("userId")
  if (!userId) {
    userId = "_" + Math.random().toString(36).substr(2, 9)
    window.localStorage.setItem("userId", userId)
  }
  if (socket && roomName && nickName)
    socket.emit("join", { roomName, nickName, userId })
}

export const disconnectSocket = () => {
  console.log("Disconnecting socket...")
  if (socket) socket.disconnect()
}

export const reloadRoom = (setRoom) => {
  socket.on("reload room", ({ roomObj }) => {
    setRoom(roomObj)
  })
}

export const togglePlayer = (player, roomName, waitlist) => {
  if (socket && player && roomName)
    socket.emit("move player", { player, roomName, waitlist })
}

export const subscribeToRoomJoined = (setRoom) => {
  return new Promise((resolve, reject) => {
    if (socket) {
      socket.on("user joined", (x) => {
        setRoom(x.roomObj)
        resolve({ ...x, ownNick: x.socketId === socket.id })
      })
    } else {
      reject("Socket not connected")
    }
  })
}
