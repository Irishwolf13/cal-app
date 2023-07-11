import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

export default function EditJobModal({ modalEditJob, setModalEditJob, eventClickedOn, setRefreshMe}) {
  Modal.setAppElement('#root')

  const [newPerDay, setNewPerDay] = useState('');
  const [options, setOptions] = useState(false);
  const [jobHours, setJobHours] = useState(0);
  const [jobName, setJobName] = useState('');

  const handlePerDaySubmit = (e) => {
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
  const handleJobChangeSubmit = (e) => {
    e.preventDefault();
  }
  const handleButtonClicked = (e) => {
    setOptions(!options)
  }
  const handleColorDropdownChange = (e) => {
    console.log(e.target.value)
  }
  const handleDeleteJob = () => {
    const userConfirmation = window.confirm("Delete this job forever?");
    if (userConfirmation) {
      console.log(eventClickedOn.job_id)
      // // FETCH: UPDATE JOBS
      fetch(`/jobs/${eventClickedOn.job_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify()
      })
      .then(data => {
        setRefreshMe(prev => !prev)
      })
      handleButtonClicked()
      setModalEditJob(!modalEditJob)
    } else {
      // If the user clicked "No" or closed the dialog
    }
  }

  return (
    <div>
      <Modal
        isOpen={modalEditJob}
        onRequestClose={e => setModalEditJob()}
        overlayClassName="OverlayAdjust"
        className="modalAdjust"
      >
        <button className="optionsButton" onClick={handleButtonClicked}>...</button>
        <form className="createJobForm" onSubmit={handlePerDaySubmit}>
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
          {options &&
            <div>
              <form className="createJobForm" onSubmit={handleJobChangeSubmit}>
                <div>Job Changes</div>
                <label htmlFor="totalHours">Hours</label>
                <input
                  type="number"
                  id="totalHours"
                  placeholder='New Hours'
                  onChange={(e) => setJobHours(e.target.value)}
                />
                <br></br>
                <label htmlFor="totalHours">Title</label>
                <input
                  type="text"
                  id="jobName"
                  placeholder='New Title'
                  onChange={(e) => setJobName(e.target.value)}
                />
                <br></br>
                <select className="colorDropdown" onChange={handleColorDropdownChange}>
                  <option value="rgb(55, 55, 255)">Select Color</option>
                  <option value="rgb(55, 55, 255)">Blue</option>
                  <option value="rgb(172, 236, 253)">Light Blue</option>
                  <option value="rgb(0, 129, 0)">Green</option>
                  <option value="rgb(132, 0, 132)">Purple</option>
                  <option value="rgb(255, 63, 172)">Pink</option>
                  <option value="rgb(255, 0, 0)">Red</option>
                  <option value="rgb(255, 255, 0)">Yellow</option>
                  <option value="rgb(255, 166, 0)">Orange</option>
                </select>
                <br></br>
                <button type="submit">Submit</button>
              </form>
                <button className='deleteJobButton' onClick={handleDeleteJob} >Delete Job</button>
            </div>
          }

      </Modal>
    </div>
  )
}
