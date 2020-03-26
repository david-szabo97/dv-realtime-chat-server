const { ChatRoom } = require('./room')

class RoomsManager {
  constructor (server) {
    this.server = server
    this.rooms = []
    this.nextRoomId = 1

    this.createRoom(null, 'Test')

    this._onDisconnectRemoveClient()
  }

  createRoom (client, name) {
    const room = new ChatRoom(this.server, this.nextRoomId++, name)
    this.rooms.push(room)
    this.server.emit('room:created', room)

    if (client) {
      this.joinRoom(client, room)
    }
  }

  joinRoom (client, id) {
    const room = this.getRoomById(id)

    if (!room) {
      return
    }

    room.addClient(client)
    client.room = room

    this.server.emit('room:clientJoined', { room, client })
  }

  leaveRoom (client) {
    if (!client.room) {
      return
    }

    const { room } = client.room
    client.room.removeClient(client)
    client.room = null

    this.server.emit('room:clientLeft', { room, client })
  }

  deleteRoom (client, id) {
    const room = this.getRoomById(id)

    if (!room) {
      return
    }

    room.clients.forEach(client => this.leaveRoom(client))
    this.rooms.splice(this.rooms.findIndex(roomsVal => roomsVal.id === room.id), 1)
  }

  sendMessage (client, content) {
    const message = client.room.sendMessage(client, content)
    this.server.emit('room:message', { client, room: client.room, message })
  }

  getRoomById (findId) {
    return this.rooms.find(({ id }) => id === findId)
  }

  _onDisconnectRemoveClient () {
    this.server.on('client:disconnected', (client) => {
      this.leaveRoom(client)
    })
  }
}

module.exports = { RoomsManager }
