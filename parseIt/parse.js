var cheerio = require('cheerio');
var fetch = require('node-fetch');

function parseSongHTML(htmlText) {
  const $ = cheerio.load(htmlText);
  const lyrics = $('.song_body-lyrics').text();
  return {
    lyrics,
  };
}

exports.getSongLyrics = geniusUrl => {
  return fetch(geniusUrl, {
    method: 'GET',
  })
    .then(response => {
      if (response.ok) return response.text();
      throw new Error('Could not get song url ...');
    })
    .then(parseSongHTML);
};
