// JS file for server-side
// ----------------------------------------

// initializing express app object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

// initializing http server
let http = require('http');
let server = http.createServer(app);

// initializing socket.io
let io = require('socket.io');
io = new io.Server(server);

// object containing user name as key and user-id as value
let users = {};
// object containing room name as key and # of users in room as value
let rooms = {};
// variable for containing how many times the add button is clicked across all sockets in a room
let count = 0;

io.sockets.on('connect', (socket) => {
    console.log('socket joined: ', socket.id);

    socket.on('userData', (data) => {
        socket.name = data.name;
        users[socket.name] = socket.id;
        console.log(users);

        socket.room = data.room;

        socket.join(socket.room);
        if (rooms[socket.room]){
            rooms[socket.room]++;
        }
        else{
            rooms[socket.room] = 1;
        }

        console.log(rooms);

        // let roomData = {
        //     'roomName': socket.room,
        //     'roomSize': rooms[socket.room]
        // };

        let roomData = {
            'users': Object.keys(users),
            'size': rooms[socket.room]
        }

        socket.emit('roomName', socket.room);
        io.to(socket.room).emit('roomSize', rooms[socket.room]);

        // io.to(socket.room).emit('userConnected', roomData);

        // const clients = io.sockets.adapter.rooms.get(`${socket.room}`);
        // io.to(socket.room).emit('userConnected', clients);

        // console.log(clients);


        // io.to(socket.room).emit('usersInRoom', roomData);
    })

    socket.on('addNoteClicked', (data) => {
        // console.log(data);
        count++;
        let noteInfo = {
            color: data,
            value: count
        }
        io.to(socket.room).emit('noteColor', noteInfo);
    })

    socket.on('removeIconClicked', (id) => {
        console.log('this will be removed: ' + id);
        io.to(socket.room).emit('removeIconClicked', id);
    })

    socket.on('noteTextSubmitted', (data) => {
        // console.log(data);
        io.to(socket.room).emit('noteTextDetails', data);
    })

    socket.on('disconnect', () => {
        console.log('socket disconnected: ', socket.id);
        rooms[socket.room]--;
        delete users[socket.name];

        let roomData = {
            'users': Object.keys(users),
            'size': rooms[socket.room]
        }

        io.to(socket.room).emit('roomSize', rooms[socket.room]);

        // io.to(socket.room).emit('userDisconnected', roomData);

        // io.to(socket.room).emit('usersInRoom', roomData);
    })
})

// running server
let port = process.env.PORT || 5500;
server.listen(port, () => {
    console.log('server listening to port ' + port);
})