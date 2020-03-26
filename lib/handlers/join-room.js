const { createPacketHandler } = require('../packet-handlers')
const { JOIN_ROOM } = require('../packet')

const handler = (server, client, message) => {
  const { id } = message

  server.rooms.joinRoom(client, id)
}

const messageHandler = createPacketHandler(JOIN_ROOM, handler)

module.exports = messageHandler
