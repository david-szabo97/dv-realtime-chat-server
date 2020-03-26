const CREATE_ROOM = 'CREATE_ROOM'
const DELETE_ROOM = 'DELETE_ROOM'
const JOIN_ROOM = 'JOIN_ROOM'
const LEAVE_ROOM = 'LEAVE_ROOM'
const SEND_MESSAGE = 'SEND_MESSAGE'
const SET_NAME = 'SET_NAME'
const ROOM_LIST = 'ROOM_LIST'
const USER_LIST = 'USER_LIST'
const MESSAGE_LIST = 'MESSAGE_LIST'
const ROOM_MESSAGE = 'ROOM_MESSAGE'

class Packet {
  constructor (type, payload) {
    if (typeof type !== 'string') {
      throw TypeError(`Invalid type for Packet: ${type}`)
    }

    this.type = type
    this.payload = payload
  }
}

Packet.roomList = (rooms) => new Packet(ROOM_LIST, rooms.map(room => room.plain()))
Packet.userList = (clients) => new Packet(USER_LIST, clients.map(client => client.plain()))
Packet.messageList = (messages) => new Packet(MESSAGE_LIST, messages)
Packet.roomMessage = (message) => new Packet(ROOM_MESSAGE, message)

module.exports = {
  Packet,

  CREATE_ROOM,
  DELETE_ROOM,
  JOIN_ROOM,
  LEAVE_ROOM,
  SEND_MESSAGE,
  SET_NAME,
  ROOM_LIST,
  USER_LIST,
  MESSAGE_LIST
}
