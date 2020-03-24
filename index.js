const { ChatServer } = require('./server')
const { Message, CREATE_ROOM, JOIN_ROOM, SEND_MESSAGE, SET_NAME, ROOM_LIST, USER_LIST, MESSAGE_LIST } = require('./message')
const { ChatRoom } = require('./room')

const chatServer = new ChatServer({
  port: 8080
})

chatServer.on('clientConnected', (client) => {
  console.log('connect', client.id)
  client.send(new Message('TEST'))

  client.on('connected', () => {
    console.log('Connected (from client)', client.id)
  })
})

chatServer.on('clientDisconnected', (client) => {
  console.log('disconnect', client.id)
  if (client.room) {
    const room = client.room
    room.removeClient(client)
    room.broadcast(new Message(USER_LIST, room.clients.map(({ name }) => ({ name }))))
  }
})

let nextMessageId = 1
let nextRoomId = 1
const rooms = [
  new ChatRoom(chatServer, nextRoomId++, 'Test')
]

chatServer.on('clientMessage', (client, msg) => {
  console.log('message', client.id, msg)

  switch (msg.type) {
    case SET_NAME:
      client.name = msg.payload
      client.send(new Message(ROOM_LIST, rooms.map(({ name }) => ({ name }))))
      break
    case SEND_MESSAGE:
      const roomMessage = { id: nextMessageId++, createdAt: Date.now(), from: client.name, content: msg.payload }
      client.room.messages.push(roomMessage)
      client.room.broadcast(new Message('ROOM_MESSAGE', roomMessage))
      break
    case CREATE_ROOM:
      const room = new ChatRoom(chatServer, nextRoomId++, msg.payload.name)
      rooms.push(room)
      room.addClient(client)
      client.room = room

      chatServer.broadcast(new Message(ROOM_LIST, rooms.map(({ id, name }) => ({ id, name }))), ({ name }) => name)
      break
    case JOIN_ROOM:
      const roomByName = rooms.find(room => room.name === msg.payload)

      if (!roomByName) {
        return
      }

      roomByName.addClient(client)
      client.room = roomByName

      client.room.broadcast(new Message(USER_LIST, client.room.clients.map(({ id, name }) => ({ id, name }))))
      client.send(new Message(MESSAGE_LIST, client.room.messages.map(({ id, createdAt, from, content }) => ({ id, createdAt, from, content }))))

      break
  }
})
