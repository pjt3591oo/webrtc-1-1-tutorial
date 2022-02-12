const myVideo = document.getElementById('my');
const youVideo = document.getElementById('you');

const messages = document.getElementById('messages');
const msgInput = document.getElementById('msg');
const msgBtn = document.getElementById('send-btn');

let streams;
let youStream;
const socket = io('/signaling'); // namespace: signaling
const pcConfig = {
  'iceServers': [  {
      "url": "stun:23.21.150.121"
    }, {
      "url": "stun:stun.l.google.com:19302"
    }
  ]
};
let pc;

window.onload = async () => {
  streams = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  })
  myVideo.srcObject = streams;
  await peerConnection(streams);
  const roomID = window.location.pathname.split('/').at(-1).split('?')[0];
  socket.emit('join', {room: roomID})
}


socket.on('room_cnt_limmit', () => {
  alert('해당 방 정원 초과입니다.')
  window.location.href='/';
})

socket.on('join', async (userCount) => {
  await createOffer()
})

socket.on('leave', async () => {
  youVideo.srcObject = null;
  pc.removeStream(youStream);
  // pc.close(); // cadidate status closed로 바뀜
  // await peerConnection(streams);
})

socket.on('receive_offer', async (receiveSDP) => {
  // setRemoteDescription으로 상대반 sdp를 등록하면 해당 피어는 상대방에게 스트림과 트랙을 얻을 수 있다.
  // 해당 노도는 onaddstream, ontrack 이벤트를 통해 스트림과 트랙을 얻을 수 있다.
  // setRemoteDescription이 호출되면 상대방과의 통신 채널이 생성되기 시작하므로 onicecandidate가 반응한다
  await pc.setRemoteDescription(new RTCSessionDescription(receiveSDP))
  await createAnswer()
})

socket.on('receive_answer', async (receiveSDP) => {
  // setRemoteDescription으로 상대반 sdp를 등록하면 해당 피어는 상대방에게 스트림과 트랙을 얻을 수 있다.
  // 해당 노도는 onaddstream, ontrack 이벤트를 통해 스트림과 트랙을 얻을 수 있다.
  // setRemoteDescription이 호출되면 상대방과의 통신 채널이 생성되기 시작하므로 onicecandidate가 반응한다
  await pc.setRemoteDescription(new RTCSessionDescription(receiveSDP))
})

socket.on('receive_candidate', async (candidate) => {
  // console.log(candidate)
  await pc.addIceCandidate(new RTCIceCandidate(candidate))
})

async function peerConnection(stream) {
  pc = new RTCPeerConnection(pcConfig);
  
  stream.getTracks().forEach(track => {
    // 해당 커넥션에 트랙과 스트램을 등록해야 상태방이 setRemoteDescription할 때 해당 track과 stream을 전달함.
    pc.addTrack(track, stream);
  })

  // 서로 통신 채널을 확립하기 위한 방법
  // 연결 가능한 후보자가 생성될때마다 후보자를 전달한다.
  // 이를 ice trickle이라고 한다. 이를 통해 연결을 보다 효율적으로 할 수 있다.
  pc.onicecandidate = function (e) {
    console.log('onicecandidate')
    socket.emit('candidate', e.candidate);
  }

  // remote에서 stream이 들어오면 이벤트 발생
  pc.onaddstream = function (e) {
    console.log('onaddstream')
    youStream = e.stream;
  };

  // removete에서 stream이 들어오면 이벤트 발생
  pc.ontrack = function (e) {
    console.log('ontrack')
    youVideo.srcObject = e.streams[0];
  };

  pc.onremovestream = () => {
    console.log(123);
  }
}

async function createOffer() {
  console.log('createOffer')
  const sdp = await pc.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true});
  await pc.setLocalDescription(new RTCSessionDescription(sdp))
  socket.emit('offer', sdp)
}

async function createAnswer() {
  console.log('createAnswer')
  const sdp = await pc.createAnswer({offerToReceiveAudio: true, offerToReceiveVideo: true});
  await pc.setLocalDescription(sdp);
  socket.emit('answer', sdp);
}