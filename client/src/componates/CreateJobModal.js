import React, { useState } from 'react';
import Modal from 'react-modal';

export default function CreateJobModal({ modalCreateJob, setModalCreateJob }) {
  Modal.setAppElement('#root');

  return (
    <div>
      <Modal isOpen={modalCreateJob} onRequestClose={e => setModalCreateJob()}>
        <h2>Hello there!</h2>
        <p>This is the content of the modal.</p>

        <button onClick={e => setModalCreateJob()}>Close</button>
      </Modal>
    </div>
  )
}
