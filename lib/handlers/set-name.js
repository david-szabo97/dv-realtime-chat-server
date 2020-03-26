const { createPacketHandler } = require('../packet-handlers')
const { SET_NAME } = require('../packet')

const handler = (server, client, message) => {
  const { name } = message

  client.setName(name)
}

const messageHandler = createPacketHandler(SET_NAME, handler)

module.exports = messageHandler
