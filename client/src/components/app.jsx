import React from 'react';
import axios from 'axios';
import SongInfo from './SongInfo.jsx';
import Lyrics from './Lyrics.jsx';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends React.Component {
  constructor(props) {
    super(props);
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      toked: token ? true : false,
      songShit: { artist: '', song: '', albumArt: '', lyrics: '' },
    };
    this.getCurrentSong.bind(this);
    this.pullLyrics.bind(this);
  }
  //spotify provided hashing function
  getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  getCurrentSong() {
    spotifyApi.getMyCurrentPlaybackState().then(response => {
      this.setState({
        songShit: {
          artist: response.item.artists[0].name,
          song: response.item.name,
          albumArt: response.item.album.images[0].url,
        },
      });
    });
  }

  pullLyrics() {
    const context = this;
    axios
      .get('/search', {
        params: {
          artist: this.state.songShit.artist,
          song: this.state.songShit.song,
        },
      })
      .then(response => {
        context.setState({ lyrics: response.data });
      })
      .catch(err => {
        console.log(err, ' there was an error somewhere');
      });
  }

  render() {
    return (
      <div className="container">
        <a href="http://localhost:8888"> Login to Spotify </a>
        <br />
        <div className="row">
          <div className="col-sm">
            {this.state.toked && (
              <button onClick={() => this.getCurrentSong()}>
                Whatchu Listening to?
              </button>
            )}
            <br />
            <SongInfo songShit={this.state.songShit} />
          </div>
          <div className="col-sm">
            {this.state.toked && (
              <button onClick={() => this.pullLyrics()}>Lyrically Hurr</button>
            )}
            <Lyrics lyrics={this.state.lyrics} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
