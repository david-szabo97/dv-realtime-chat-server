const EventEmitter = require('events')

class ChatRoom extends EventEmitter {
  constructor (server, name) {
    super()

    this.server = server
    this.clients = []
    this.messages = []

    this.name = name
  }

  addClient (client) {
    this.clients.push(client)
  }

  removeClient (client) {
    this.clients = this.clients.filter(clientB => client !== clientB)
  }

  broadcast (message, filter) {
    let filterFn = (client) => client

    if (typeof filter === 'function') {
      filterFn = filter
    } else {
      filterFn = (client) => client !== filter
    }

    const clients = this.clients.filter(filterFn)
    clients.forEach(client => client.send(message))
  }
}

module.exports = { ChatRoom }
