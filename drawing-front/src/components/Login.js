import React, { useState } from "react"
import styled from "styled-components"

const Container = styled.div`
  width: 500px;
  height: 300px;
  display: flex;
  border: 1px solid #000;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
`

const Input = styled.input`
  height: 30px;
  margin: 5px 0;
  padding: 2px 5px;
`

const Submit = styled.button`
  height: 50px;
`

const Login = ({ joinRoom }) => {
  const [nick, setNick] = useState(window.localStorage.getItem("nick"))
  const [room, setRoom] = useState(window.localStorage.getItem("roomName"))
  return (
    <Container>
      <Input
        placeholder="Nick"
        onChange={(e) => setNick(e.target.value)}
        value={nick}
      />
      <Input
        placeholder="Room Name"
        onChange={(e) => setRoom(e.target.value)}
        value={room}
      />
      <Submit onClick={() => joinRoom(room, nick)}>Join</Submit>
    </Container>
  )
}

export default Login
