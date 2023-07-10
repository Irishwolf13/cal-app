import React, { useState } from 'react';
import Modal from 'react-modal';

export default function EditJobModal({ modalEditJob, setModalEditJob, eventClickedOn}) {
  Modal.setAppElement('#root');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(eventClickedOn)
  }

  return (
    <div>
      <Modal
        isOpen={modalEditJob}
        onRequestClose={e => setModalEditJob()}
        overlayClassName="OverlayAdjust"
        className="modalAdjust"
      >
        <form className="createJobForm" onSubmit={handleSubmit}>
            <label htmlFor="nameOfJob">PerDay Hours</label>
            <input
              type="number"
              id="nameOfJob"
              name="nameOfJob"
              placeholder={eventClickedOn.perDay}
              autoFocus
            />
            <br></br>
            {/* <button type="submit">Submit</button> */}
          </form>

      </Modal>
    </div>
  )
}
