// JS file for board page (board.html), client-side
// ------------------------------------------------
let count=0;
let userNames = [];
// client connecting to the server
let socket = io();
// contains value of the color selected
let colorVal, temp, currNote, text;
// temp variable 
// flag that when true means the user changed text, when false means user inputted text for the first time
let flag = false;

// getting confirmation that the client is connected
socket.on('connect', () => {
    console.log('connected to the server');

    let data = {
        'name': sessionStorage.getItem('name'),
        'room': sessionStorage.getItem('room')
    }

    socket.emit('userData', data);
})

socket.on('roomName', (data) => {
    console.log(data);

    let boardNameArea = document.getElementById('board-name');
    let boardName = document.createElement('p');
    boardName.innerHTML = data;
    boardNameArea.appendChild(boardName);
})

socket.on('roomSize', (data) => {
    console.log(data);

    let memberCountArea = document.getElementById('member-count');

    if (count > 0)
        memberCountArea.removeChild(memberCountArea.lastChild);
    
    let memberCount = document.createElement('p');
    memberCount.innerHTML = data;
    memberCountArea.appendChild(memberCount);

    count++;
})

socket.on('noteColor', (data) => {
    console.log('color clicked' + data.color);
    console.log('frequency' + data.value);
    addNote(data.color, data.value);
})

socket.on('removeIconClicked', (id) => {
    removeElement(id);
})

socket.on('noteTextDetails', (data) => {
    console.log(data.noteID, data.text, data.contributor);
    addText(data.noteID, data.text, data.type, data.contributor);
})

// socket.on('userConnected', (data) => {
//     let memberInfoArea = document.getElementById('user-info-container');

//     let memberName = document.createElement('p');
//     memberName.innerHTML = data.users[(data.users.length)-1];
//     memberInfoArea.appendChild(memberName);
//     // console.log(data);
// })

// socket.on('userDisconnected', (data) => {
//     let memberInfoArea = document.getElementById('user-info-container');

//     for (let i=0; i<memberInfoArea.childElementCount+1; i++){
//         memberInfoArea.removeChild(memberInfoArea.lastChild);
//     }

//     let memberName;
//     for (let j=0; j<data.size; j++){
//         memberName = document.createElement('p');
//         memberName.innerHTML = data.users[j];
//         memberInfoArea.appendChild(memberName);
//     }
// })

// ------------------------------------------
// ------------------------------------------
// socket.on('usersInRoom', (data) => {
//     console.log(data);

//     // showing room name
//     let boardNameArea = document.getElementById('board-name');
//     let boardName = document.createElement('p');
//     boardName.innerHTML = data.name;
//     boardNameArea.appendChild(boardName);

//     // showing room size
//     let memberCountArea = document.getElementById('member-count');

//     if (count > 0)
//         memberCountArea.removeChild(memberCountArea.lastChild);
    
//     let memberCount = document.createElement('p');
//     memberCount.innerHTML = data.size;
//     memberCountArea.appendChild(memberCount);

//     count++;

//     // showing user names
//     let memberInfoArea = document.getElementById('    user-info-container');

//     if (data.action == 'plus'){
//         let memberName = document.createElement('p');
//         memberName.innerHTML = data.users[(data.users.length)-1];
//         memberInfoArea.appendChild(memberName);
//     }

//     else if (data.action == 'minus'){
//         for (let i=0; i<memberInfoArea.childElementCount; i++){
//             memberInfoArea.removeChild(memberInfoArea.lastChild);
//         }

//         let memberName;
//         for (let j=0; j<data.size; j++){
//             memberName = document.createElement('p');
//             memberName.innerHTML = data.users[j];
//             memberInfoArea.appendChild(memberName);
//         }
//     }
// })
// ------------------------------------------
// ------------------------------------------


function addNote(color, value){
    document.getElementById('input-box').value = '';

    let noteWrapper = document.createElement('div');
    noteWrapper.classList.add('note-box-wrapper');
    noteWrapper.style.position = 'relative';
    noteWrapper.id = `note-box-wrapper${value}`;

    let note = document.createElement('img');
    note.id = `${value}`;
    note.classList.add('noteBox');

    let boardArea = document.getElementById('board-area');

    if (color=='1')
        note.src = 'images/note1.png'
    else if (color=='2')
        note.src = 'images/note2.png'
    else if (color=='3')
        note.src = 'images/note3.png'
    else if (color=='4')
        note.src = 'images/note4.png'
    else if (color=='5')
        note.src = 'images/note5.png'
    else if (color=='6')
        note.src = 'images/note6.png'
    else
        note.src = 'images/note7.png'

    // note.style.height = '50';
    // note.width = 'auto';
    noteWrapper.appendChild(note);

    let removeIcon = document.createElement('img');
    removeIcon.src = 'images/cancel.png';
    removeIcon.id = `remove${value}`;
    removeIcon.classList.add('removeIcon');

    removeIcon.style.width = '12px';
    removeIcon.style.height = '12px';
    removeIcon.style.position = 'absolute';
    removeIcon.style.top = '4px';
    removeIcon.style.right = '4px';
    removeIcon.style.padding = '3px'
    removeIcon.style.background = 'none';

    noteWrapper.appendChild(removeIcon);
    boardArea.appendChild(noteWrapper);
}

function addText(noteID, noteText, noteType, noteContributor){
    console.log(noteType);
    if (noteType==false){
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

        // let userList = [];
        // userList.push(noteContributor);
        let userListWrapper = document.createElement('div');
        userListWrapper.id = `user-wrapper${noteID}`;
        userListWrapper.classList.add('user-wrapper');
        let textUserList = document.createElement('p');
        textUserList.id = `textUser${noteID}`;
        textUserList.innerHTML = noteContributor;
        userListWrapper.appendChild(textUserList);
        noteArea.appendChild(userListWrapper);
    }
    else{
        console.log(noteID, noteText, noteType);
        let parent = document.getElementById(`${noteID}`).parentNode;
        parent.removeChild(document.getElementById(`${noteID}`));
        // console.log(document.getElementById(noteID).parentNode);
        let text = document.createElement('p');
        text.classList.add('text');
        text.id = `text${noteID}`;
        text.innerHTML = noteText;
        parent.appendChild(text);

        let id = noteID.match(/\d/g);
        id = id.join("");   

        let userListText = document.getElementById(`textUser${id}`);
        if (!((userListText.innerHTML).includes(noteContributor))){
            userListText.innerHTML += `, ${noteContributor}`;
        }
    }

}


function getColor(){ 
    let color = document.getElementById('color-select');
    // console.log(color.value);
    return color.value;
}

function removeElement(id){
    let elem = document.getElementById(id);
    console.log('returned' + id);

    let sound = document.getElementById('audio');
    sound.play();
    return elem.parentNode.removeChild(elem);    
}



window.addEventListener('load', () => {
    // add interactivity to back button - when clicked, go back to the landing page 
    // LATER ADD - when sent back, the input fields should not be cleared, set the value back to how it was before

    let backBtn = document.getElementById('back-btn');
    backBtn.addEventListener('click', () => {
        // window.location = '/';
        window.history.back()
    })

    let color;

    // add note on click
    let addNoteBtn = document.getElementById('addNote-btn');
    addNoteBtn.addEventListener('click', () => {
        // addNote(color);
        color = getColor();
        socket.emit('addNoteClicked', color);
    })

    // adding interactivity to clicking on board area
    let boardArea = document.getElementById('board-area');

    boardArea.onclick = e => {

        console.log(e.target);

        if (e.target.classList.contains('removeIcon')){
            console.log('remove icon pressed');
            temp = e.target.parentNode.id;
            socket.emit('removeIconClicked', temp);
            // removeElement(temp);
        }

        else if (e.target.classList.contains('noteBox')){
            document.getElementById('input-area').style.display = 'block';
            document.getElementById('main').style.opacity = '0.3';
            currNote = e.target.id;
            flag = false;
        }

        else if (e.target.classList.contains('text')){
            document.getElementById('input-area').style.display='block';
            document.getElementById('main').style.opacity = '0.3';
            // let id = e.target.id;
            // currNote = id.substr(id.length - 1);
            currNote = e.target.id;
            document.getElementById('input-box').value = e.target.innerHTML;
            flag = true;
        }

        else if (e.target.classList.contains('text-wrapper')){
            document.getElementById('input-area').style.display='block';
            document.getElementById('main').style.opacity = '0.3';
            // let id = e.target.lastChild.id;
            // currNote = id.substr(id.length - 1);
            currNote = e.target.lastChild.id;
            document.getElementById('input-box').value = e.target.lastChild.innerHTML;
            // console.log(e.target.lastChild)
            flag = true;
        }


        console.log('this is currnote: ' + currNote);

    }

    // adding interactivity to close button in input area
    let closeInputBtn = document.getElementById('closeInput-btn-img');

    closeInputBtn.addEventListener('click', () => {
        document.getElementById('input-area').style.display = 'none';
        document.getElementById('main').style.opacity = '1';
    })

    // adding interactivity to submit button in input area
    let submitBtn = document.getElementById('submit-btn');

    submitBtn.addEventListener('click', () => {
        document.getElementById('input-area').style.display='none';
        document.getElementById('main').style.opacity='1';
        text = document.getElementById('input-box').value;
        let noteDetails = {
            noteID: currNote,
            text: text, 
            type: flag, 
            contributor: sessionStorage.getItem('name') 
        }
        // if (flag==false)
        //     socket.emit('noteTextSubmitted', noteDetails);
        // else{

        // }
        socket.emit('noteTextSubmitted', noteDetails);

        document.getElementById('input-box').value = '';

    })
})

