import React, { Component } from 'react';
import openSocket from 'socket.io-client';

import Loader from '../../components/Loader/Loader';
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import ReactMapGL, {Marker} from "react-map-gl";
import Pin from '../../components/Pin/pin';

const MAPBOX_TOKEN = "pk.eyJ1IjoieTI2MmhhbiIsImEiOiJjanozamU2bmkwMzJ5M2d0Nm84ZW5meHhzIn0.L1kW4Q7vNyX0fCJJEYI5PA";

class Map extends Component {
  state = {
    isEditing: false,
    spots: [],
    postsLoading: true,
    viewport: {
          width: 850,
          height: 500,
          latitude: 44.161,
          longitude: -98.464,
          zoom: 2
        }
  };

  componentDidMount() {
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
        this.loadPosts();
      } else if (data.action === 'update') {
        this.updatePost(data.post);
      } else if (data.action === 'delete') {
        this.loadPosts();
      }
    });
  }

  loadPosts = () => {
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
        return {
            ...resData,
            posts: resData.posts.filter(
                post => this.state.bucket.includes(post._id)
              )
        }
    })
      .then(resData => {
        this.setState({
        spots: resData.posts.map(post => {
            return {
              ...post,
              imagePath: post.imageUrl
            };
          }),
          postsLoading: false
        });
      })
      .catch(this.catchError);
  };

  createMarkers = () => {
    let markers = []
    for (let i = 0; i < this.state.spots.length; i++){
        markers.push(
            <Marker 
                latitude={this.state.spots[i].location.center[1]} 
                longitude={this.state.spots[i].location.center[0]}
                offsetLeft={-15}
                offsetTop={-30}
                key={i}>
                <div>
                <Pin 
                    key={i}
                    title={this.state.spots[i].title}
                    image={this.state.spots[i].imageUrl}
                    location={this.state.spots[i].location.text}
                    id={this.state.spots[i]._id}/>
                </div>
            </Marker>
        );
    }
    return markers;
  }

  render() {
    if (this.state.postsLoading){
        return <Loader />
    }
    return (<div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <ReactMapGL
            {...this.state.viewport}
            onViewportChange={(viewport) => this.setState({viewport})}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            mapStyle='mapbox://styles/y262han/cjz3kx9a80fby1cr3d8oydttt'
        >
        {this.createMarkers()}
        </ReactMapGL>
      </div>
    );
  }
}

export default Map;