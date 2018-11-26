var express = require('express');
var app = express();
var calls = require('./controllers/apiCalls.js');

const port = 2979;
app.use(express.static(__dirname + '/../client/dist'));
app.get('/search', calls.lyricSelector);
app.get('/refresh_token', calls.refreshToken);
app.listen(port, () => console.log(`listening on port: ${port}! hurrah`));
