document.addEventListener('DOMContentLoaded', async(e) => {
    const userList = document.querySelector('.userList');
    const token = localStorage.getItem('token');
    const config = {
        headers: {"Authorization" : token}
    }
    const res = await axios.get('http://localhost:3000/chats/ActiveUsers', config);
    console.log(res);
    res.data.activeUsers.forEach(user => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'list-group-item-secondary','pt-0');
        const div = document.createElement('div');
        div.classList.add('d-flex','align-items-center');
        const imageDiv = document.createElement('div');
        imageDiv.classList.add('flex-shrink-0','me-3');
        const avatar = document.createElement('img');
        avatar.classList.add('text-center')
        avatar.src = user.userstatus.avatar;
        avatar.classList.add('avatar','rounded-circle');
        avatar.style.width =  '3rem';
        avatar.style.height = '3rem';
        imageDiv.appendChild(avatar);
        const textDiv = document.createElement('div');
        textDiv.classList.add('flex-grow-1');
        const text = document.createElement('p');
        text.classList.add('mb-0','text-muted');
        text.appendChild(document.createTextNode(`${user.name} joined`));
        textDiv.appendChild(text);
        div.appendChild(imageDiv);
        div.appendChild(textDiv);
        li.appendChild(div);
        userList.appendChild(li);
    })
})

