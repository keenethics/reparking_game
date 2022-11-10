
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const buf = crypto.randomBytes(12);
console.log('ccccc', buf);
console.log('ccccc', buf.toString());
console.log('ccccc', buf.toString('hex'));

io.on('connection', async (socket) => {
  console.log('a user connected', socket.data);
  //console.log('uuid: ', crypto.randomUUID());
  socket.join('room1');
  //socket.leave('room1');

  const result = await io.in('room1').fetchSockets();
  console.log('rrrrrr', result.map(s => ({ id: s.id, handshake: s.handshake, rooms: s.rooms, data: s.data })));
  /*
  if (socket) {
    socket.join('room1');
  }
  socket.to('room1').emit()

  io.to('room1').to('room2').emit('event_name', data);
  io.to(['room1', 'room2']).except(socket.id);
  io.to(socket.id).emit()
  io.local.emit()
  socket.leave('room1');
  */
  /*
  const mySet = new Set();
  mySet.add(3);
  mySet.add(5);
  mySet.toJSON = function() { return 'abc'; };
  socket.timeout(5000).emit('hi', mySet);
  */

  socket.on('chat message', (msg) => {
    console.log('message: ', msg);
    io.timeout(5000).emit('chat message', msg);
    //io.emit('chat message', msg);
    // socket.broadcast.emit('chat message', msg);
  });
  /*
  socket.on('chat message', (arg1, callback) => {
    console.log(arg1);

    callback({ status: 'ok' });
  });
  */

  socket.on('ping', (count) => {
    console.log(count);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.rooms);
  });
});

server.listen(3000, () => {
  console.log('Listening on *:3000');
});
