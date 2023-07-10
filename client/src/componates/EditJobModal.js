import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

export default function EditJobModal({ modalEditJob, setModalEditJob, eventClickedOn, setRefreshMe}) {
  Modal.setAppElement('#root')

  const [newPerDay, setNewPerDay] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fetch POST job
    fetch(`/jobs/${eventClickedOn.job_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({eventClickedOn, newPerDay: newPerDay})
    })
    .then(response => response.json())
    .then(data => {
      setRefreshMe(prev => !prev)
      setModalEditJob(!modalEditJob)
    })
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
            <label htmlFor="newPerDay">PerDay</label>
            <input
              type="number"
              id="newPerDay"
              name="newPerDay"
              placeholder='hours'
              onChange={(e) => setNewPerDay(e.target.value)}
              autoFocus
            />
            <br></br>
            {/* <button type="submit">Submit</button> */}
          </form>

      </Modal>
    </div>
  )
}
