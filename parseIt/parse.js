var cheerio = require('cheerio');
var fetch = require('node-fetch');

function parseSongHTML(htmlText) {
  const $ = cheerio.load(htmlText);
  const lyrics = $('.song_body-lyrics').text();
  console.log(lyrics, '<- the lyrics');
  return {
    lyrics,
  };
}
const tester = 'https://genius.com/Damian-marley-welcome-to-jamrock-lyrics';
function getSongLyrics(geniusUrl) {
  return fetch(geniusUrl, {
    method: 'GET',
  })
    .then(response => {
      if (response.ok) return response.text();
      throw new Error('Could not get song url ...');
    })
    .then(parseSongHTML);
}
getSongLyrics(tester);
