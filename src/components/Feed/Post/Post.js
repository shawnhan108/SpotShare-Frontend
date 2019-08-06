import React from 'react';

import Button from '../../Button/Button';
import './Post.css';

const post = props => (
  <article className="post">
    <header className="post__header">
      <h3 className="post__meta">
        Posted by {props.author} on {props.date}
      </h3>
      <h3 className="post__infos">
        Shot at {props.location} on {props.taken_date}
      </h3>
      <h1 className="post__title">{props.title}</h1>
    </header>
    
    <div className="post__image">
      <img className = "post_img" src={'http://localhost:8080/' + props.image} />
    </div>
    
    <div className="post__actions">
      <Button mode="flat" link={props.id}>
        View
      </Button>
      <Button mode="flat" onClick={props.onStartEdit}>
        Edit
      </Button>
      <Button mode="flat" design="danger" onClick={props.onDelete}>
        Delete
      </Button>
    </div>
  </article>
);

export default post;
