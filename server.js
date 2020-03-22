const EventEmitter = require('events')
const WebSocket = require('ws')
const { Message } = require('./message')
const { ChatClient } = require('./client')

class ChatServer extends EventEmitter {
  constructor (wssOptions) {
    super()

    this.wss = new WebSocket.Server(wssOptions)
    this.clients = []
    this.nextId = 1

    this.wss.addListener('connection', (ws, req) => {
      const client = new ChatClient(this.nextId++, ws, req)
      this.clients.push(client)

      this.emit('clientConnected', client)
      client.emit('connected')

      ws.addEventListener('close', () => {
        const clientIndex = this.clients.findIndex((clientB) => client === clientB)
        this.clients.splice(clientIndex, 1)

        this.emit('clientDisconnected', client)
        client.emit('disconnected')
      })

      ws.addEventListener('error', (err) => {
        this.emit('clientError', client, err)
        client.emit('error', err)
      })

      ws.addEventListener('message', (rawMessage) => {
        let message = null

        try {
          message = JSON.parse(rawMessage.data)
        } catch (err) {
          console.log(err)
          ws.close()
          return
        }

        if (message === null) {
          return
        }

        if (typeof message.type !== 'string') {
          ws.close()
          return
        }

        const msg = new Message(message.type, message.payload)
        this.emit('clientMessage', client, msg)
        client.emit('message', msg)
      })
    })

    this.wss.addListener('close', () => {
      this.emit('serverClosed')
    })

    this.wss.addListener('serverError', (err) => {
      this.emit('serverError', err)
    })
  }

  getClients () {
    return this.clients
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

module.exports = { ChatServer }
