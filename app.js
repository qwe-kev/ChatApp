const express = require('express');

const path = require('path');

const app = express();



const User = require('./models/user');

const Chat = require('./models/chats');

const UserGroup = require('./models/userGroup');

const Group = require('./models/groups');

const UserStatus = require('./models/userStatus');



const userRoutes = require('./routes/userRoute');

const chatRoutes = require('./routes/chatRoutes');

const groupRoutes = require('./routes/groupRoutes')

const sequelize = require('./util/database');


User.hasMany(Chat,  { onDelete: 'CASCADE', hooks: true });
User.hasMany(UserGroup);

User.hasOne(UserStatus);

Group.hasMany(Chat);
Group.hasMany(UserGroup);

UserGroup.belongsTo(User);
UserGroup.belongsTo(Group);

Chat.belongsTo(User);
Chat.belongsTo(Group);


require('dotenv').config();

const port = process.env.API_PORT || 3000;

const cors = require('cors');


app.use(cors({
    origin : '*',
}))

app.use(express.urlencoded({extended : true}))

app.use(express.json());

app.use(express.static('public'));

app.use('/users', userRoutes);

app.use('/chats', chatRoutes);

app.use('/groups', groupRoutes);

app.use('/', (req, res, next) => {
    res.status(404).send("<h1>page not found</h1>")
})



// Chat.belongsTo(User);

// Chat.belongsTo(Group);

// User.belongsToMany(Group, { through: 'user_groups' });

// Group.belongsToMany(User, { through: 'user_groups' });

// Group.hasMany(Chat);

sequelize.sync()
.then(() => {
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    });
})
.catch(err => {
    console.log(err);
})
