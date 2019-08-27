import React, { Component } from 'react';
import openSocket from 'socket.io-client';

import Button from '../../Button/Button';
import './Post.css';
import { Container, Row } from 'react-bootstrap';
import Loader from '../../Loader/Loader';

class post extends Component {
  state = {
    bucketNum: 0,
    postInBucket: false,
    btnTitle: 'Bucket!',
    loading: 'true'
  };

  bucketHandler = () => {
    if (!this.state.postInBucket) {
      fetch('http://localhost:8080/feed/bucket-num/' + this.props.id, {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer ' + this.props.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newBucketNum: this.state.bucketNum + 1
        })
      })
      .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("Can't update bucket number!");
          }
          return res.json();
        })
      .then(resData => {
          this.setState({
            postInBucket: true,
            btnTitle: 'Unbucket!'
          });
          const socket = openSocket('http://localhost:8080');
          socket.on('bucket', data => {
            if (data.action === 'update') {
              this.updateBucketNum(data.newBucketNum);
            }
          });
          return this.props.onBucket();
        })
      .catch(this.catchError);     
    }
    else {
      fetch('http://localhost:8080/feed/bucket-num/' + this.props.id, {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer ' + this.props.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newBucketNum: this.state.bucketNum - 1
        })
      })
      .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("Can't update bucket number!");
          }
          return res.json();
        })
      .then(resData => {
          console.log(resData);
          this.setState({
            postInBucket: false,
            btnTitle: 'Bucket!'
          });
          const socket = openSocket('http://localhost:8080');
          socket.on('bucket', data => {
            if (data.action === 'update') {
              this.updateBucketNum(data.newBucketNum);
            }
          });
          return this.props.offBucket();
        })
      .catch(this.catchError);
    }
  }

  updateBucketNum = (newBucketNum) => {
    this.setState({
      btnTitle: this.state.btnTitle.split("(")[0] + "(" + newBucketNum + ")"
    })
    this.render();
  }

  componentDidMount() {
    fetch('http://localhost:8080/feed/bucket-num/' + this.props.id, {
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Fetching bucket number failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          bucketNum: resData.bucketNum
        });
        return resData;
      })
      .then(resData => {
        if (this.props.userBucket.includes(this.props.id)) {
          this.setState({
            postInBucket: true,
            btnTitle: 'Unbucket!(' + resData.bucketNum + ')'
          });
        }
        else {
          this.setState({
            postInBucket: false,
            btnTitle: 'Bucket!(' + resData.bucketNum + ')'
          });
        }
        this.setState({
          loading: 'false'
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    if (this.state.loading === 'true') {
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
          <img className="post_img" src={'http://localhost:8080/' + this.props.image} alt={this.props.title} />
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
              <Button mode="flat" onClick={this.props.startReview}>
                Review
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
