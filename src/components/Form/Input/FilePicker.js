import React from 'react';

import './Input.css';
import {Form} from 'react-bootstrap';

const filePicker = props => (
  <div className="input">
    <Form.Label htmlFor={props.id}>{props.label}</Form.Label>
    <Form.Control
      className={[
        !props.valid ? 'invalid' : 'valid',
        props.touched ? 'touched' : 'untouched'
      ].join(' ')}
      type="file"
      id={props.id}
      onChange={e => props.onChange(props.id, e.target.value, e.target.files)}
      onBlur={props.onBlur}
    />
  </div>
);

export default filePicker;
