import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    Spotify.getAccessToken();
  }
  addTrack(track) {
    console.log('adding ' + track);
    if (this.state.playlistTracks.indexOf(track) !== -1) {
      return;
    }
    let newPlaylistTracks = this.state.playlistTracks;
    newPlaylistTracks.push(track);
    this.setState({
      playlistTracks: newPlaylistTracks
    });
  }
  removeTrack(track) {
    if (this.state.playlistTracks.indexOf(track) === -1) {
      return;
    }
    let newPlaylistTracks = this.state.playlistTracks;
    newPlaylistTracks.splice(track.id);
    this.setState({
      playlistTracks: newPlaylistTracks
    });
  }
  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }
  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => {
      return track.uri;
    });
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({
      playlistName: 'New Playlist',
      searchResults: []
    });
  }
  search(term) {
    if (!term) {
      return;
    }
    Spotify.search(term).then(tracks => {
      this.setState({
        searchResults: tracks
      });
    });
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
              />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
              onRemove={this.removeTrack}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
