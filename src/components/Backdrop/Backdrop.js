import React from 'react';

import './Backdrop.css';

const backdrop = props =>
 (<div
  className={['backdrop', props.open ? 'open' : ''].join(' ')}
  onClick={props.onClick}
/>);

export default backdrop;
