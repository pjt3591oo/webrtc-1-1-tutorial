class Room {
  #MAX_CNT_ROOM;
  usersByRoom = {}
  rooms = {}

  constructor (cnt=2) {
    this.#MAX_CNT_ROOM = cnt;
  }

  isFull (roomName) {
    return this.rooms[roomName] >= this.#MAX_CNT_ROOM;
  }

  joinUser (socketId, roomName) {
    if (this.isFull(roomName)) {
      return false
    }
    
    this.rooms[roomName] = this.rooms[roomName] || 0;
    this.rooms[roomName]++;
    this.usersByRoom[socketId] = roomName;
    return true;
  }

  leaveUser (socketId) {
    let room = this.usersByRoom[socketId];
    this.rooms[room]--;
    return false;
  }

  #getUserCountDidJoinRoom(roomName) {
    return this.rooms[roomName] || 0;
  }

  isAloneAtRoom(roomName) {
    return this.#getUserCountDidJoinRoom(roomName) < 2;
  }
}

module.exports = Room;