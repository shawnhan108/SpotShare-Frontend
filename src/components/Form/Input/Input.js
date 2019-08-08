import React from 'react';
import {Form} from 'react-bootstrap';

import './Input.css';

const input = props => (
  <div className="input">
    {props.label && <Form.Label htmlFor={props.id}>{props.label}</Form.Label>}
    {props.control === 'input' && (
      <Form.Control
        className={[
          !props.valid ? 'invalid' : 'valid',
          props.touched ? 'touched' : 'untouched'
        ].join(' ')}
        type={props.type}
        id={props.id}
        required={props.required}
        value={props.value}
        placeholder={props.placeholder}
        onChange={e => props.onChange(props.id, e.target.value, e.target.files)}
        onBlur={props.onBlur}
      />
    )}
    {props.control === 'textarea' && (
      <textarea
        className={[
          !props.valid ? 'invalid' : 'valid',
          props.touched ? 'touched' : 'untouched'
        ].join(' ')}
        id={props.id}
        rows={props.rows}
        required={props.required}
        value={props.value}
        onChange={e => props.onChange(props.id, e.target.value)}
        onBlur={props.onBlur}
      />
    )}
  </div>
);

export default input;
