import React from 'react';

import Button from '../../Button/Button';
import './Post.css';
import { Container, Row, ButtonGroup } from 'react-bootstrap';

const post = props => (
  <article className="post">
    <header className="post__header">


      <h1 className="post__title text-center">{props.title}</h1>
      <hr></hr>
      <h3 className="post__infos">
        Posted by {props.author} on {props.date} ||  Shot at {props.location} on {props.taken_date}
      </h3>


    </header>

    <div className="post__image">
      <img className="post_img" src={'http://localhost:8080/' + props.image} />
    </div>

    <Container className="text-center buttonbar">
      <Row className="text-center">
        <div className="button-pad pull-right">
          <Button mode="flat" link={props.id}>
            View
        </Button>
        </div>
        <div className="button-pad">
          <Button mode="flat" onClick={props.onStartEdit}>
            Edit
        </Button>
        </div>
        <div className="button-pad">
          <Button mode="flat" design="danger" onClick={props.onDelete}>
            Delete
        </Button>
        </div>
      </Row>
    </Container>
  </article>
);

export default post;
