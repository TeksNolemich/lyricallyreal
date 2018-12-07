import React from 'react';
import nl2br from 'react-newline-to-break';

const Lyrics = props => {
  console.log(props.lyrics);
  return <div>{nl2br(props.lyrics)}</div>;
};

export default Lyrics;
