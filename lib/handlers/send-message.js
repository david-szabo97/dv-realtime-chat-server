const { createPacketHandler } = require('../packet-handlers')
const { SEND_MESSAGE } = require('../packet')

const handler = (server, client, message) => {
  const { content } = message

  server.rooms.sendMessage(client, content)
}

const messageHandler = createPacketHandler(SEND_MESSAGE, handler)

module.exports = messageHandler
