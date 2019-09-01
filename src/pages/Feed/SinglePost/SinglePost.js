import React, { Component } from 'react';

import Image from '../../../components/Image/Image';
import './SinglePost.css';
import { Container, Row, Col, ProgressBar} from 'react-bootstrap';
import Mapp from '../../../components/View-map/view-map';
import Loader from '../../../components/Loader/Loader';
import Button from '../../../components/Button/Button';
import Toast from '../../../components/Toast/Toast';

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: '',
    taken_date: '',
    location: '',
    ISO: '',
    shutter_speed: '',
    aperture: '',
    camera: '',
    lens: '',
    equipment: '',
    edit_soft: '',
    user_rate: '',
    loading: 'true',
    public_rate: [{rating: 5}],
    loadComment: 1,
    btnTitle: 'Load More'
  };

  async componentWillMount() {
    const postId = this.props.match.params.postId;
    try{
    const res = await fetch('http://localhost:8080/feed/post/' + postId, {
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
    if (res.status !== 200) {
      throw new Error('Failed to fetch status');
    }
    const resData = await res.json();
    this.setState({
      title: resData.post.title,
      author: resData.post.creator.name,
      image: 'http://localhost:8080/' + resData.post.imageUrl,
      date: new Date(resData.post.createdAt).toLocaleDateString('en-US'),
      content: resData.post.content,
      taken_date: resData.post.taken_date,
      location: resData.post.location,
      ISO: resData.post.ISO,
      shutter_speed: resData.post.shutter_speed,
      aperture: resData.post.aperture,
      camera: resData.post.camera,
      lens: resData.post.lens,
      equipment: resData.post.equipment,
      edit_soft: resData.post.edit_soft,
      user_rate: resData.post.user_rate,
      loading: 'false'
    });
    const res2 = await fetch('http://localhost:8080/feed/rating/' + postId, {
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
    if (res2.status !== 200) {
      throw new Error('Failed to fetch status');
    }
    const resData2 = await res2.json();
    this.setState({
      public_rate: resData2.ratings
    })
    }catch(err){
      console.log(err);
    }
  }

  progressBarColorHandler = () => {
    if (this.state.user_rate > 3){
      return "success"
    }else if (this.state.user_rate > 1){
      return "warning"
    }else{
      return "danger"
    }
  }

  getRateAverage = () => {
    const ratings = this.state.public_rate;
    var sum = 0;
    var num = 0;
    for (var i = 0; i < ratings.length; i++){
      sum += ratings[i].rating;
      num += 1;
    }
    return sum/num;
  }

  getAllCommentsHandler = async () => {
    if (this.state.btnTitle === 'Load More'){
      await this.setState({
        btnTitle: 'Collapse',
        loadComment: this.state.public_rate.length
      });
    } else{
      await this.setState({
        btnTitle: 'Load More',
        loadComment: 1
      });
    }
    return;
  };

  render() {
    if (this.state.loading === 'true'){
      return <Loader />
    }
    let rating_copy = JSON.parse(JSON.stringify(this.state.public_rate));
    return ([(
      <section className="single-post" key='mainSinglePosts'>
        <h1>{this.state.title}</h1>
        <Container className="Container">
            <h2 className="single-post-center">
              Created by {this.state.author} on {this.state.date}
            </h2>
            <h2 className="single-post-center">Shot at {this.state.location.text} on {this.state.taken_date}</h2>
        </Container>
        <hr className="hr"></hr>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} className="the_image"/>
        </div>
        <div className="single-post__info padding">
          <p>{this.state.content}</p>
          <hr className="hr"></hr>
          <Container>
            <Row>
              <Col><h2 className="single_post_normal_h2">ISO: {this.state.ISO}</h2></Col>
              <Col><h2 className="single_post_normal_h2">Camera: {this.state.camera}</h2></Col>
            </Row>
            <Row>
              <Col><h2 className="single_post_normal_h2">Shutter Speed: {this.state.shutter_speed}</h2></Col>
              <Col><h2 className="single_post_normal_h2">Lens: {this.state.lens}</h2></Col>
            </Row>
            <Row>
              <Col><h2 className="single_post_normal_h2">Aperture: {this.state.aperture}</h2></Col>
              <Col><h2 className="single_post_normal_h2">Equipments: {this.state.equipment}</h2></Col>
            </Row>
            <Row>
              <Col><h2 className="single_post_normal_h2">Author Rating: {this.state.user_rate}</h2></Col>
              <Col><h2 className="single_post_normal_h2">Post-Editing Softwares Used: {this.state.edit_soft}</h2></Col>
            </Row>
          </Container>
          <div>
            <Row>
              <Col xs={2}>
                <h2 className="single_post_normal_h2">Author Rating: </h2>
              </Col>
              <Col>
                <ProgressBar 
                  animated striped variant={this.progressBarColorHandler()} 
                  now={this.state.user_rate/5*100} 
                  label={this.state.user_rate + ' / 5'}
                />
              </Col>
            </Row>
          </div>
          <div>
            <Row>
              <Col xs={2}>
                <h2 className="single_post_normal_h2">Public Rating: </h2>
              </Col>
              <Col>
                <ProgressBar 
                  animated striped variant={this.progressBarColorHandler()} 
                  now={(this.getRateAverage())/5 * 100} 
                  label={this.getRateAverage() + ' / 5'}
                />
              </Col>
            </Row>
          </div>
        </div>
        <div style={{height: "100px"}}></div>
        <div className="map-div" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
          <Mapp
            text={this.state.location.text}
            value={this.state.location.center}
          />
        </div>
        <div style={{height: '100px'}}/>
      </section>),
      ...rating_copy
        .sort(function(a, b){return b.rating - a.rating})
        .splice(0, Math.min(this.state.public_rate.length, this.state.loadComment))
        .map(rate => (
      <div style={{display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: '2rem'}}
            key={rate.user + "'sComment"}>
        <Toast
          user={rate.user}
          rating={rate.rating}
          comment={rate.comment}/>
      </div>
    )),
    (<div style={{paddingBottom: '2rem', paddingLeft: '2rem', textAlign: 'center'}}
          key='LoadAllButton'>
      <Button mode="flat" onClick={this.getAllCommentsHandler}>
        {this.state.btnTitle}
      </Button>
    </div>)
    ]);
  }
}

export default SinglePost;
