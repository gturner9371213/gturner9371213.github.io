// Imported modules 
const express = require('express');
const http = require('http')
const socketio = require('socket.io')
// Intialize express and HTTP server
const app = express(); 
const server = http.createServer(app);
// INitalize Socket.IO with HTTP 
const io = socketio(server);
// Set the port 5500 since that is the port vs code uses 
const PORT = 5500; 
// Indentifier used to differiate between players in the game 
const Redplayer = "R";
const Blackplayer = "B";
// Serve static files in the directory it is currently in. 
app.use(express.static(__dirname));

// Listen for socket connection
io.on('connection', (socket) => {
    console.log('User connected');
    // Listen for disconnection 
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Listen for player moves on the client side
    socket.on('playerMove', (state) => {
       
        socket.broadcast.emit('moveMade', state);
        const nextPlayer = state.player === Redplayer ? Blackplayer : Redplayer;
        console.log(`Emitting nextPlayer event. Next player: ${nextPlayer}`);
        io.emit('nextPlayer', nextPlayer);
    });
});
// Starts the server listening on specified port 
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));