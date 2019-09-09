import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import React, { Component } from "react";
import ReactMapGL from "react-map-gl";
import Modalmodal from '../Modal/Modal';

const MAPBOX_TOKEN = "pk.eyJ1IjoieTI2MmhhbiIsImEiOiJjanozamU2bmkwMzJ5M2d0Nm84ZW5meHhzIn0.L1kW4Q7vNyX0fCJJEYI5PA";

class Mapp extends Component {
    state = {
        viewport: {
          width: 650,
          height: 350,
          latitude: this.props.value[1],
          longitude: this.props.value[0],
          zoom: 8
        }
      };
      render() {
        return this.props.viewMap ? (
          <Modalmodal
              title="View Location"
              acceptEnabled={true}
              onCancelModal={this.props.cancelViewMap}
              onAcceptModal={this.props.cancelViewMap}
              isLoading={false}>
              <ReactMapGL
                {...this.state.viewport}
                onViewportChange={(viewport) => this.setState({viewport})}
                mapboxApiAccessToken={MAPBOX_TOKEN}
                mapStyle='mapbox://styles/y262han/cjz3kx9a80fby1cr3d8oydttt'
                width='450px'
                height='400px'
              />
          </Modalmodal>
        ) : null
      }
    }

export default Mapp;