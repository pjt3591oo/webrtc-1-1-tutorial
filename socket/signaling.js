const socket = require("socket.io");
const RoomService = require('../service/room');

function init(httpServer) {
  const io = socket(httpServer);
  
  const roomService = new RoomService(2);

  const namespace = 'signaling';

  io.of(namespace).on('connection', (socket) => {
    const { id: socketId } = socket;

    socket.on('join', data => {
      let { room } = data;

      let isJoin = roomService.joinUser(socketId, room);
      
      if (!isJoin) {
        socket.emit('room_cnt_limmit');
        return;
      }

      socket.join(room);

      if (!roomService.isAloneAtRoom(room)) {
        socket.emit( 'join' );
      }
    })
  
    socket.on('offer', sdp => {
      console.log('offer')
      const roomName = roomService.usersByRoom[socketId];

      socket.broadcast.to(roomName).emit('receive_offer', sdp);
    })
  
    socket.on('answer', sdp => {
      console.log('answer')
      const roomName = roomService.usersByRoom[socketId];
      socket.broadcast.to(roomName).emit('receive_answer', sdp);
    })
  
    socket.on('candidate', candidate => {
      const roomName = roomService.usersByRoom[socketId];
      if(candidate) socket.broadcast.to(roomName).emit('receive_candidate', candidate);
    })
  
    socket.on('disconnect', () => {
      const roomName = roomService.usersByRoom[socketId];
      roomService.leaveUser(socketId);

      socket.broadcast.to(roomName).emit('leave');
    })
  })
}

module.exports = init;