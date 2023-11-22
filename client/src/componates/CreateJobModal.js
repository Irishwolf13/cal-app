import React, { useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import ToggleSwitch from './ToggleSwitch';
import ToggleSwitchUserDefined from './ToggleSwitchUserDefined';
import MemoBox from './MemoBox';

export default function CreateJobModal({ modalCreateJob, setModalCreateJob, slotClickedOn, setAllEvents, allEvents, setRefreshMe }) {
  Modal.setAppElement('#root');
  const [checkBox, setCheckBox] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(null)
  const [inHandDate, setInHandDate] = useState(null)
  const [userCheckBoxes, setUserCheckBoxes] = useState([''])
  const [userMemoBoxes, setUserMemoBoxes] = useState([''])
  const emptyJob = {
    hoursForJob: '',
    hoursPerDay: '',
    nameOfJob: '',
    scheduled: true,
    delivery: null,
    inHand: null,
    cncParts: false,
    qualityControl: false,
    productTag: false,
    hardware: false,
    powderCoating: false,
    color: 'Blue'
  }
  const [jobData, setJobData] = useState(emptyJob);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setJobData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleToggleChange = (toggleTitle) => {
    setJobData(prevState => ({
      ...prevState,
      [toggleTitle]: !prevState[toggleTitle]
    }));
  };

  const handleUserInputChange = (index, userInput) => {
    setUserCheckBoxes((prevUserCheckBoxes) =>
      prevUserCheckBoxes.map((checkbox, i) =>
        i === index ? userInput : checkbox
      )
    );
  };

  const handleMemoChange = (index, memo) => {
    setUserMemoBoxes((prevUserMemoBoxes) =>
      prevUserMemoBoxes.map((item, i) => (i === index ? memo : item))
    );
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
    let _deliveryDate = deliveryDate
    if (deliveryDate != null) {
      _deliveryDate.setDate(_deliveryDate.getDate() + 1);
    }
    let _inHandDate = inHandDate
    if(inHandDate != null) {
      _inHandDate.setDate(_inHandDate.getDate() + 1);
    }

    if (jobData.scheduled === true) {
      jobData.status = 'active'
    }else {
      jobData.status = 'noCalendar'
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
        calendar: 0,
        inital_hours: jobData.hoursForJob,
        hours_per_day: jobData.hoursPerDay,
        color: jobData.color,
        start_time: slotClickedOn.start,
        delivery: _deliveryDate,
        in_hand: _inHandDate,
        status: jobData.status,
        quadrent: 'preShop',
        cut: 'notStarted',
        weld: 'notStarted',
        finish: 'notStarted',
        cnc_parts: jobData.cncParts,
        quality_control: jobData.qualityControl,
        product_tag: jobData.productTag,
        hardware: jobData.hardware,
        powder_coating: jobData.powderCoating,
        memo_boxes: userMemoBoxes,
        checks: userCheckBoxes
      })
    })
    .then(response => response.json())
    .then(data => {
      setModalCreateJob(!modalCreateJob)
      setAllEvents([...allEvents, ...data.events])
      setRefreshMe(prev => !prev)
    })
    // Reset the input value if needed
    setJobData(emptyJob);
    setUserCheckBoxes([''])
    setUserMemoBoxes([''])
    setDeliveryDate(null)
    setInHandDate(null)
  };

  const handleColorDropdownChange = (e) => {
    jobData.color = e.target.value
  }

  const handleCheckBox = (e) => {
    setCheckBox(prev => !prev)
  }

  const handleModalClose = (e) => {
    setDeliveryDate(null)
    setInHandDate(null)
    setModalCreateJob()
    setCheckBox(false);
    setJobData(emptyJob)
    setUserCheckBoxes([''])
    setUserMemoBoxes([''])
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

  const handleNewCheck = () => {
    setUserCheckBoxes((prevUserCheckBoxes) => [
      ...prevUserCheckBoxes,
      ''
    ]);
  };

  const removeUserCheckBoxes = (index) => {
    const updatedCheckBoxes = [...userCheckBoxes];  // Make a copy of the state array
    updatedCheckBoxes.splice(index, 1);             // Remove the object at the specified index
    setUserCheckBoxes(updatedCheckBoxes);           // Update the state with the modified array
  }

  const handleNewMemoBox = () => {
    setUserMemoBoxes((userMemoBoxes) => [
      ...userMemoBoxes,
      ''
    ]);
  }

  const removeMemoBox = (index) => {
    const updatedMemoBoxes = [...userMemoBoxes];
    updatedMemoBoxes.splice(index, 1);
    setUserMemoBoxes(updatedMemoBoxes);
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
              onChange={() => handleToggleChange("scheduled")}
            />Scheduled 
          </label>
          <form className="createJobForm" onSubmit={handleSubmit}>
            <label htmlFor="nameOfJob">Name of Job</label>
            <input
              type="text"
              id="nameOfJob"
              name="nameOfJob"
              value={jobData.nameOfJob}
              onChange={handleTextChange}
              autoFocus
            />
            <br></br>
            <label htmlFor="totalHours">Hours for Job</label>
            <input
              type="number"
              id="totalHours"
              name="hoursForJob"
              value={jobData.hoursForJob}
              onChange={handleTextChange}
            />
            <br></br>
            <label htmlFor="perDay">Hours Per Day</label>
            <input
              type="number"
              id="perDay"
              name="hoursPerDay"
              value={jobData.hoursPerDay}
              onChange={handleTextChange}
            />
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
                  placeholderText="Ship Date"
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
            <ToggleSwitch title={'CnC Parts'} option={"cncParts"} toggleChange={handleToggleChange}/>
            <ToggleSwitch title={'Quality Control Tags'} option={"qualityControl"} toggleChange={handleToggleChange}/>
            <ToggleSwitch title={'Product Tags'} option={"productTag"} toggleChange={handleToggleChange}/>
            <ToggleSwitch title={'Hardware'} option={"hardware"} toggleChange={handleToggleChange}/>
            <ToggleSwitch title={'Powder Coating'} option={"powderCoating"} toggleChange={handleToggleChange}/>
            {userCheckBoxes.map((checkbox, index) => (
              <ToggleSwitchUserDefined 
                key={index} 
                index={index} 
                handleUserInputChange={handleUserInputChange}
                removeUserCheckBoxes={removeUserCheckBoxes}
              />
            ))}
            {userMemoBoxes.map((memo, index) => (
              <MemoBox 
                key={index} 
                memo={memo} 
                index={index} 
                handleMemoChange={handleMemoChange}
                removeMemoBox={removeMemoBox}
              />
            ))}
            <br></br>
            <button type="submit">Submit</button>
          </form>
          <br></br>
          <div className='user-plus-container'>
            <div className='user-plus-boxes'>
              <button className='user-plus-button' onClick={handleNewCheck}>+</button>
              <div>User Defined Check</div>
            </div>
            <div className='user-plus-boxes'>
              <button className='user-plus-button' onClick={handleNewMemoBox}>+</button>
              <div>Memo Box</div>
            </div>
          </div>
          {/* <button onClick={e => setModalCreateJob()}>Close</button> */}
        </div>
      </Modal>
    </div>
  )
}