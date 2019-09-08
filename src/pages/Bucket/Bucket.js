import React, { Component, Fragment } from 'react';
import openSocket from 'socket.io-client';

import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Bucket.css';
import ReviewForm from '../../components/Form/ReviewForm';

class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: '',
    postPage: 1,
    postsLoading: true,
    editLoading: false,
    bucket:[],
    reviewPost: false,
    rating: 3,
    oldRating: 3,
    comment:'',
    ratingTouched: false,
    commentTouched: false,
    reviewIsValid: false
  };

  componentDidMount() {
    fetch('http://localhost:8080/auth/status', {
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch user status.');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({ 
          status: resData.status });
      })
      .catch(this.catchError);
    
      fetch('http://localhost:8080/auth/bucket', {
        headers: {
          Authorization: 'Bearer ' + this.props.token
        }
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Fetching bucket posts failed!');
          }
          return res.json();
        })
        .then(resData => {
          this.setState({
            bucket: resData.bucket
          });
        })
        .catch(err => {
          console.log(err);
        });  
    this.loadPosts();
    const socket = openSocket('http://localhost:8080');
    socket.on('posts', data => {
      if (data.action === 'create') {
        this.addPost(data.post);
      } else if (data.action === 'update') {
        this.updatePost(data.post);
      } else if (data.action === 'delete') {
        this.loadPosts();
      }
    });
  }

  addPost = post => {
    this.setState(prevState => {
      const updatedPosts = [...prevState.posts];
      if (prevState.postPage === 1) {
        if (prevState.posts.length >= 2) {
          updatedPosts.pop();
        }
        updatedPosts.unshift(post);
      }
      return {
        posts: updatedPosts,
        totalPosts: prevState.totalPosts + 1
      };
    });
  };

  updatePost = post => {
    this.setState(prevState => {
      const updatedPosts = [...prevState.posts];
      const updatedPostIndex = updatedPosts.findIndex(p => p._id === post._id);
      if (updatedPostIndex > -1) {
        updatedPosts[updatedPostIndex] = post;
      }
      return {
        posts: updatedPosts
      };
    });
  };

  loadPosts = direction => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === 'next') {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === 'previous') {
      page--;
      this.setState({ postPage: page });
    }
    fetch('http://localhost:8080/feed/posts?page=' + page, {
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch posts.');
        }
        return res.json();
      })
      .then(resData => {
        return {
            ...resData,
            posts: resData.posts.filter(
                post => this.state.bucket.includes(post._id)
              )
        }
    })
      .then(resData => {
        if (this.state.status === ''){
          this.setState({
            posts: resData.posts.map(post => {
              return {
                ...post,
                imagePath: post.imageUrl
              };
            }),
            totalPosts: resData.totalItems,
            postsLoading: false
          });
        }else{
          const posts = resData.posts.map(post => {
            return {
              ...post,
              imagePath: post.imageUrl
            };
          });
          const result = [];
          const searchString = this.state.status;
          for (var i = 0; i < posts.length; i++){
            const post = posts[i];
            if (post.title.toLowerCase().search(searchString.toLowerCase()) !== -1){
              result.push(post);
              continue;
            }
            if (post.content.toLowerCase().search(searchString.toLowerCase()) !== -1){
              result.push(post);
              continue;
            }
            if (post.location.text.toLowerCase().search(searchString.toLowerCase()) !== -1){
              result.push(post);
              continue;
            }
            if (post.location.place_name.toLowerCase().search(searchString.toLowerCase()) !== -1){
              result.push(post);
              continue;
            }
            if (post.ISO.toString().toLowerCase().search(searchString.toLowerCase()) !== -1){
              result.push(post);
              continue;
            }
            if (post.shutter_speed.toLowerCase().search(searchString.toLowerCase()) !== -1){
              result.push(post);
              continue;
            }
            if (post.aperture.toLowerCase().search(searchString.toLowerCase()) !== -1){
              result.push(post);
              continue;
            }
            if (post.camera.toLowerCase().search(searchString.toLowerCase()) !== -1){
              result.push(post);
              continue;
            }
            if (post.lens.toLowerCase().search(searchString.toLowerCase()) !== -1){
              result.push(post);
              continue;
            }
            if (post.equipment.toLowerCase().search(searchString.toLowerCase()) !== -1){
              result.push(post);
              continue;
            }
            if (post.edit_soft.toLowerCase().search(searchString.toLowerCase()) !== -1){
              result.push(post);
              continue;
            }
          }
          this.setState({
            posts: result,
            totalPosts: result.length,
            postsLoading: false
          })
        }
      })
      .catch(this.catchError);
  };

  statusUpdateHandler = event => {
    if (event !== undefined){
      event.preventDefault();
    };
    fetch('http://localhost:8080/auth/status', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: this.state.status
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update status!");
        }
        return res.json();
      })
      .then(resData => {
        this.loadPosts();
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = postId => {
    this.setState(prevState => {
      const loadedPost = { ...prevState.posts.find(p => p._id === postId) };

      return {
        isEditing: true,
        editPost: loadedPost
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  bucketPostHandler = postId => {
    this.setState({ postsLoading: true });
    fetch('http://localhost:8080/auth/bucket/' + postId, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Adding a post to bucket failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.loadPosts();
        this.state.bucket.push(postId);
      })
      .catch(err => {
        console.log(err);
        this.setState({ 
          postsLoading: false
         });
      });
  };

  bucketRemoveHandler = postId => {
    this.setState({ postsLoading: true });
    fetch('http://localhost:8080/auth/bucket/' + postId, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Deleting a post from bucket failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.loadPosts();
        for (var i = 0; i < this.state.bucket.length; i++){
          if (this.state.bucket[i] === postId){
            this.state.bucket.splice(i, 1);
          }
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  finishEditHandler = postData => {
    this.setState({
      editLoading: true
    });
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('image', postData.image);
    formData.append('taken_date', postData.taken_date);
    formData.append('location', JSON.stringify(postData.location));
    formData.append('ISO', postData.ISO);
    formData.append('shutter_speed', postData.shutter_speed);
    formData.append('aperture', postData.aperture);
    formData.append('camera', postData.camera);
    formData.append('lens', postData.lens);
    formData.append('equipment', postData.equipment);
    formData.append('edit_soft', postData.edit_soft);
    formData.append('user_rate', postData.user_rate);
    
    let url = 'http://localhost:8080/feed/posts';
    let method = 'POST';
    if (this.state.editPost) {
      url = 'http://localhost:8080/feed/post/' + this.state.editPost._id;
      method = 'PUT';
    }

    fetch(url, {
      method: method,
      body: formData,
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Creating or editing a post failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState(prevState => {
          return {
            isEditing: false,
            editPost: null,
            editLoading: false
          };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err
        });
      });
  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  deletePostHandler = postId => {
    this.setState({ postsLoading: true });
    fetch('http://localhost:8080/feed/post/' + postId, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Deleting a post failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.loadPosts();
      })
      .catch(err => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = error => {
    this.setState({ error: error });
  };


  startReviewHandler = postId => {
    const userId = localStorage.getItem('userId');
    fetch('http://localhost:8080/auth/ratings/' + userId, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Fetching ratings failed!');
        }
        return res.json();
      })
      .then(resData => {
        for (var i = 0; i < resData.ratings.length; i++){
          if (resData.ratings[i].post === postId){
            this.setState({
              rating: resData.ratings[i].rating,
              oldRating: resData.ratings[i].rating,
              comment: resData.ratings[i].comment,
              reviewIsValid: true,
              ratingTouched: true,
              commentTouched: true
            });
            break;
          }
        }
      })
      .then(res => {
        this.setState({
          reviewPost: postId
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  postCommentHandler = (value) => {
    this.setState({
      comment: value,
      commentTouched: true,
      reviewIsValid: this.state.ratingTouched
    });
  };
  
  postRatingChangeHandler = (value) => {
    this.setState({
      rating: value,
      ratingTouched: true,
      reviewIsValid: this.state.commentTouched
    });
  };

  cancelReviewHandler = () => {
    this.setState({
      rating: 3,
      ratingTouched: false,
      commentTouched: false,
      reviewIsValid: false,
      reviewPost: false
    });
  };

  acceptReviewHandler = async () => {
    const userId = localStorage.getItem('userId');
    this.setState({ postsLoading: true });
    try{
    const res = await fetch('http://localhost:8080/auth/ratings/' + userId, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        postId: this.state.reviewPost,
        rating: this.state.rating,
        comment: this.state.comment
      })
    })
    if (res.status !== 200 && res.status !== 201) {
      throw new Error('Adding a review failed!');
    }
    const Rez = await res.json();
    const new_rating = !Rez.old_rating;
    var newRatingId;
    const res2 = await fetch('http://localhost:8080/auth/ratings/' + userId, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + this.props.token
        }
      })
    if (res2.status !== 200 && res2.status !== 201) {
        throw new Error('Fetching ratings failed!');
    }
    const resData = await res2.json();
    console.log(resData);
    for (var i = 0; i < resData.ratings.length; i++){
      if (resData.ratings[i].post === this.state.reviewPost){
        newRatingId = resData.ratings[i]._id;
        console.log(newRatingId);
        break;
      }
    }
    const res3 = await fetch('http://localhost:8080/feed/rating/' + this.state.reviewPost, {
          method: 'PATCH',
          headers: {
            Authorization: 'Bearer ' + this.props.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            ratingId: newRatingId,
            oldRating: this.state.oldRating,
            newRating: new_rating,
            value: this.state.rating
          })
        })
    if (res3.status !== 200 && res3.status !== 201) {
          throw new Error("Can't update review!");
    }
    this.setState({
      postsLoading: false,
      rating: 3,
      ratingTouched: false,
      comment: '',
      commentTouched: false,
      reviewIsValid: false,
      reviewPost: false
    });
    }catch (err){
      console.log(err);
      this.setState({ 
        postsLoading: false
       });
    }
  }

  clearSearchHandler = async () => {
    await this.setState({
      status: ''
    });
    this.statusUpdateHandler();
  }

  render() {
    return (
      <Fragment>
        <ReviewForm
          reviewIsValid={this.state.reviewIsValid}
          cancelReviewHandler={this.cancelReviewHandler}
          acceptReviewHandler={this.acceptReviewHandler}
          postRatingChangeHandler={this.postRatingChangeHandler}
          rating={this.state.rating}
          postReviewEditing={this.state.reviewPost}
          comment={this.state.comment}
          postCommentHandler={this.postCommentHandler}
        />
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        <section className="feed__status">
          <form onSubmit={this.statusUpdateHandler}>
            <Input
              type="text"
              placeholder="search for keywords..."
              control="input"
              onChange={this.statusInputChangeHandler}
              value={this.state.status}
            />
            <Button mode="flat" type="submit">
              Search!
            </Button>
            <Button mode="flat" onClick={this.clearSearchHandler}>
              Clear
            </Button>
          </form>
        </section>
        <section className="feed">
          {this.state.postsLoading && (
            <div style={{ textAlign: 'center', marginTop: '2 rem' }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: 'center' }}>No posts found.</p>
          ) : null}
          {!this.state.postsLoading && (
            <Paginator
              onPrevious={this.loadPosts.bind(this, 'previous')}
              onNext={this.loadPosts.bind(this, 'next')}
              lastPage={Math.ceil(this.state.totalPosts / 2)}
              currentPage={this.state.postPage}
            >
              {this.state.posts.map(post => (
                <Post
                  key={post._id}
                  id={post._id}
                  author={post.creator}
                  date={new Date(post.createdAt).toLocaleDateString('en-US')}
                  title={post.title}
                  image={post.imageUrl}
                  content={post.content}
                  taken_date={post.taken_date}
                  location={post.location}
                  ISO={post.ISO}
                  shutter_speed={post.shutter_speed}
                  aperture={post.aperture}
                  camera={post.camera}
                  lens={post.lens}
                  equipment={post.equipment}
                  edit_soft={post.edit_soft}
                  user_rate={post.user_rate}
                  onStartEdit={this.startEditPostHandler.bind(this, post._id)}
                  onDelete={this.deletePostHandler.bind(this, post._id)}
                  onBucket={this.bucketPostHandler.bind(this, post._id)}
                  offBucket={this.bucketRemoveHandler.bind(this, post._id)}
                  userBucket={this.state.bucket}
                  token={this.props.token}
                  startReview={this.startReviewHandler.bind(this, post._id)}
                />
              ))}
            </Paginator>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Feed;
