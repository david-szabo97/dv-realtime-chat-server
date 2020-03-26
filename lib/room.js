const EventEmitter = require('events')

class ChatRoom extends EventEmitter {
  constructor (server, id, name, createdBy) {
    super()

    this.server = server
    this.clients = []

    this.nextMessageId = 1
    this.messages = []

    this.id = id
    this.name = name
    this.createdBy = createdBy
  }

  addClient (client) {
    this.clients.push(client)
  }

  removeClient (client) {
    this.clients = this.clients.filter(clientB => client !== clientB)
  }

  sendMessage (client, content) {
    const message = { id: this.nextMessageId++, createdAt: Date.now(), from: client.name, content }
    this.messages.push(message)

    return message
  }

  broadcast (packet, filter) {
    let filterFn = (client) => client

    if (typeof filter === 'function') {
      filterFn = filter
    } else {
      filterFn = (client) => client !== filter
    }

    const clients = this.clients.filter(filterFn)
    clients.forEach(client => client.send(packet))
  }

  plain () {
    const { id, name } = this

    return {
      id,
      name
    }
  }
}

module.exports = { ChatRoom }
