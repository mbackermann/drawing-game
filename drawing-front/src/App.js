import React, { useState, useEffect } from "react"

import Login from "./components/Login"
import Game from "./components/Game"

import {
  initiateSocket,
  joinRoom,
  subscribeToRoomJoined,
  reloadRoom,
} from "./helpers/socket"

function App() {
  const [room, setRoom] = useState({})
  const [nick, setNick] = useState("")
  const [socketLoaded, setSocketLoaded] = useState(false)

  useEffect(() => {
    initiateSocket(setSocketLoaded)
    reloadRoom(setRoom)
    subscribeToRoomJoined(setRoom).then((x) => {
      if (x.ownNick) {
        if (!nick) {
          setNick(x.nickName)
        }
        window.localStorage.setItem("nick", x.nickName)
        window.localStorage.setItem("roomName", x.roomObj.name)
      }
    })
  }, [])

  if (!socketLoaded) {
    return <div></div>
  } else if (Object.keys(room).length === 0 || !nick) {
    return <Login joinRoom={joinRoom} />
  } else {
    return <Game room={room} nick={nick} />
  }
}

export default App
