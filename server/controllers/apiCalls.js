var api = require('genius-api');
var token = require('../../appKeys.js');
var parse = require('../../parseIt/parse.js');
var request = require('request');
var genius = new api(token.clientAccessToken);

let lyricSelector = (req, res) => {
  ({ artist, song } = { artist: req.query.artist, song: req.query.song });
  let something = null;
  genius
    .search(song)
    .then(function(response) {
      const artistNameFix = artist => {
        return artist.replace(/\./g, '').toLowerCase();
      };
      for (var i = 0; i < response.hits.length; i++) {
        if (
          artistNameFix(response.hits[i].result.primary_artist.name) ===
          artistNameFix(artist)
        ) {
          something = response.hits[i].result;
          break;
        }
      }
      if (something === null) {
        res.status(200).send('There are no lyrics to grab');
      } else {
        parse.getSongLyrics(something.url).then(result => {
          res.status(200).send(result.lyrics);
        });
      }
    })
    .catch(function(error) {
      res.status(500).send(error, ' this was the error');
    });
};

// app.get('/refresh_token', function(req, res) {
let refreshToken = (req, res) => {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(token.spottyClient + ':' + token.spottySecret).toString(
          'base64',
        ),
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(response, ' the response, and the body => ', body);
      var access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
};

module.exports.lyricSelector = lyricSelector;
module.exports.refreshToken = refreshToken;
