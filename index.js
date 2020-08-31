const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(3000);