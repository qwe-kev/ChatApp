const express = require('express');

const path = require('path');

const app = express();

const User = require('./models/user');

const Chat = require('./models/chats');

const UserStatus = require('./models/userStatus');

const userRoutes = require('./routes/userRoute');

const chatRoutes = require('./routes/chatRoutes');

const sequelize = require('./util/database');

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

app.use('/', (req, res, next) => {
    res.status(404).send("<h1>page not found</h1>")
})

User.hasOne(UserStatus);

User.hasMany(Chat,  { onDelete: 'CASCADE', hooks: true });

Chat.belongsTo(User);

sequelize.sync()
.then(() => {
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    });
})
.catch(err => {
    console.log(err);
})
