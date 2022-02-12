const inputDom = document.getElementById('room-id');
const makeRoomBtnDom = document.getElementById('make');
const enterRoomBtnDom = document.getElementById('enter');

let isActiveEnterRoomBtn = false;

makeRoomBtnDom.addEventListener('click', () => {
  const roomId = new Date().getTime();
  window.location = `/meeting/${roomId}`;
})

enterRoomBtnDom.addEventListener('click', () => {
  if (!isActiveEnterRoomBtn) {
    alert('room id를 입력해주세요.');
    return;
  }

  const roomId = inputDom.value;
  window.location = `/meeting/${roomId}`;
})

inputDom.addEventListener('keyup', e => {
  isActiveEnterRoomBtn = !!e.target.value;
  enterRoomBtnDom.disabled = !isActiveEnterRoomBtn;
})