import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import ToggleSwitch from './ToggleSwitch';
import ToggleSwitchUserDefined from './ToggleSwitchUserDefined';
import MemoBox from './MemoBox';

export default function CreateJobModal({ modalCreateJob, setModalCreateJob, slotClickedOn, setAllEvents, allEvents, setRefreshMe, currentCalendar, calendarNames }) {
  Modal.setAppElement('#root');
  const [checkBox, setCheckBox] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(null)
  const [inHandDate, setInHandDate] = useState(null)
  const [userCheckBoxes, setUserCheckBoxes] = useState([''])
  const [userMemoBoxes, setUserMemoBoxes] = useState([''])
  const [myCalNames, setMyCalNames] = useState([''])

  // Define the initial structure for a job object
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
    color: 'Blue',
    calendar: currentCalendar, // set initial value to currentCalendar
  };
  const [jobData, setJobData] = useState(emptyJob);

  useEffect(() => {
    if (modalCreateJob) {
      setJobData({
        ...emptyJob, // spread the initialJobData to reset other fields
        calendar: currentCalendar // update the calendar field with currentCalendar
      });
    }
  }, [modalCreateJob, currentCalendar]);

  useEffect(() => {
    const updatedJobData = {
      ...jobData,
      calendar: currentCalendar
  };
  setJobData(updatedJobData);
  }, [currentCalendar]);
    
  useEffect(() => {
    const nameArray = calendarNames.map(item => item);
    setMyCalNames(nameArray);
  },[calendarNames])

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
    
    if (jobData.calendar === '4') {
      jobData.calendar = '0'
    }
    
    // Fetch POST job
    fetch(`/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        job_name: jobData.nameOfJob,
        calendar: jobData.calendar,
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

  function handleCalendarChange(e) {
    const updatedJobData = {
        ...jobData,
        calendar: e.target.value
    };
    setJobData(updatedJobData);
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
          <select id="calendar-dropdown" value={jobData.calendar} onChange={(e) => handleCalendarChange(e)}>
            <option value="" disabled>Select calendar</option>
            {myCalNames.map((name, index) => (
              <option key={index} value={index}>{name}</option>
            ))}
          </select>
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
                <option value="rgb(171, 255, 171)">Light Green</option>
                <option value="rgb(100, 0, 100)">Purple</option>
                <option value="rgb(155, 0, 155)">Light Purple</option>
                <option value="rgb(255, 63, 172)">Pink</option>
                <option value="rgb(253, 163, 214)">Light Pink</option>
                <option value="rgb(255, 149, 0)">Orange</option>
                <option value="rgb(255, 189, 96)">Light Orange</option>
                <option value="rgb(255, 255, 0)">Yellow</option>
                <option value="rgb(255, 255, 193)">Light Yellow</option>
                <option value="rgb(121, 0, 0)">Red</option>
                <option value="rgb(255, 60, 60)">Light Red</option>
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