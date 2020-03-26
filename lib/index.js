const { ChatServer } = require('./server')
const { Packet } = require('./packet')
const { createPacketHandlerRegistry } = require('./packet-handlers')
const packetHandlers = require('./handlers')

const chatServer = new ChatServer({
  port: 8080
})

const packetHandlerRegistry = createPacketHandlerRegistry(chatServer)

Object.values(packetHandlers).forEach((handler) => {
  packetHandlerRegistry.use(handler)
})

chatServer.on('client:connected', (client) => {
  console.log('connect', client.id)
  client.send(new Packet('TEST'))

  client.on('connected', () => {
    console.log('Connected (from client)', client.id)
  })
})

chatServer.on('clientPacket', (client, packet) => {
  console.log(packet)
})

chatServer.on('client:setName', (client) => {
  client.send(Packet.roomList(chatServer.rooms.rooms))
})

chatServer.on('room:created', (room) => {
  room.broadcast(Packet.userList(chatServer.clients))
  chatServer.broadcast(Packet.roomList(chatServer.rooms.rooms))
})

chatServer.on('room:clientJoined', ({ room, client }) => {
  client.room.broadcast(Packet.userList(room.clients))
  client.send(Packet.messageList(client.room.messages))
})

chatServer.on('room:clientLeft', ({ room, client }) => {
  client.room.broadcast(Packet.userList(room.clients))
})

chatServer.on('room:message', ({ room, message }) => {
  console.log(message)
  room.broadcast(Packet.roomMessage(message))
})
