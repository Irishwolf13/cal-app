import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import ToggleSwitch from './ToggleSwitch';
import ToggleSwitchUserDefined from './ToggleSwitchUserDefined';
import MemoBox from './MemoBox';

export default function EditJobModalMatrix({ currentJob, setCurrentJob, modalEditJob, setModalEditJob, slotClickedOn, setRefreshMe }) {
  Modal.setAppElement('#root');
  const [checkBox, setCheckBox] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(null)
  const [adjustedDate, setAdjustedDate] = useState(null)
  const [adjustInHandDate, setAdjustInHandDate] = useState(null)
  const [inHandDate, setInHandDate] = useState(null)
  const [userCheckBoxes, setUserCheckBoxes] = useState([''])
  const [userMemoBoxes, setUserMemoBoxes] = useState([''])
  const [emptyJob, setEmptyJob] = useState({})
  const [jobData, setJobData] = useState(emptyJob);

  useEffect(() =>{
    setJobData({
      nameOfJob: currentJob.job_name,
      calendar: currentJob.calendar,
      delivery: currentJob.delivery,
      inHand: currentJob.in_hand,
      cncParts: currentJob.cnc_parts,
      qualityControl: currentJob.quality_control,
      productTag: currentJob.product_tag,
      hardware: currentJob.hardware,
      powderCoating: currentJob.powder_coating,
      color: currentJob.color
    })
    if(currentJob.checks){
      setUserCheckBoxes(currentJob.checks)
      setUserMemoBoxes(currentJob.memo_boxes)
    }
  },[currentJob])
  
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setJobData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleToggleChange = (toggleTitle) => {
    let toggleInfo = false
    if (toggleTitle === 'cncParts') {
      if (typeof jobData[toggleTitle] === 'undefined') {
        toggleInfo = !currentJob.cnc_parts;
      } else {
        toggleInfo = !jobData[toggleTitle];
      }
    }
    if (toggleTitle === 'hardware') {
      if (typeof jobData[toggleTitle] === 'undefined') {
        toggleInfo = !currentJob.hardware;
      } else {
        toggleInfo = !jobData[toggleTitle];
      }
    }
    if (toggleTitle === 'qualityControl') {
      if (typeof jobData[toggleTitle] === 'undefined') {
        toggleInfo = !currentJob.quality_control;
      } else {
        toggleInfo = !jobData[toggleTitle];
      }
    }
    if (toggleTitle === 'productTag') {
      if (typeof jobData[toggleTitle] === 'undefined') {
        toggleInfo = !currentJob.product_tag;
      } else {
        toggleInfo = !jobData[toggleTitle];
      }
    }
    if (toggleTitle === 'powderCoating') {
      if (typeof jobData[toggleTitle] === 'undefined') {
        toggleInfo = !currentJob.powder_coating;
      } else {
        toggleInfo = !jobData[toggleTitle];
      }
    }
    setJobData(prevState => ({
      ...prevState,
      [toggleTitle]: toggleInfo
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

    if (userMemoBoxes.length < currentJob.memo_boxes.length) {
      // Get a new array starting from the length of userMemoBoxes
      const slicedMemoBoxes = currentJob.memo_boxes.slice(userMemoBoxes.length);
      // Loop through the slicedMemoBoxes array
      for (let i = 0; i < slicedMemoBoxes.length; i++) {
        const id = slicedMemoBoxes[i].id;
        fetch(`/memo_boxes/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }
    if (userCheckBoxes.length < currentJob.checks.length) {
      // Get a new array starting from the length of userCheckBoxes
      const slicedCheckBoxes = currentJob.checks.slice(userCheckBoxes.length);
      
      // Loop through the slicedCheckBoxes array
      for (let i = 0; i < slicedCheckBoxes.length; i++) {
        const id = slicedCheckBoxes[i].id;
        fetch(`/checks/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }

    // SO hacky... sorry future John
    // Looping through the currentJob.checks I want to check the corresponding userCheckBoxes and if
    // its string is '', do nothing.  Else send a fetch request to /checks/`${id}` with {title:THE STRING}
    // The userCheckBoxes array may be longer than currentJob.checks
    // Loop through the currentJob.checks array
    currentJob.checks.forEach((checkbox, index) => {
      // Check if the corresponding userCheckBoxes[index] is not an empty string
      if (userCheckBoxes[index] !== '') {
        // Send a fetch request to update the checkbox item
        fetch(`/checks/${checkbox.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title: userCheckBoxes[index] })
        })
        .then(response => response.json())
        // .then(data => {
        //   console.log('Checkbox successfully updated:', data);
        // })
        .catch(error => {
          console.error('Error updating checkbox:', error);
        });
      }
      // If the userCheckBoxes[index] is an empty string, do nothing
    });
    
    let tempMemoArray = [];
    let tempCheckBoxArray = [];

    if (currentJob.memo_boxes.length < userMemoBoxes.length) {
      const numToAdd = userMemoBoxes.length - currentJob.memo_boxes.length;

      for (let i = 0; i < numToAdd; i++) {
        tempMemoArray.push('');
      }
    }
    if (currentJob.checks.length < userCheckBoxes.length) {
      const numToAdd = userCheckBoxes.length - currentJob.checks.length
      let tempIndex = userCheckBoxes.length - numToAdd
      for (let i = 0; i < numToAdd; i++) {
        tempCheckBoxArray.push(userCheckBoxes[tempIndex]);
      }
    }

    // This might be useless now that I put the jobData into the useEffect at the start like I should have from the start...
    const job_name = typeof jobData.nameOfJob !== 'undefined' ? jobData.nameOfJob : currentJob.job_name;
    const color = typeof jobData.color !== 'undefined' ? jobData.color : currentJob.color;
    const delivery = typeof deliveryDate !== null ? deliveryDate : currentJob.delivery;
    const inHand = typeof inHandDate !== null ? inHandDate : currentJob.in_hand;
    const cnc_parts = typeof jobData.cncParts !== 'undefined' ? jobData.cncParts : currentJob.cnc_parts;
    const quality_control = typeof jobData.qualityControl !== 'undefined' ? jobData.qualityControl : currentJob.quality_control;
    const product_tag = typeof jobData.productTag !== 'undefined' ? jobData.productTag : currentJob.product_tag;
    const hardware = typeof jobData.hardware !== 'undefined' ? jobData.hardware : currentJob.hardware;
    const powderCoating = typeof jobData.powderCoating !== 'undefined' ? jobData.powderCoating : currentJob.powder_coating;

    // Fetch POST job
    fetch(`/jobs/${currentJob.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        newTitle: job_name,
        color: color,
        newCalendar: jobData.calendar,
        start_time: currentJob.start_time,
        newDelivery: delivery,
        in_hand: inHandDate,
        cnc_parts: `${cnc_parts}`,
        quality_control: `${quality_control}`,
        product_tag: `${product_tag}`,
        hardware: `${hardware}`,
        powder_coating: `${powderCoating}`,
        memo_boxes: tempMemoArray,
        checks: tempCheckBoxArray
      })
    })
    .then(response => response.json())
    .then(data => {
      // console.log('return')
      // console.log(data)
      setCurrentJob(data)
      setModalEditJob(!modalEditJob)
      setRefreshMe(prev => !prev)
    })
    // Reset the input value if needed
    setJobData(emptyJob);
    setAdjustedDate(null)
    setAdjustInHandDate(null)
  };

  const handleColorDropdownChange = (e) => {
    jobData.color = e.target.value
  }

  const handleModalClose = (e) => {
    setDeliveryDate(null)
    setAdjustedDate(null)
    setAdjustInHandDate(null)
    setInHandDate(null)
    setModalEditJob()
    setCheckBox(false);
    setJobData(emptyJob)
  }

  const handleDeliveryPicker = (date) => {
    if (date !== null) {
      const selectedDate = date;
      selectedDate.setDate(selectedDate.getDate() + 1);
      setAdjustedDate(selectedDate -1)
      setDeliveryDate(selectedDate);
    }else {setDeliveryDate(null)}
  }

  const handleInHandPicker = (date) => {
    if (date !== null) {
      const selectedDate = date;
      selectedDate.setDate(selectedDate.getDate() + 1);
      setAdjustInHandDate(selectedDate -1)
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

  // const test = () => {
  //  console.log(jobData)
  // }

  const renderMemoBoxes = (userMemoBoxes, handleMemoChange, removeMemoBox) => (
    userMemoBoxes.map((memo, index) => (
      <MemoBox 
        key={index} 
        memo={memo.memo} 
        index={index} 
        handleMemoChange={handleMemoChange}
        removeMemoBox={removeMemoBox}
      />
    ))
  );
  function renderCheckBoxes(userCheckBoxes, handleUserInputChange, removeUserCheckBoxes) {
    return userCheckBoxes.map((checkbox, index) => (
      <ToggleSwitchUserDefined 
        key={index} 
        index={index} 
        handleUserInputChange={handleUserInputChange}
        removeUserCheckBoxes={removeUserCheckBoxes}
        title={checkbox.title}
      />
    ));
  }
  const handleCalendarDropdownChange = (e) => {
    const updatedJobData = {
      ...jobData,
      calendar: e.target.value
  };

  // Update the state to this new object
  setJobData(updatedJobData);
  }

  return (
    <div>
      <Modal
        isOpen={modalEditJob}
        onRequestClose={handleModalClose}
        overlayClassName="Overlay"
        className="modalBasic"
      >
        <div>
          {/* <button onClick={test}>Test</button> */}
          <h2 className="modalTitle" >{`EDIT JOB: ${currentJob.job_name}`}</h2>
          <label>Select Calendar: </label>
          <select id="calendar-dropdown" value={jobData.calendar} onChange={(e) => handleCalendarDropdownChange(e)}>
            <option value="" disabled>Select calendar</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
          {currentJob.start_time && <p className="modalDate">Start Date: {currentJob.start_time}</p>}
          <form className="createJobForm" onSubmit={handleSubmit}>
            <label htmlFor="nameOfJob">Name of Job</label>
            <input
              type="text"
              id="nameOfJob"
              name="nameOfJob"
              value={jobData.nameOfJob}
              onChange={handleTextChange}
              autoFocus
              placeholder={currentJob.job_name}
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
                {/* <option value="rgb(100, 100, 100)">Gray</option> */}
                <option value="rgb(255, 255, 0)">Yellow</option>
                <option value="rgba(255, 166, 0, 0.623)">Orange</option>
              </select>
              <div style={{ display: "inline-block" }}>
                <DatePicker 
                  selected={adjustedDate} 
                  onChange={date => handleDeliveryPicker(date)} 
                  placeholderText="Delivery"
                  className="myDatePicker"
                />
              </div>
              <div style={{ display: "inline-block" }}>
                <DatePicker 
                  selected={adjustInHandDate} 
                  onChange={date => handleInHandPicker(date)} 
                  placeholderText="In-Hand"
                  className="myDatePicker"
                />
              </div>
            </div>
            <br></br>
            <ToggleSwitch status={currentJob.cnc_parts} title={'CnC Parts'} option={"cncParts"} toggleChange={handleToggleChange}/>
            <ToggleSwitch status={currentJob.quality_control} title={'Quality Control Tags'} option={"qualityControl"} toggleChange={handleToggleChange}/>
            <ToggleSwitch status={currentJob.product_tag} title={'Product Tags'} option={"productTag"} toggleChange={handleToggleChange}/>
            <ToggleSwitch status={currentJob.hardware} title={'Hardware'} option={"hardware"} toggleChange={handleToggleChange}/>
            <ToggleSwitch status={currentJob.powder_coating} title={'Powder Coating'} option={"powderCoating"} toggleChange={handleToggleChange}/>
            {renderCheckBoxes(userCheckBoxes, handleUserInputChange, removeUserCheckBoxes)}
            {renderMemoBoxes(userMemoBoxes, handleMemoChange, removeMemoBox)}
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
          {/* <button onClick={e => setModalEditJob()}>Close</button> */}
        </div>
      </Modal>
    </div>
  )
}