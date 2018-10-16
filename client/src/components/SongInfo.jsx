import React from 'react';

const pStyle = {
  width: '200px',
  height: '200px',
};

const SongInfo = props => {
  // return <div>{nl2br(props.lyrics)}</div>;
  return (
    <div>
      <div>{props.songShit.artist}</div>
      <div>{props.songShit.song}</div>
      {props.songShit.albumArt.length > 0 ? (
        <img
          src={props.songShit.albumArt}
          alt="AlbumArt"
          style={pStyle}
          onClick={props.playAndPause}
          className="img-thumbnail"
        />
      ) : (
        <div />
      )}
    </div>
  );
};

export default SongInfo;
