const { createPacketHandler } = require('../packet-handlers')
const { CREATE_ROOM } = require('../packet')

const handler = (server, client, message) => {
  const { name } = message

  server.rooms.createRoom(client, name)
}

const messageHandler = createPacketHandler(CREATE_ROOM, handler)

module.exports = messageHandler
