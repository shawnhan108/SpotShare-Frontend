import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

const backdrop = props =>
 (<div
  className={['backdrop', props.open ? 'open' : ''].join(' ')}
  onClick={props.onClick}
/>);

export default backdrop;
