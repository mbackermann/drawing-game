import React from "react"
import styled from "styled-components"

import { togglePlayer } from "../helpers/socket"

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`

const RoomSettings = styled.div`
  padding: 10px 20px;
  flex: 0.12;
  height: 100%;
  border-right: 1px solid #000;
`

const UserName = styled.p`
  color: ${(props) =>
    props.user.connected ? (props.ownName ? "red" : "black") : "#cecece"};
`

const Heading = styled.h4``

const Action = styled.h5`
  cursor: pointer;
  display: inline-block;
  margin: 0;
`

const Game = ({ room, nick }) => {
  const uid = window.localStorage.getItem("userId")
  const users = room.users
  const currentUser = users.find((user) => user.uid == uid)
  const activeUsers = users.filter((user) => !user.waitlist)
  const waitlistUsers = users.filter((user) => user.waitlist)
  return (
    <Container>
      <RoomSettings>
        <Heading>Players</Heading>
        {activeUsers.map((user) => {
          return (
            <UserName key={user.id} ownName={user.uid === uid} user={user}>
              {user.name} {user.owner ? "(C)" : ""}
              {currentUser.owner && currentUser.uid != user.uid && (
                <Action
                  onClick={() => togglePlayer(user, room.name, !user.waitlist)}
                >
                  X
                </Action>
              )}
            </UserName>
          )
        })}
        <Heading>Waitlist</Heading>
        {waitlistUsers.map((user) => {
          return (
            <UserName key={user.id} ownName={user.uid === uid} user={user}>
              {user.name}{" "}
              {currentUser.owner && (
                <Action
                  onClick={() => togglePlayer(user, room.name, !user.waitlist)}
                >
                  X
                </Action>
              )}
            </UserName>
          )
        })}
      </RoomSettings>
    </Container>
  )
}

export default Game
