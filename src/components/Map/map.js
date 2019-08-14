import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import React, { Component } from "react";
import MapGL from "react-map-gl";
import DeckGL, { GeoJsonLayer } from "deck.gl";
import Geocoder from "react-map-gl-geocoder";

const MAPBOX_TOKEN = "pk.eyJ1IjoieTI2MmhhbiIsImEiOiJjanozamU2bmkwMzJ5M2d0Nm84ZW5meHhzIn0.L1kW4Q7vNyX0fCJJEYI5PA";

class Mapp extends Component {
    state = {
        viewport: {
            latitude: this.props.value.center[1],
            longitude: this.props.value.center[0],
            zoom: 8
        },
        searchResultLayer: null
    };

    mapRef = React.createRef();

    handleViewportChange = viewport => {
        this.setState({
            viewport: { ...this.state.viewport, ...viewport },
        });
    };

    handleGeocoderViewportChange = viewport => {
        const geocoderDefaultOverrides = { transitionDuration: 1000 };
        return this.handleViewportChange({
            ...viewport,
            ...geocoderDefaultOverrides
        });
    };

    handleOnResult = event => {
        this.setState({
            searchResultLayer: new GeoJsonLayer({
                id: "search-result",
                data: event.result.geometry,
                getFillColor: [255, 0, 0, 128],
                getRadius: 1000,
                pointRadiusMinPixels: 10,
                pointRadiusMaxPixels: 10
            })
        });
        this.props.onChange(event.result);
    };

    render() {
        const {viewport, searchResultLayer} = this.state;
        return (
            <div style={{ height: "100%" }}>
                <MapGL
                    ref={this.mapRef}
                    {...viewport}
                    width={this.props.width}
                    height={this.props.height}
                    onViewportChange={this.handleViewportChange}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                    mapStyle='mapbox://styles/y262han/cjz3kx9a80fby1cr3d8oydttt'
                >
                    <Geocoder
                        mapRef={this.mapRef}
                        onResult={this.handleOnResult}
                        onViewportChange={this.handleGeocoderViewportChange}
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                        position="top-left"
                        inputValue={this.props.inputval}
                        onChange={e => this.props.onChange(e.target.value)}
                    />
                    <DeckGL {...viewport} layers={[searchResultLayer]} />
                </MapGL>
            </div>
        );
    }
}

export default Mapp;