import React from 'react';
import {Toast} from 'react-bootstrap';
 
const Toastt = props => {
    const [showB, setShowB] = React.useState(true);
    const toggleShowB = () => setShowB(!showB);
    return (
        <Toast onClose={toggleShowB} show={showB} animation={false}>
            <Toast.Header>
            <strong className="mr-auto">{props.user}</strong>
            <small>rating: {props.rating}</small>
            </Toast.Header>
            <Toast.Body>{props.comment}</Toast.Body>
        </Toast> )
}
 
export default Toastt;