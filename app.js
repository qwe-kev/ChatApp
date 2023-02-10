const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, "views", "signup.html"));
})
app.listen(3000, (req, res) => {
    console.log("open on port 3000");
})