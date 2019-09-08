import React, { Component } from 'react';
import openSocket from 'socket.io-client';


import Button from '../../components/Button/Button';
import Input from '../../components/Form/Input/Input';
import './Ranking.css';
import {Row, Col, Container} from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
    comment:'',
    ratingTouched: false,
    commentTouched: false,
    reviewIsValid: false,
    show_post_limit: 3,
    show_post_limit_region: 3,
    posts_to_display: [],
    regionRatings: []
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
          status: resData.status
        });
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
    fetch('http://localhost:8080/feed/all-posts', {
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
        } else{
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
      .then(res => {
        const posts = this.state.posts;
        var regions = {};
        posts.forEach(post => {
            const len = post.location.context.length;
            const regionKey = post.location.context[len - 2].text;
            if (Object.keys(regions).includes(regionKey)){
                regions[regionKey].push(post);
            } else {
                regions[regionKey] = [post];
            }
        });
        var regionRatings = [];
        const regionKeys = Object.keys(regions);
        regionKeys.forEach(region => {
            const regionPosts = regions[region];
            const regionName = region;
            var sum = 0;
            var num = 0;
            regionPosts.forEach(post => {
                num = num + post.rating_num;
                sum = sum + (post.rating_num) * (post.rating);
            });
            var avgRating;
            if (num !== 0){
                avgRating = sum/num;
            }else{
                avgRating = 3;
            }
            const len = regionPosts[0].location.context.length;
            const country = regionPosts[0].location.context[len - 1].text;
            const result = {
                region: regionName,
                country: country,
                avgRating: avgRating
            }
            regionRatings.push(result);
        });
        this.setState({
            regionRatings: regionRatings
        })
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
      .then(res => {
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
            ratingId: newRatingId
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

render () {
    if (this.state.posts.length === 0){
        return <h4>No ratings can be found</h4>;
    }
    let posts_copy = JSON.parse(JSON.stringify(this.state.posts));
    let regions_copy = JSON.parse(JSON.stringify(this.state.regionRatings));
    return ([
        (
        <section className="feed__status" key='search'>
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
        ),
        (<div key='title' style={{textAlign: 'center', paddingTop: '3rem'}}>
            <h2>Top-rated Posts:</h2>
        </div>), 
        (<div key='label' style={{padding: '1rem', textAlign: 'center'}}>
            <Container>
            <Row>
                <Col><strong>Post</strong></Col>
                <Col><strong>Preview</strong></Col>
                <Col><strong>Location</strong></Col>
                <Col><strong>Public Rating</strong></Col>
                <Col><strong>Author</strong></Col>
            </Row>
        </Container>
        </div>),
        ...posts_copy
            .sort(function(a, b){
                     return b.rating - a.rating;
                })
            .splice(0, this.state.show_post_limit)
            .map(post => (
                <Link 
                    to={post._id}
                    key={post._id}
                >
                <div 
                    key={post._id + 'div'}
                    className='contentDiv'
                    >
                    <Container>
                        <Row>
                            <Col><p style={{color: 'black'}}>{post.title}</p></Col>
                            <Col>
                                
                                    <img 
                                        src={'http://localhost:8080/' + post.imageUrl}
                                        alt={post.title}
                                        className='thumbnail'/>
                            </Col>
                            <Col>
                                <p style={{color: 'black'}}>{post.location.text}</p>
                            </Col>
                            <Col>
                                <p style={{color: 'black'}}>{post.rating}</p>
                            </Col>
                            <Col>
                                <p style={{color: 'black'}}>{post.creator.name}</p>
                            </Col>
                        </Row>
                    </Container>
                    
                </div>
                </Link>
            )),
            (
            <div key='moreButton' style={{textAlign: 'center', padding: '1rem'}}>
                <Button 
                    mode="flat" 
                    onClick={() => {
                        this.setState({
                        show_post_limit: this.state.show_post_limit + 3
                    })}}>
                        More
                </Button>
            </div>
          ),
        (<div key='title-geo' style={{textAlign: 'center', paddingTop: '3rem'}}>
            <h2>Top-rated Regions:</h2>
            </div>), 
        (<div key='label-geo' style={{padding: '1rem', textAlign: 'center'}}>
            <Container>
            <Row>
                <Col><strong>Region</strong></Col>
                <Col><strong>Country</strong></Col>
                <Col><strong>Average Rating</strong></Col>
                <Col><strong>Filter</strong></Col>
            </Row>
        </Container>
        </div>),
        ...regions_copy
        .sort(function(a, b){
                 return b.avgRating - a.avgRating;
            })
        .splice(0, this.state.show_post_limit_region)
        .map(region => (
            <div 
                key={region.region}
                className='contentDiv'
                >
                <Container>
                    <Row>
                        <Col><p style={{color: 'black', paddingTop: '25px'}}>{region.region}</p></Col>
                        <Col>
                            <p style={{color: 'black', paddingTop: '25px'}}>{region.country}</p>
                        </Col>
                        <Col>
                            <p style={{color: 'black', paddingTop: '25px'}}>{region.avgRating}</p>
                        </Col>
                        <Col>
                            <div style={{textAlign: 'center', padding: '1rem'}}>
                                <Button 
                                    mode="flat" 
                                    onClick={async () => {
                                        await this.setState({
                                            status: region.region
                                        });
                                        this.statusUpdateHandler();
                                        }}>
                                        Search
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
                
            </div>
        )),
        (
            <div key='moreButtonRegion' style={{textAlign: 'center', padding: '1rem'}}>
                <Button 
                    mode="flat" 
                    onClick={() => {
                        this.setState({
                            show_post_limit_region: this.state.show_post_limit_region + 3
                    })}}>
                        More
                </Button>
            </div>
          )
        ]);
  }
}

export default Feed;
