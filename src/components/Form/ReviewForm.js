import React, {Component} from 'react';
import {Form} from 'react-bootstrap';
import Modalmodal from '../Modal/Modal';
import Rating from '../Rating/Rating';

class reviewForm extends Component {
    render(){
        return this.props.postReviewEditing ? (
            <Modalmodal
              title="Review this post"
              acceptEnabled={this.props.reviewIsValid}
              onCancelModal={this.props.cancelReviewHandler}
              onAcceptModal={this.props.acceptReviewHandler}
              isLoading={false}>
              <Form>
                <Rating
                  id="Rating"
                  label="Rate this location"
                  onChange={this.props.postRatingChangeHandler}
                  value={this.props.rating}
                />
                <textarea
                    rows={5}
                    required={true}
                    value={this.props.comment}
                    onChange={e => this.props.postCommentHandler(e.target.value)}>
                </textarea>
              </Form>
            </Modalmodal>) : null
    };
}

export default reviewForm;