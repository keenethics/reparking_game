const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:3000' } });

const rooms = {};

app.get('/game/:gameId', (req, res) => {
  res.sendFile(__dirname + '/game-join.html');
});

io.use((socket, next) => {
  // check auth
  // if path ===

  next();
});

io.on('connection', (socket) => {
  console.log('+ user connected', socket.id);
  //const result = await io.in('room1').fetchSockets();
  //console.log('rrrrrr', result.map(s => ({ id: s.id, handshake: s.handshake, rooms: s.rooms, data: s.data })));

  socket.on('game:create', () => {
    const randomRoomId = uuidv4();
    rooms[randomRoomId] = {};

    console.log('rooms: ', rooms);

    socket.emit('game:create', `http://localhost:3000/game/${randomRoomId}`);
  });

  socket.on('game:join', () => {
    const { roomId, userId } = socket.handshake.auth;
    socket.join(roomId);
    rooms[roomId][userId] = {};

    console.log('rooms: ', rooms);

    io.to(roomId).emit('game:join', rooms[roomId]);
  });

  socket.on('disconnect', () => {
    console.log('- user disconnected', socket.id)
    const { roomId, userId } = socket.handshake.auth;
    if (roomId && userId) {
      delete rooms[roomId][userId];
      io.to(roomId).emit('game:disconnect', rooms[roomId]);
    }
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
