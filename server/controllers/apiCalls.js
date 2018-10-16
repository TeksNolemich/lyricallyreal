var api = require('genius-api');
var token = require('../../appKeys.js');
var parse = require('../../parseIt/parse.js');
var genius = new api(token.clientAccessToken);

let lyricSelector = (req, res) => {
  console.log(req.query, ' the rrequest');
  ({ artist, song } = { artist: req.query.artist, song: req.query.song });
  let something = null;
  genius
    .search(song)
    .then(function(response) {
      const artistNameFix = artist => {
        return artist.replace(/\./g, '').toLowerCase();
      };
      for (var i = 0; i < response.hits.length; i++) {
        // console.log(response.hits[i], ' a matched song');
        if (
          artistNameFix(response.hits[i].result.primary_artist.name) ===
          artistNameFix(artist)
        ) {
          something = response.hits[i].result;
          break;
        }
      }
      if (something === null) {
        // console.log(' in the if');
        res.status(200).send('There are no lyrics to grab');
      } else {
        parse.getSongLyrics(something.url).then(result => {
          // console.log(result, ' the results');
          res.status(200).send(result.lyrics);
        });
      }
    })
    .catch(function(error) {
      res.status(500).send(error, ' this was the error');
    });
};

// let getSongs = (req, res) => {
//   let search = req.query;
//   spotify.search({ type: 'track', query: search, limit: 20 }, (err, data) => {
//     if (err) {
//       return console.log('Error occurred: ' + err);
//     }
//     console.log(data);
//     res.status(201).send(data);
//   });
// };

module.exports.lyricSelector = lyricSelector;
