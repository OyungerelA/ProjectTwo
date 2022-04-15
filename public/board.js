// JS file for board page (board.html), client-side
// ------------------------------------------------

// client connecting to the server
let socket = io();

// initializing variables
let count=0;
let userNames = [];
let colorVal, temp, currNote, text;
// flag that when true means the user changed text, when false means user inputted text for the first time
let flag = false;

// getting confirmation that the client is connected
socket.on('connect', () => {
    console.log('connected to the server');

    // get the user name and room name from session storage
    let data = {
        'name': sessionStorage.getItem('name'),
        'room': sessionStorage.getItem('room')
    }

    // emit the above info to the server
    socket.emit('userData', data);
})

// upon receiving room name from the server, display it on the top bar
socket.on('roomName', (data) => {
    let boardNameArea = document.getElementById('board-name');
    let boardName = document.createElement('p');
    boardName.innerHTML = data;
    boardNameArea.appendChild(boardName);
})

// upon receiving room size from the server, display it on the top bar
socket.on('roomSize', (data) => {
    let memberCountArea = document.getElementById('member-count');

    // if the count variable that is incremented whenever new socket joins the room is greater than 0, this means the room size displayed on the screen needs to be updated 
    if (count > 0)
        // remove the old value first
        memberCountArea.removeChild(memberCountArea.lastChild);
    
    // display it on the top bar
    let memberCount = document.createElement('p');
    memberCount.innerHTML = data;
    memberCountArea.appendChild(memberCount);

    count++;
})

// upon receiving note color data from server
socket.on('noteColor', (data) => {
    console.log('color clicked' + data.color);
    console.log('frequency' + data.value);
    // call the add note function to add the sticky note on the board with the corresponding color and note value (note value will be used for note id)
    addNote(data.color, data.value);
})

// upon receiving the id of the sticky note whose remove icon was clicked
socket.on('removeIconClicked', (id) => {
    // call the remove element function to delete the note from the board
    removeElement(id);
})

// upon receiving the details of the text that was submitted for the note
socket.on('noteTextDetails', (data) => {
    console.log(data.noteID, data.text, data.contributor);
    // call the add text function to add and display the text on the sticky note
    addText(data.noteID, data.text, data.type, data.contributor);
})

// function for adding a note on the board with the corresponding color and value received from the server
function addNote(color, value){
    // create a div element to contain the sticky note
    let noteWrapper = document.createElement('div');
    noteWrapper.classList.add('note-box-wrapper');
    noteWrapper.style.position = 'relative';
    // give id based on the value received from server so that note deletion will be easier
    noteWrapper.id = `note-box-wrapper${value}`;

    // create an img element that will contain the sticky note image
    let note = document.createElement('img');
    note.id = `${value}`;
    note.classList.add('noteBox');

    let boardArea = document.getElementById('board-area');

    // based on the value of the color received from server, determine the source of image
    // value 1 corresponds to yellow note
    if (color=='1')
        note.src = 'images/note1.png'
    // orange
    else if (color=='2')
        note.src = 'images/note2.png'
    // pink
    else if (color=='3')
        note.src = 'images/note3.png'
    // purple
    else if (color=='4')
        note.src = 'images/note4.png'
    // blue
    else if (color=='5')
        note.src = 'images/note5.png'
    // green
    else if (color=='6')
        note.src = 'images/note6.png'
    // neutral
    else
        note.src = 'images/note7.png'

    noteWrapper.appendChild(note);

    // add a remove icon in each note
    let removeIcon = document.createElement('img');
    removeIcon.src = 'images/cancel.png';
    removeIcon.id = `remove${value}`;
    removeIcon.classList.add('removeIcon');

    // position the remove icon at the top right in a suitable size
    removeIcon.style.width = '12px';
    removeIcon.style.height = '12px';
    removeIcon.style.position = 'absolute';
    removeIcon.style.top = '1px';
    removeIcon.style.right = '1px';
    removeIcon.style.padding = '4px'
    removeIcon.style.background = 'none';

    noteWrapper.appendChild(removeIcon);
    boardArea.appendChild(noteWrapper);
}

// function for adding text on a sticky note
function addText(noteID, noteText, noteType, noteContributor){
    console.log(noteType);
    // false means the text is a first time text on the note, so it can be added right away as the note is empty
    if (noteType==false){
        // for displaying the actual text 
        let noteArea = document.getElementById(`note-box-wrapper${noteID}`);
        let textWrapper = document.createElement('div');
        textWrapper.id = `text-wrapper${noteID}`;
        textWrapper.classList.add('text-wrapper');
        let text = document.createElement('p');
        text.classList.add('text');
        text.id = `text${noteID}`;
        text.innerHTML = noteText;
        textWrapper.appendChild(text);
        noteArea.appendChild(textWrapper);
        noteArea.style.position = 'relative';
        textWrapper.style.position = 'absolute';

        // for displaying name of the user who contributed to/edited the text for this specific sticky note
        let userListWrapper = document.createElement('div');
        userListWrapper.id = `user-wrapper${noteID}`;
        userListWrapper.classList.add('user-wrapper');
        // p element containing user names of users that contributed to this note
        let textUserList = document.createElement('p');
        textUserList.id = `textUser${noteID}`;
        textUserList.innerHTML = noteContributor;
        userListWrapper.appendChild(textUserList);
        noteArea.appendChild(userListWrapper);
    }

    // else means that the text was updated, so will need to remove the old text and change it with the updated version
    else{
        console.log(noteID, noteText, noteType);
        let parent = document.getElementById(`${noteID}`).parentNode;
        parent.removeChild(document.getElementById(`${noteID}`));
        let text = document.createElement('p');
        text.classList.add('text');
        text.id = `text${noteID}`;
        text.innerHTML = noteText;
        parent.appendChild(text);

        // as the noteID sent from server consists of strings followed by the id, the following 2 lines are for only getting the number id of the noteID
        let id = noteID.match(/\d/g);
        id = id.join("");   

        let userListText = document.getElementById(`textUser${id}`);
        // if the user's name is not already displayed, add it
        if (!((userListText.innerHTML).includes(noteContributor))){
            userListText.innerHTML += `, ${noteContributor}`;
        }
    }
}

// function for getting and returning the value of the color selected by the user
function getColor(){ 
    let color = document.getElementById('color-select');
    return color.value;
}

// function for removing a note from the board
function removeElement(id){
    let elem = document.getElementById(id);
    console.log('returned' + id);

    // play the sound effect
    let sound = document.getElementById('audio');
    sound.play();
    return elem.parentNode.removeChild(elem);    
}

window.addEventListener('load', () => {
    let color;
    let backBtn = document.getElementById('back-btn');
    // if back button pressed, go back to landing page
    backBtn.addEventListener('click', () => {
        // window.history.back()
        window.location.href = "/";
    })

    let addNoteBtn = document.getElementById('addNote-btn');
    // if add-note button clicked, get the color selected and emit the info to server
    addNoteBtn.addEventListener('click', () => {
        color = getColor();
        socket.emit('addNoteClicked', color);
    })

    let boardArea = document.getElementById('board-area');

    // when anything on the board area is clicked
    boardArea.onclick = e => {
        // if the element that is clicked is the remove icon
        if (e.target.classList.contains('removeIcon')){
            console.log('remove icon pressed');
            temp = e.target.parentNode.id;
            // emit to the server that the remove icon of a particular note was clicked, temp contains the id of the note/icon
            socket.emit('removeIconClicked', temp);
        }

        // if the element that is clicked is the note
        else if (e.target.classList.contains('noteBox')){
            // make the block area visible to make the background unclickable when user is typing text
            document.getElementById('input-area').style.display = 'block';
            // make background slightly opaque
            document.getElementById('main').style.opacity = '0.5';
            // make visible the input area to type text
            document.getElementById('block-area').style.display = 'block';
            // get the id of the note that was clicked
            currNote = e.target.id;
            // setting the flag to false to mention that this was a first time text on an empty note, which is found by the fact that the element had a class 'noteBox'
            flag = false;
        }

        // if the element that is clicked is text, which means there is already text inside the note, which further implies that the user plans to update the text
        else if (e.target.classList.contains('text')){
            // display the input area
            document.getElementById('input-area').style.display='block';
            document.getElementById('main').style.opacity = '0.5';
            document.getElementById('block-area').style.display = 'block';
            currNote = e.target.id;
            // show the previously inputted text inside the notebox
            document.getElementById('input-box').value = e.target.innerHTML;
            // set the flag to true to mention that this was not a first time text
            flag = true;
        }

        // same functionality as previous one, used to capture click on the area of the note not populated with text
        else if (e.target.classList.contains('text-wrapper')){
            document.getElementById('input-area').style.display='block';
            document.getElementById('main').style.opacity = '0.5';
            currNote = e.target.lastChild.id;
            document.getElementById('input-box').value = e.target.lastChild.innerHTML;
            flag = true;
        }
    }

    let closeInputBtn = document.getElementById('closeInput-btn-img');

    // when close-input button is clicked, close/make invisible the input area
    closeInputBtn.addEventListener('click', () => {
        document.getElementById('input-area').style.display = 'none';
        document.getElementById('main').style.opacity = '1';
        document.getElementById('block-area').style.display = 'none';

    })

    let submitBtn = document.getElementById('submit-btn');

    // when submit button in the input area is clicked, close/make invisible the input area and get the text that was entered in the textarea
    submitBtn.addEventListener('click', () => {
        document.getElementById('input-area').style.display='none';
        document.getElementById('main').style.opacity='1';
        text = document.getElementById('input-box').value;
        // create object containing all note details, including noteID, text content, type which determined whether the text is first-time text or updated text, and the name of the user who edited the text, which is this socket user
        let noteDetails = {
            noteID: currNote,
            text: text, 
            type: flag, 
            contributor: sessionStorage.getItem('name') 
        }

        // emit the note details to the server
        socket.emit('noteTextSubmitted', noteDetails);

        // set the text area value to blank so that when new note is added, the previous note will not be seen
        document.getElementById('input-box').value = '';
        // hide the block-area 
        document.getElementById('block-area').style.display = 'none';
    })
})

