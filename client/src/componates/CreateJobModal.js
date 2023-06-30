import React, { useState } from 'react';
import Modal from 'react-modal';

export default function CreateJobModal({ modalCreateJob, setModalCreateJob, eventClickedOn, setAllEvents, allEvents, setRefreshMe }) {
  Modal.setAppElement('#root');

  const [jobData, setJobData] = useState({
    hoursForJob: '',
    hoursPerDay: '',
    nameOfJob: '',
    color: 'Blue'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('EventStartDate', eventClickedOn.start)
    console.log('nameOfJob:', jobData.nameOfJob);
    console.log('hoursForJob:', jobData.hoursForJob);
    console.log('hoursPerDay:', jobData.hoursPerDay);
    // Fetch POST job
    fetch(`/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        job_name: jobData.nameOfJob,
        inital_hours: jobData.hoursForJob,
        hours_per_day: jobData.hoursPerDay,
        start_time: eventClickedOn.start,
        color: jobData.color
      })
    })
    .then(response => response.json())
    .then(data => {
      setAllEvents([...allEvents, ...data.events])
      setRefreshMe(prev => !prev)
    })

    // Reset the input value if needed
    setJobData(prevState => ({
      ...prevState,
      hoursForJob: '',
      hoursPerDay: '',
      nameOfJob: ''
    }));
  };

  const handleColorDropdownChange = (e) => {
    jobData.color = e.target.value
  }

  return (
    <div>
      <Modal
        isOpen={modalCreateJob}
        onRequestClose={e => setModalCreateJob()}
        overlayClassName="Overlay"
        className="modalBasic"
      >
        <div>
          <h2 className="modalTitle" >Create New Job</h2>
          {eventClickedOn && <p className="modalDate">{eventClickedOn.start.toLocaleDateString()}</p>}
          <form className="createJobForm" onSubmit={handleSubmit}>
            <label htmlFor="nameOfJob">Name of Job</label>
            <input
              type="text"
              id="nameOfJob"
              name="nameOfJob"
              value={jobData.nameOfJob}
              onChange={handleChange}
              autoFocus
            />
            <br></br>
            <label htmlFor="totalHours">Hours for Job</label>
            <input
              type="number"
              id="totalHours"
              name="hoursForJob"
              value={jobData.hoursForJob}
              onChange={handleChange}
            />
            <br></br>
            <label htmlFor="perDay">Hours Per Day</label>
            <input
              type="number"
              id="perDay"
              name="hoursPerDay"
              value={jobData.hoursPerDay}
              onChange={handleChange}
            />
            <br></br>
            <select className="colorDropdown" onChange={handleColorDropdownChange}>
              <option value="rgb(55, 55, 255)">Default Color</option>
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
          <br></br>
          <button onClick={e => setModalCreateJob()}>Close</button>
        </div>
      </Modal>
    </div>
  )
}