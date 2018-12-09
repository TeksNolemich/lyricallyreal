import React from 'react';
import axios from 'axios';
import { Search, Grid, Header, Segment } from 'semantic-ui-react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artistName: '',
      songName: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    console.log(event.target, ' the event');
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    axios
      .get('/search', {
        params: {
          artist: this.state.artistName,
          song: this.state.songName,
        },
      })
      .then(response => {
        console.log(' this the is the response');
        console.log(response.data);
      });
    // console.log(this.state.artistName, this.state.songName);
  }

  render() {
    return (
      <div className="search-container-center">
        <label>ArtistName</label>
        <input
          className="form-control
          mr-sm-2"
          type="text"
          value={this.state.value}
          name={'artistName'}
          onChange={this.handleChange}
        />
        <label>SongName</label>
        <input
          className="form-control mr-sm-2"
          type="text"
          value={this.state.value}
          name={'songName'}
          onChange={this.handleChange}
        />
        <button type="Submit" onClick={this.handleSubmit}>
          Hit IT
        </button>
      </div>
    );
  }
}
export default App;
