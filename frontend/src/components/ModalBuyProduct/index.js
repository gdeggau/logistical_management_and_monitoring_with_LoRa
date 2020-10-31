import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const [modal, setModal] = useState();

export const toggle = () => setModal(!modal);

export const ModalProduct = (product) => {
  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>{product.name}</ModalHeader>
      <ModalBody>{product.description}</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle}>
          Do Something
        </Button>{' '}
      </ModalFooter>
    </Modal>
  );
};
