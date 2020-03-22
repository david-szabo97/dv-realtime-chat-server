const EventEmitter = require('events')
const { Message } = require('./message')

class ChatClient extends EventEmitter {
  constructor (id, ws, req) {
    super()

    this.id = id
    this.ws = ws
    this.req = req

    this.room = null
  }

  send (type, payload) {
    let message = { type, payload }

    if (typeof payload === 'undefined') {
      if (type instanceof Message && typeof type.type !== 'undefined') {
        message = type
      }
    }

    this.ws.send(JSON.stringify(message))
  }

  close () {
    this.ws.close()
  }
}

module.exports = { ChatClient }
