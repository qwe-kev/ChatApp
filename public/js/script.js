let avatarSrc = new Map();
let currentUser;

async function getMessages() {
    const messageList = document.querySelector('.messageList');
    messageList.innerHTML = "";
    const messages = JSON.parse(localStorage.getItem('chats'))
    if(messages) {
        messages.forEach(user => {
            if(user.message.length > 0) {
                const li = document.createElement('li');
                const messageText = document.createElement('p');
                if(currentUser === user.name) {
                    li.classList.add('rounded-top-right-20','rounded-bottom-20','list-group-item', 'list-group-item-light','mb-1','border','border-outline-dark');
                    li.style.backgroundColor = "#9cc3c0";
                    li.style.color = "#fff"
                    messageText.classList.add('mb-0');
                    messageText.style.color = '#fff'
                }
                else{
                    li.classList.add('rounded-top-left-20','rounded-bottom-20','list-group-item', 'list-group-item','mb-1','border','border-outline-dark');
                    li.style.backgroundColor = "#f6f5f1";
                     messageText.classList.add('mb-0');
                    messageText.style.color = '#808791'
                }
                const imageDiv = document.createElement('div');
                imageDiv.classList.add('flex-shrink-0','m-1');
                const avatar = document.createElement('img');
                avatar.classList.add('text-center')
                avatar.src = avatarSrc.get(user.name);
                avatar.classList.add('avatar','rounded-circle');
                avatar.style.width =  '2rem';
                avatar.style.height = '2rem';
                imageDiv.appendChild(avatar);
                const div = document.createElement('div');
                div.classList.add('d-flex','align-items-center');
                const textDiv = document.createElement('div');
                textDiv.classList.add('flex-grow-1');
                
                const nameHeading = document.createElement('h6');
                const nameNode = document.createTextNode(`${user.name}`)
                //textDiv.appendChild(document.createElement("br"));
                messageText.appendChild(document.createTextNode(`${user.message}`));
                var timeStamp = document.createElement('sub');
                timeStamp.classList.add('text-dark','pt-1');
                timeStamp.appendChild(document.createTextNode(new Date(Date.parse(user.createdAt)).toLocaleString()));
                nameHeading.appendChild(nameNode);
                textDiv.appendChild(messageText);
                div.appendChild(imageDiv);
                div.appendChild(nameHeading);
                div.appendChild(document.createElement("br"));
                div.appendChild(textDiv);
                div.appendChild(timeStamp);
                li.appendChild(div);
                messageList.appendChild(li);
            }
           })
    }
    
}

async function polling() {
    const token = localStorage.getItem('token');
    const config = {
        headers: {"Authorization" : token}
    }
    const messages = await axios.get('http://localhost:3000/chats/getMessages', config);
    if(localStorage.getItem('chats') == undefined) {
        if(messages.data.messages.length > 10) {
            localStorage.setItem('chats', JSON.stringify(messages.data.messages.slice(messages.data.messages.length - 10)));
        }
        else {
            localStorage.setItem('chats', JSON.stringify(messages.data.messages));
        }
    }
    else{
        if(messages.data.messages.length > 10) {
            localStorage.setItem('chats', JSON.stringify(messages.data.messages.slice(messages.data.messages.length - 10)));
        }
        else {
            localStorage.setItem('chats', JSON.stringify(messages.data.messages));
        }
    }
    getMessages();
}

document.addEventListener('DOMContentLoaded', async(e) => {
    const userList = document.querySelector('.userList');
    const messageList = document.querySelector('.messageList');
    const token = localStorage.getItem('token');
    const config = {
        headers: {"Authorization" : token}
    }
    const res = await axios.get('http://localhost:3000/chats/ActiveUsers', config);
    currentUser = res.data.currentUser;
    console.log(res, "current user", res.data.currentUser);
    res.data.activeUsers.forEach(user => {
        avatarSrc.set(user.name, user.userstatus.avatar);
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'list-group-item-light','border','border-light','pt-0','ps-2');
        const div = document.createElement('div');
        div.classList.add('d-flex','align-items-center');
        // const imageDiv = document.createElement('div');
        // imageDiv.classList.add('flex-shrink-0','me-3');
        // const avatar = document.createElement('img');
        // avatar.classList.add('text-center')
        // avatar.src = user.userstatus.avatar;
        // avatar.classList.add('avatar','rounded-circle');
        // avatar.style.width =  '2rem';
        // avatar.style.height = '2rem';
        // imageDiv.appendChild(avatar);
        const textDiv = document.createElement('div');
        textDiv.classList.add('flex-grow-1');
        const text = document.createElement('p');
        text.classList.add('mb-0','text-dark','ps-2');
        text.appendChild(document.createTextNode(`${user.name} joined`));
        textDiv.appendChild(text);
       // div.appendChild(imageDiv);
        div.appendChild(textDiv);
        li.appendChild(div);
        userList.appendChild(li);
    })

   setInterval(polling, 1000);
})

async function newMessage(e) {
    const message = document.getElementById('btn-input').value;
    if(message.length > 0) {
        const token = localStorage.getItem('token');
        const config =  {
            headers: {"Authorization" : token}
        }
        const res = await axios.post('http://localhost:3000/chats/newMessage', {message : message}, config);
        console.log("--response---", res);
    }

}

document.getElementById('my-form').addEventListener('submit', (e) => {
        e.preventDefault();
        newMessage();
})