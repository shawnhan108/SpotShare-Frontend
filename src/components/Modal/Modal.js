import React from 'react';

import Button from '../Button/Button';
import './Modal.css';
import { Modal } from 'react-bootstrap';

const Modalmodel = props => {

  const setShow = React.useState(false)[1];
  const handleShow = () => setShow(true);
  const showpair = true;
  return (
    <>
      <Modal show={showpair} onHide={handleShow}>
        <Modal.Header>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal__content">{props.children}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button design="danger" mode="flat" onClick={props.onCancelModal}>
            Cancel
          </Button>
          <Button
            mode="raised"
            onClick={props.onAcceptModal}
            disabled={!props.acceptEnabled}
            loading={props.isLoading}
          >
            Accept
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Modalmodel;
