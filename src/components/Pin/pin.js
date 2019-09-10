import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, ButtonGroup } from 'react-bootstrap';
import './pin.css';

class pin extends Component {
    state = {
        cardReveal: false
    };

    Card = () => {
        return (
            <Card style={{ width: '10rem' }}>
                <Card.Img
                    variant="top"
                    src={'https://photography-spot-share.herokuapp.com/' + this.props.image}
                    alt={this.props.title} />
                <Card.Body>
                    <Card.Title className='title'>{this.props.title}</Card.Title>
                    <Card.Text className='location'>{this.props.location}</Card.Text>
                    <ButtonGroup>
                        <Link to={this.props.id}>
                            <Button size="sm" variant="outline-dark">
                                View
                            </Button>
                        </Link>
                        <Button size="sm" variant="outline-dark" className='closeButton' onClick={() => {
                           this.setState({
                                cardReveal: false
                            });
                        }}>
                            Close
                        </Button>
                    </ButtonGroup>
                </Card.Body>
            </Card>
        )
    };

    render() {
        return (
            <div className="pin">
                <img
                    src={"cam_marker.png"}
                    alt='Spot'
                    style={{ width: '30px', height: '100%' }}
                    onClick={() => {
                        this.setState({
                            cardReveal: (!this.state.cardReveal)
                        });
                    }}
                />
                {this.state.cardReveal ? this.Card() : null}
            </div>)
    };
};

export default pin;
