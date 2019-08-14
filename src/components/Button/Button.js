import React from 'react';
import { Link } from 'react-router-dom';

import './Button.css';
import { Button } from 'react-bootstrap';

const button = props =>
  !props.link ? (
    <Button
      variant="outline-dark"
      className={[
        'button',
        `button--${props.design}`,
        `button--${props.mode}`,
        `button--${props.colorChange}`
      ].join(' ')}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
      type={props.type}
    >
      {props.loading ? 'Loading...' : props.children}
    </Button>
  ) : (
      <Link to={props.link}>
        <Button
          variant="outline-dark"
          className={[
            'button',
            `button--${props.design}`,
            `button--${props.mode}`,
            `button--${props.colorChange}`
          ].join(' ')}>
          {props.children}
        </Button>

      </Link>
    );

export default button;
