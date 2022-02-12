const RoomService = require('./room');

const roomService = new RoomService(2);

const roomName0 = 'room0';
const roomName1 = 'room1';
const user0 = 'user0';
const user1 = 'user1';
const user2 = 'user2';
const user3 = 'user3';

test('room 비어있는거 확인', () => {
  expect(roomService.isFull(roomName0)).toBe(false);
});

test('room0방에 유저 user0 조인', () => {
  roomService.joinUser(user0, roomName0);
  expect(roomService.isFull(roomName0)).toBe(false);
})

test('room0방에 유저 user1 조인', () => {
  roomService.joinUser(user1, roomName0);
  expect(roomService.isFull(roomName0)).toBe(true);
})

test('room0 방에 유저 user1 탈출', () => {
  roomService.leaveUser(user1);
  expect(roomService.isFull(roomName0)).toBe(false);
})

test('room1 방에 유저 user0, user1, user2, user3 join/leave', () => {
  const isJoin0 = roomService.joinUser(user0, roomName1);
  expect(roomService.isFull(roomName1)).toBe(false);
  expect(isJoin0).toBe(true);
  expect(roomService.rooms[roomName1]).toBe(1);

  const isJoin1 = roomService.joinUser(user1, roomName1);
  expect(roomService.isFull(roomName1)).toBe(true);
  expect(isJoin1).toBe(true);
  expect(roomService.rooms[roomName1]).toBe(2);

  const isJoin2 = roomService.joinUser(user2, roomName1);
  expect(isJoin2).toBe(false);
  expect(roomService.rooms[roomName1]).toBe(2);
})
