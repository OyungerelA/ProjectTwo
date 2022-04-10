// JS file for landing page (index.html), client-side
// ---------------------------------------------------

window.addEventListener('load', () => {
    let joinForm = document.getElementById('join-form');

    joinForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let name = document.getElementById('name-input').value;
        let room = document.getElementById('room-input').value;
        console.log(name, room);

        sessionStorage.setItem('name', name);
        sessionStorage.setItem('room', room);

        window.location = '/board.html';
    })

    let helpInfo = document.getElementById('help-text');
    helpInfo.addEventListener('mouseover', () => {
        document.getElementById('instructions').style.display = 'block';
    })

    helpInfo.addEventListener('mouseleave', () => {
        document.getElementById('instructions').style.display = 'none';
    })
})