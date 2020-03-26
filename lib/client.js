const EventEmitter = require('events')
const { Packet } = require('./packet')

class ChatClient extends EventEmitter {
  constructor (server, id, ws, req) {
    super()

    this.server = server
    this.id = id

    this.ws = ws
    this.req = req

    this.room = null
  }

  send (type, payload) {
    let packet = { type, payload }

    if (typeof payload === 'undefined') {
      if (type instanceof Packet && typeof type.type !== 'undefined') {
        packet = type
      }
    }

    this.ws.send(JSON.stringify(packet))
  }

  close () {
    this.ws.close()
  }

  setName (name) {
    this.name = name
    this.server.emit('client:setName', this)
  }

  plain () {
    const { id, name } = this

    return {
      id,
      name
    }
  }
}

module.exports = { ChatClient }
