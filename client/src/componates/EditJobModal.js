import React, { useState } from 'react';
import Modal from 'react-modal';

export default function EditJobModal({ modalEditJob, setModalEditJob }) {
  Modal.setAppElement('#root');

  return (
    <div>
      <Modal isOpen={modalEditJob} onRequestClose={e => setModalEditJob()}>
        <h2>Hello there!</h2>
        <p>This is the content of the modal.</p>

        <button onClick={e => setModalEditJob()}>Close</button>
      </Modal>
    </div>
  )
}
