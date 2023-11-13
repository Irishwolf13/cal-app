import React, { useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import ToggleSwitch from './ToggleSwitch';

export default function CreateJobModal({ modalCreateJob, setModalCreateJob, slotClickedOn, setAllEvents, allEvents, setRefreshMe }) {
  Modal.setAppElement('#root');
  const [checkBox, setCheckBox] = useState(false);
  const [scheduleBox, setScheduleBox] = useState(true);
  const [deliveryDate, setDeliveryDate] = useState(null)
  const [inHandDate, setInHandDate] = useState(null)

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
    // Checks for information
    if (jobData.nameOfJob === '') {
      alert('Every Job must have a name')
      return
    }
    if (jobData.hoursForJob <= 0) {
      alert('Hours for Job be greater than zero')
      return
    }
    if (jobData.hoursPerDay <= 0) {
      alert('Hours Per Day must be greater than zero')
      return
    }
    let myCurrentDate = slotClickedOn.start
    if (checkBox) {
      myCurrentDate = endSelected(jobData.hoursForJob, jobData.hoursPerDay)
    }
    let tempDate = deliveryDate
    if (deliveryDate != null) {
      tempDate.setDate(tempDate.getDate() + 1);
    }
    setCheckBox(false)
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
        start_time: slotClickedOn.start,
        delivery: tempDate,
        color: jobData.color
      })
    })
    .then(response => response.json())
    .then(data => {
      setModalCreateJob(!modalCreateJob)
      setAllEvents([...allEvents, ...data.events])
      setRefreshMe(prev => !prev)
    })
    // Reset the input value if needed
    setJobData(prevState => ({
      ...prevState,
      hoursForJob: '',
      hoursPerDay: '',
      nameOfJob: '',
      color: 'Blue'
    }));
    setDeliveryDate(null)
    setInHandDate(null)
  };

  const handleColorDropdownChange = (e) => {
    jobData.color = e.target.value
  }

  const handleCheckBox = (e) => {
    setCheckBox(prev => !prev)
  }
  const handleScheduleChecked = (e) => {
    setScheduleBox(prev => !prev)
  }

  const handleModalClose = (e) => {
    setDeliveryDate(null)
    setInHandDate(null)
    setModalCreateJob()
    setCheckBox(false);
  }

  const endSelected = (jobHours, perDayHours) => {
    let numberOfDays = Math.floor(jobHours / perDayHours)
    if (jobHours  % perDayHours !==0) {
      numberOfDays++;
    }
    return (subtractWeekendDays(slotClickedOn.start, numberOfDays))
  }

  const subtractWeekendDays = (date, daysToSubtract) => {
    let myDate = date
    let myDays = daysToSubtract
    myDate.setDate(myDate.getDate() + 1);
    for (let i = 1; i <= myDays; i++) {
      // Check if the current day is a Sunday
      if (myDate.getDay() === 1) {
        myDate.setDate(myDate.getDate() - 2);
      }
      myDate.setDate(myDate.getDate() - 1);
    }
    return myDate;
  }

  const handleDeliveryPicker = (date) => {
    if (date !== null) {
      const selectedDate = date;
      selectedDate.setDate(selectedDate.getDate());
      setDeliveryDate(selectedDate);
    }else {setDeliveryDate(null)}
  }
  const handleInHandPicker = (date) => {
    if (date !== null) {
      const selectedDate = date;
      selectedDate.setDate(selectedDate.getDate());
      setInHandDate(selectedDate);
    }else {setInHandDate(null)}
  }

  return (
    <div>
      <Modal
        isOpen={modalCreateJob}
        onRequestClose={handleModalClose}
        overlayClassName="Overlay"
        className="modalBasic"
      >
        <div>
          <h2 className="modalTitle" >Create New Job</h2>
          {slotClickedOn && <p className="modalDate">{slotClickedOn.start.toLocaleDateString()}</p>}
          <label>
            <input 
              className="myCheckBox" type="checkbox" id="accept" name="accept" value="yes"
              onChange={handleCheckBox}
            />End Date
          </label>
          <label>
            <input 
              className="myCheckBox" type="checkbox" id="schedule" name="schedule" value="yes" defaultChecked
              onChange={handleScheduleChecked}
            />Scheduled 
          </label>
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
            <div>
              <select className="colorDropdown" onChange={handleColorDropdownChange}>
                <option value="rgb(55, 55, 255)">Select Color</option>
                <option value="rgb(55, 55, 255)">Blue</option>
                <option value="rgb(172, 236, 253)">Light Blue</option>
                <option value="rgb(0, 129, 0)">Green</option>
                <option value="rgb(132, 0, 132)">Purple</option>
                <option value="rgb(255, 63, 172)">Pink</option>
                <option value="rgb(100, 100, 100)">Gray</option>
                <option value="rgb(255, 255, 0)">Yellow</option>
                <option value="rgba(255, 166, 0, 0.623)">Orange</option>
              </select>
              <div style={{ display: "inline-block" }}>
                <DatePicker 
                  selected={deliveryDate} 
                  onChange={date => handleDeliveryPicker(date)} 
                  placeholderText="Delivery"
                  className="myDatePicker"
                />
              </div>
              <div style={{ display: "inline-block" }}>
                <DatePicker 
                  selected={inHandDate} 
                  onChange={date => handleInHandPicker(date)} 
                  placeholderText="In-Hand"
                  className="myDatePicker"
                />
              </div>
            </div>
            <br></br>
            <ToggleSwitch />
            <button type="submit">Submit</button>
          </form>
          <br></br>
          {/* <button onClick={e => setModalCreateJob()}>Close</button> */}
        </div>
      </Modal>
    </div>
  )
}