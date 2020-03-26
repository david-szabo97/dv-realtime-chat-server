const createPacketHandler = (type, handler) => {
  return {
    type,
    handler
  }
}

const createPacketHandlerRegistry = (server) => {
  const handlers = {}

  server.on('clientPacket', (client, packet) => {
    const { type, payload } = packet

    if (!handlers) {
      return
    }

    handlers[type].forEach((fn) => fn(server, client, payload, packet))
  })

  const use = ({ type, handler }) => {
    if (!handlers[type]) {
      handlers[type] = []
    }

    handlers[type].push(handler)
  }

  return {
    use
  }
}

module.exports = {
  createPacketHandler,
  createPacketHandlerRegistry
}
