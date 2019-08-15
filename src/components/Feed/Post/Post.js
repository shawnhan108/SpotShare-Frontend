import React, {Component} from 'react';

import Button from '../../Button/Button';
import './Post.css';
import { Container, Row } from 'react-bootstrap';
import Loader from '../../Loader/Loader';

class post extends Component {
  state = {
    postInBucket: false,
    btnTitle: 'Bucket!',
    loading: 'true'
  };

  bucketHandler = () => {
    if (!this.state.postInBucket){
      this.setState({
        postInBucket: true,
        btnTitle: 'Unbucket!'
      });
      return this.props.onBucket();
    }
    else{
      this.setState({
        postInBucket: false,
        btnTitle: 'Bucket!'
      });
      return this.props.offBucket();
    }
  }

  componentDidMount() {
    if (this.props.userBucket.includes(this.props.id)){
      this.setState({
        postInBucket: true,
        btnTitle: 'Unbucket!'
      });
    }
    else{
      this.setState({
        postInBucket: false,
        btnTitle: 'Bucket!'
      });
    }
    this.setState({
      loading: 'false'
    });
  }

  render() {
    if (this.state.loading === 'true'){
      return <Loader />
    };
    return (
      <article className="post">
        <header className="post__header">
          <h1 className="post__title text-center">{this.props.title}</h1>
          <hr></hr>
          <h3 className="post__infos">
            Posted by {this.props.author} on {this.props.date} ||  Shot at {this.props.location.text} on {this.props.taken_date}
          </h3>
        </header>
        <div className="post__image">
          <img className="post_img" src={'http://localhost:8080/' + this.props.image} alt={this.props.title}/>
        </div>
        <Container className="text-center buttonbar">
          <Row className="text-center">
            <div className="button-pad pull-right">
              <Button mode="flat" link={this.props.id}>
                View
        </Button>
            </div>
            <div className="button-pad">
              <Button mode="flat" onClick={this.props.onStartEdit}>
                Edit
        </Button>
            </div>
            <div className="button-pad">
              <Button mode="flat" design="danger" colorChange="colorChange" onClick={this.bucketHandler}>
                {this.state.btnTitle}
        </Button>
            </div>
            <div className="button-pad">
              <Button mode="flat" design="danger" onClick={this.props.onDelete}>
                Delete
        </Button>
            </div>
          </Row>
        </Container>
      </article>
    )
  }
}

export default post;
