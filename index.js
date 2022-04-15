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

    // upon receiving userData from the user that is containing user name and socket id
    socket.on('userData', (data) => {
        socket.room = data.room;
        socket.name = data.name;
        // add the user to the user object
        users[socket.name] = socket.id;

        console.log(users); 

        // have the socket join the room it specified in the form
        socket.join(socket.room);
        if (rooms[socket.room]){
            rooms[socket.room]++;
        }
        else{
            rooms[socket.room] = 1;
        }

        console.log(rooms);

        // let roomData = {
        //     'users': Object.keys(users),
        //     'size': rooms[socket.room]
        // }

        // emit room name to the specific socket
        socket.emit('roomName', socket.room);
        // emit size of the room to all sockets in that room
        io.to(socket.room).emit('roomSize', rooms[socket.room]);
    })

    // upon receiving notification that add-note button is clicked; data contains the color of the note added
    socket.on('addNoteClicked', (data) => {
        // console.log(data);
        count++;

        // save the color in an object together with count value that will be used as identifier for each note
        let noteInfo = {
            color: data,
            value: count
        }
        // emit the data to all sockets in the room
        io.to(socket.room).emit('noteColor', noteInfo);
    })

    // upon receiving the id of the sticky note whose remove icon was clicked
    socket.on('removeIconClicked', (id) => {
        console.log('this will be removed: ' + id);
        // emit the id to all sockets in the room to have the note deleted for all users
        io.to(socket.room).emit('removeIconClicked', id);
    })

    // upon receiving the data of the text that was submitted for the note
    socket.on('noteTextSubmitted', (data) => {
        // console.log(data);
        // emit the data to all sockets in the room to have the text displayed for all users
        io.to(socket.room).emit('noteTextDetails', data);
    })

    // when a socket disconnects
    socket.on('disconnect', () => {
        console.log('socket disconnected: ', socket.id);
        // decrement the size of the room
        rooms[socket.room]--;
        // delete the socket from the user object
        delete users[socket.name];

        // let roomData = {
        //     'users': Object.keys(users),
        //     'size': rooms[socket.room]
        // }

        // emit the updated room size to all sockets in the room
        io.to(socket.room).emit('roomSize', rooms[socket.room]);
    })
})

// running the server
let port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log('server listening to port ' + port);
})