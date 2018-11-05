import React from 'react';
import axios from 'axios';
import SongInfo from './SongInfo.jsx';
import Lyrics from './Lyrics.jsx';
import SpotifyWebApi from 'spotify-web-api-js';
import key from '../../../appKeys.js';
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
      songShit: {
        artist: '',
        song: '',
        albumArt: '',
        lyrics: '',
      },
      playing: true,
    };
    this.getCurrentSong.bind(this);
    this.pullLyrics.bind(this);
    this.playerCheck.bind(this);
    this.playerCheckInterval = null;
    this.playAndPause.bind(this);
    this.tokenRefresh.bind(this);
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
    this.playerCheckInterval = setInterval(() => this.playerCheck(), 1000);
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
    context.setState({ lyrics: 'We Out Hurr Searchin' });
    axios
      .get('/search', {
        params: {
          artist: this.state.songShit.artist,
          song: this.state.songShit.song,
        },
      })
      .then(response => {
        console.log(response, ' in the get request');
        context.setState({ lyrics: response.data });
      })
      .catch(err => {
        console.log(err, ' there was an error somewhere');
      });
  }

  playerCheck() {
    const token = key.webPlayerToken;
    if (window.Spotify !== null) {
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: "Arthur's Personal Player",
        getOAuthToken: cb => {
          cb(key.clientAccessToken);
        },
      });
      this.createEventHandlers();

      // finally, connect!
      this.player.connect();
    }
  }

  createEventHandlers() {
    this.player.on('initialization_error', e => {
      console.error(e);
    });
    this.player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: false });
    });
    this.player.on('account_error', e => {
      console.error(e);
    });
    this.player.on('playback_error', e => {
      console.error(e);
    });

    // Playback status updates
    this.player.on('player_state_changed', state => {
      console.log(state);
    });

    // Ready
    this.player.on('ready', data => {
      let { device_id } = data;
      console.log('Let the music play on!, device_id');
      this.setState({ deviceId: device_id });
    });
  }

  playAndPause() {
    const context = this;
    if (this.state.playing) {
      spotifyApi
        .pause()
        .then()
        .catch(err => console.log(err, ' caught in the error'));
      this.setState({ playing: !this.state.playing });
    } else {
      this.setState({ playing: !this.state.playing });
      spotifyApi.play().then(console.log(' the song should be playing'));
    }
  }

  tokenRefresh() {
    console.log(' lciked');
    axios.get('/refresh_token', {
      params: {
        refresh:
          'AQCbo1SAN2imSCZ7VyFhd3eoUWK0f2F1FLyvyiLKxLDdwECDWj3j2NbPqhEySsYgzinhB7v4nOe9XbJlvuXzsmxY67xCpNYi7yqAjkTBqKHdGXPw4zS_5vVrZlHHRwnUMBtsCQ',
      },
    });
  }
  render() {
    return (
      // (
      //   <button className="btn btn-primary btn-sm" onClick={this.tokenRefresh}>
      //     refresh token
      //   </button>
      // );
      <div className="container">
        <div className="d-flex justify-content-end">
          <a href="http://localhost:8888">Login to Spotify </a>
        </div>
        <br />
        <div className="row">
          <div className="col-sm">
            {this.state.toked && (
              <button
                onClick={() => this.getCurrentSong()}
                className="btn btn-primary btn-lg"
              >
                Whatchu Listening to?
              </button>
            )}
            <br />
            <SongInfo
              songShit={this.state.songShit}
              playAndPause={this.playAndPause.bind(this)}
            />
          </div>
          <div className="col-sm">
            {this.state.toked && (
              <button
                onClick={() => this.playerCheck()}
                className="btn btn-primary btn-lg"
              >
                {' '}
                Make Browser Available
              </button>
            )}
          </div>
          <div className="col-sm">
            {this.state.toked && (
              <button
                onClick={() => this.pullLyrics()}
                className="btn btn-primary btn-lg"
              >
                Lyrically Hurr
              </button>
            )}

            <Lyrics lyrics={this.state.lyrics} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
