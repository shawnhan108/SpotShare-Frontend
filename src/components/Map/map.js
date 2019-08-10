import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import '../Map/map.css';

const TOKEN = "pk.eyJ1IjoieTI2MmhhbiIsImEiOiJjanozamU2bmkwMzJ5M2d0Nm84ZW5meHhzIn0.L1kW4Q7vNyX0fCJJEYI5PA";

const Mapp = props => {
    const [viewport, setViewport] = useState({
      latitude: 45.4211,
      longitude: -75.6903,
      width: props.width,
      height: props.height,
      zoom: 10
    });
    const [selectedPark, setSelectedPark] = useState(null);

    const handleViewportChange = viewport => {
        this.setState({
          viewport: { ...this.state.viewport, ...viewport }
        });
      };
  
    useEffect(() => {
      const listener = e => {
        if (e.key === "Escape") {
          setSelectedPark(null);
        }
      };
      window.addEventListener("keydown", listener);
  
      return () => {
        window.removeEventListener("keydown", listener);
      };
    }, []);
  
    return (
      <div className="map-wrapper">
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={TOKEN}
          mapStyle="mapbox://styles/y262han/cjz3kx9a80fby1cr3d8oydttt"
          onViewportChange={viewport => {
            setViewport(viewport);
          }}
        >
        </ReactMapGL>
      </div>
    );
  }
  
  export default Mapp;