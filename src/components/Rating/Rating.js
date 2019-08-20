import React from 'react';
import StarRatingComponent from 'react-star-rating-component';
 
class Rating extends React.Component {
  state = {
    rating: this.props.value
  };
 
  onStarClick(nextValue, prevValue, name) {
    this.setState({rating: nextValue});
    this.props.onChange(nextValue);
  }
 
  render() {
    const { rating } = this.state;
    
    return (
        <div>
            <p>{this.props.label}: {rating}</p>
            <div style={{fontSize: "2rem"}}>
                <StarRatingComponent 
                    name="rate1" 
                    starCount={5}
                    value={this.state.rating}
                    onStarClick={this.onStarClick.bind(this)}
                />
            </div>
        </div>                
        
    );
  }
}
 
export default Rating;