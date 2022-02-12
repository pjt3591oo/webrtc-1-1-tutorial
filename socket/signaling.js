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
      socket.broadcast.emit('receive_offer', sdp);
    })
  
    socket.on('answer', sdp => {
      console.log('answer')
      socket.broadcast.emit('receive_answer', sdp);
    })
  
    socket.on('candidate', candidate => {
      if(candidate) socket.broadcast.emit('receive_candidate', candidate);
    })
  
    socket.on('disconnect', () => {
      roomService.leaveUser(socketId);

      socket.broadcast.emit('leave');
    })
  })
}

module.exports = init;