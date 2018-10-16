var express = require('express');
var app = express();
var calls = require('./controllers/apiCalls.js');

const port = 2979;
app.use(express.static(__dirname + '/../client/dist'));
app.get('/search', calls.lyricSelector);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
