var express = require('express');
var app = express();
const port = 2979;
app.use(express.static(__dirname + '/../client/dist'));
// app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
