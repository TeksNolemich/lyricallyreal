var api = require('genius-api');
var token = require('../../appKeys.js');
var genius = new api(token.clientAccessToken);

let getSong = (req, res) => {
  let somthing;
  genius
    .search('Welcome to jamrock')
    .then(function(response) {
      for (var i = 0; i < response.hits.length; i++) {
        if (response.hits[i].result.primary_artist.name === 'Damian Marley') {
          something = response.hits[i].result;
          break;
        }
      }
      console.log(something);
      res.status(200).send(something.url);
    })
    .catch(function(error) {
      res.status(500).send(error);
    });
};

module.exports.getSong = getSong;
// genius
//   .songsByArtist(1132, {
//     per_page: 10,
//     sort: 'popularity',
//   })
//   .then(function(songs) {
//     console.log(songs);
//   });
