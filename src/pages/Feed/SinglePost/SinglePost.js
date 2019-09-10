import React, { Component } from 'react';

import './SinglePost.css';
import { Container, ProgressBar, Table, Image} from 'react-bootstrap';
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
    btnTitle: 'Load More',
    viewMap: false
  };

  async componentWillMount() {
    const postId = this.props.match.params.postId;
    try{
    const res = await fetch('https://photography-spot-share.herokuapp.com/feed/post/' + postId, {
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
      image: 'https://photography-spot-share.herokuapp.com/' + resData.post.imageUrl,
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
    const res2 = await fetch('https://photography-spot-share.herokuapp.com/feed/rating/' + postId, {
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
    const result = sum/num;
    if (Number.isNaN(result)){
      return ['None', 'None', 'None']
    }else{
      return [result * 20, (result + '/ 5'), result];
    }
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
    let public_rate_data = this.getRateAverage();
    return ([(
      <section className="single-post" key='mainSinglePosts'>
        <Mapp
          viewMap={this.state.viewMap}
          text={this.state.location.text}
          value={this.state.location.center}
          cancelViewMap={() => {this.setState({viewMap: false})}}
        />
        <h1>{this.state.title}</h1>
        <Container className="Container">
            <h2 className="single-post-center">
              Created by {this.state.author} on {this.state.date}
            </h2>
            <h2 className="single-post-center">Shot at {this.state.location.text} on {this.state.taken_date}</h2>
        </Container>
        <hr className="hr"></hr>
        <div style={{padding: '1rem', maxHeight: '40rem'}}>
          <Image src={this.state.image} fluid style={{maxHeight: '35rem'}}/>
        </div>
        <div className="single-post__info padding">
          <p>{this.state.content}</p>
          <hr className="hr"></hr>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Parameters</th>
                <th>Value</th>
                <th>Equipments</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ISO</td>
                <td>{this.state.ISO}</td>
                <td>Camera</td>
                <td>{this.state.camera}</td>
              </tr>
              <tr>
                <td>Shutter Speed</td>
                <td>{this.state.shutter_speed}</td>
                <td>Lens</td>
                <td>{this.state.lens}</td>
              </tr>
              <tr>
                <td>Aperture</td>
                <td>{this.state.aperture}</td>
                <td>Other Equips</td>
                <td>{this.state.equipment}</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td>Post-Editing Softwares</td>
                <td>{this.state.edit_soft}</td>
              </tr>
              <tr>
                <td>Author Rating</td>
                <td>{this.state.user_rate}</td>
                <td colSpan="2">
                  <ProgressBar 
                    animated striped variant={this.progressBarColorHandler()} 
                    now={this.state.user_rate/5*100} 
                    label={this.state.user_rate + ' / 5'}
                  />
                </td>
              </tr>
              <tr>
                <td>Public Rating</td>
                <td>{public_rate_data[2]}</td>
                <td colSpan="2">
                  <ProgressBar 
                    animated striped variant={this.progressBarColorHandler()} 
                    label={public_rate_data[1]}
                    now={public_rate_data[0]} 
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div style={{height: "30px"}}></div>
        <Button mode='flat' onClick={() => {this.setState({viewMap: true})}}>View Map</Button>
        <div style={{height: "30px"}}></div>
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
