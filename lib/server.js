const EventEmitter = require('events')
const WebSocket = require('ws')
const { Packet } = require('./packet')
const { ChatClient } = require('./client')
const { RoomsManager } = require('./rooms-manager')

class ChatServer extends EventEmitter {
  constructor (wssOptions) {
    super()

    this.wss = new WebSocket.Server(wssOptions)
    this.clients = []
    this.nextId = 1
    this.rooms = new RoomsManager(this)

    this.wss.addListener('connection', (ws, req) => {
      const client = new ChatClient(this, this.nextId++, ws, req)
      this.clients.push(client)

      this.emit('client:connected', client)
      client.emit('connected')

      ws.addEventListener('close', () => {
        const clientIndex = this.clients.findIndex((clientB) => client === clientB)
        this.clients.splice(clientIndex, 1)

        this.emit('client:disconnected', client)
        client.emit('disconnected')
      })

      ws.addEventListener('error', (err) => {
        this.emit('clientError', client, err)
        client.emit('error', err)
      })

      ws.addEventListener('message', (rawPacket) => {
        let packet = null

        try {
          packet = JSON.parse(rawPacket.data)
        } catch (err) {
          console.log(err)
          ws.close()
          return
        }

        if (packet === null) {
          return
        }

        if (typeof packet.type !== 'string') {
          ws.close()
          return
        }

        const msg = new Packet(packet.type, packet.payload)
        this.emit('clientPacket', client, msg)
        client.emit('packet', msg)
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
}

module.exports = { ChatServer }
