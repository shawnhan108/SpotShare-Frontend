import React from 'react';

import './Toolbar.css';

const toolbar = props => (
    <div className="toolbar" style={{ position: 'relative', zIndex: '1' }}>
       {props.children}
    </div>
);

export default toolbar;