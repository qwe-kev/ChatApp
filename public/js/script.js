let avatarSrc = new Map();
let currentUser;

async function getMessages() {
    const messageList = document.querySelector('.messageList');
    messageList.innerHTML = "";
    const messages = JSON.parse(localStorage.getItem('chats'))
    const activeGroup = +JSON.parse(localStorage.getItem('currentGroup'));
    if(messages) {
        messages.forEach(user => {
            if(user.message.length > 0 && +user.groupId === activeGroup) {
                const li = document.createElement('li');
                const messageText = document.createElement('p');
                messageText.classList.add('text-dark')
                if(currentUser === user.name) {
                    li.classList.add('rounded-top-right-20','rounded-bottom-20','list-group-item', 'list-group-item-light','mb-1','border','border-outline-dark');
                    li.style.backgroundColor = "#fbf8f4";
                    li.style.color = "#000"
                    messageText.classList.add('mb-0');
                    messageText.style.color = '#fff';
                }
                else{
                    li.classList.add('rounded-top-left-20','rounded-bottom-20','list-group-item', 'list-group-item','mb-1','border','border-outline-dark');
                    li.style.backgroundColor = "#ebc7b9";
                    li.style.color = '#000'
                     messageText.classList.add('mb-0');
                    messageText.style.color = '#000'
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
                let nameNode;
                if(currentUser === user.name) {
                    nameNode = document.createTextNode(`you`)
                }
                else{
                    nameNode = document.createTextNode(`${user.name}`)
                }
                messageText.appendChild(document.createTextNode(`${user.message}`));
                var timeStamp = document.createElement('sub');
                timeStamp.classList.add('text-dark','pt-1');
                timeStamp.appendChild(document.createTextNode(new Date(Date.parse(user.createdAt)).toLocaleTimeString()));
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

async function getGroups(){
    const groupList = document.querySelector('#groupList');
    const token = localStorage.getItem('token');
        const config =  {
            headers: {"Authorization" : token}
        }
    const groups = await axios.get('http://localhost:3000/groups/getGroups', config);
    console.log('----grouplist-----', groups);
    groups.data.groups.forEach(group => {
        const li = document.createElement('li');
    li.innerHTML = `
    <a id="${group.UserGroups[0].groupId}" href="#chat_room.html">
        <i class="fa fa-users"></i>
        <span>${group.name}</span>
        <i class="fa fa-times pull-right"></i>
    </a>`
    groupList.appendChild(li);
    }) 
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
    console.log("all users", res.data.activeUsers);

    res.data.activeUsers.forEach(user => {
        avatarSrc.set(user.name, user.userstatus.avatar);
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'list-group-item-light','border','border-light','pt-0','ps-2');
        const div = document.createElement('div');
        div.classList.add('d-flex','align-items-center');
        const textDiv = document.createElement('div');
        textDiv.classList.add('flex-grow-1');
        const text = document.createElement('p');
        text.classList.add('mb-0','text-dark','ps-2');
        if(currentUser === user.name) {
            text.appendChild(document.createTextNode(`you joined`));
        }
        else {
            text.appendChild(document.createTextNode(`${user.name} joined`));
        }
        textDiv.appendChild(text);
       // div.appendChild(imageDiv);
        div.appendChild(textDiv);
        li.appendChild(div);
        userList.appendChild(li);
    })
    getGroups();
    polling();
    //setInterval(polling, 1000);
})

async function newMessage(e) {
    const message = document.getElementById('btn-input').value;
    if(message.length > 0) {
        const token = localStorage.getItem('token');
        const currentGroup = +JSON.parse(localStorage.getItem('currentGroup'));
        const config =  {
            headers: {"Authorization" : token}
        }
        const res = await axios.post('http://localhost:3000/chats/newMessage', {message : message, groupId : currentGroup}, config);
        console.log("--response---", res);
    }

}

async function newGroup(e) {
    const groupName = document.querySelector('#group-name').value;
    //console.log(groupName);
    var members = Array.from(document.getElementById("choices-multiple-remove-button").options).filter(option => option.selected).map(option => option.value);

    console.log(groupName, members);
    const token = localStorage.getItem('token');
        const config =  {
            headers: {"Authorization" : token}
        }
    const res = await axios.post('http://localhost:3000/groups/newGroup', {groupName : groupName, members : members}, config)
    console.log('res group', res.data);
    const groupList = document.querySelector('#groupList');
    const li = document.createElement('li');
    li.innerHTML = `
    <a href="#chat_room.html">
        <i class="fa fa-rocket"></i>
        <span>${res.data.group}</span>
        <i class="fa fa-times pull-right"></i>
    </a>`
    groupList.appendChild(li);
    const activeMembers = document.querySelector('.chat-user');
    res.data.members.forEach(member => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="##">
        <i class="fa fa-circle text-success"></i>
        <span>${member}</span>
        <i class="fa fa-times pull-right"></i>
    </a>`;
    activeMembers.appendChild(li);
    })
}

document.getElementById('my-form').addEventListener('submit', (e) => {
        e.preventDefault();
        newMessage();
})

document.getElementById('group-form').addEventListener('submit', (e) => {
    e.preventDefault();
    newGroup();
})

document.getElementById('groupList').addEventListener('click', async (e) => {
   // console.log(e.target);
    document.getElementById('groupTitle').textContent = `${e.target.textContent}`
    for (const li of document.querySelectorAll("li.active")) {
        li.classList.remove("active");
      }
    e.target.parentElement.parentElement.classList.add('active');
    const token = localStorage.getItem('token');
    const config =  {
        headers: {"Authorization" : token}
    }
    const groupId = +e.target.parentElement.id;
    localStorage.setItem('currentGroup', JSON.stringify(groupId));
    const response = await axios.get(`http://localhost:3000/groups/users/${groupId}`, config);
    //console.log('---groupmembers---', response.data);
    response.data.groupUsers.forEach(group => {
        console.log(group.name, JSON.stringify(group.UserGroups[0]));
        localStorage.setItem(group.name, JSON.stringify(group.UserGroups[0]));
    })
    const activeMembers = document.querySelector('.chat-user');  
    activeMembers.innerHTML = '';     
    const groupUsers = response.data.groupUsers
    groupUsers.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="##">
        <i class="fa fa-circle text-success"></i>
        <span>${user.name}</span>
        <i class="fa fa-times pull-right"></i>
    </a>`;
    activeMembers.appendChild(li);
    })
   
})

document.querySelector('.chat-user').addEventListener('click', async(e) => {
    if(e.target.classList.contains('pull-right')) {
        const member = e.target.parentElement.children[1].textContent;
        if(JSON.parse(localStorage.getItem(member)).isadmin === false) {
            if(confirm(alert(`remove ${member} from group?`))){
                const token = localStorage.getItem('token');
                const config =  {
                    headers: {"Authorization" : token}
                }
                const groupUserId = +JSON.parse(localStorage.getItem(member)).id;
                const groupId = +JSON.parse(localStorage.getItem('currentGroup'));
                const response = await axios.post('http://localhost:3000/groups/deleteUser', {groupId : groupId, member : member, groupUserId : groupUserId}, config);
                console.log(response);
                if(response.data.message === 'Successfully removed user') {
                    alert('removed user');
                }
                else{
                    alert('Oops, something happended');
                }
            }
           
        }
        else{
            alert('Sorry, only admins can remove users');
        }
       
    };
})