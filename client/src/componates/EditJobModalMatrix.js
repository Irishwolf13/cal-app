import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import ToggleSwitch from './ToggleSwitch';
import ToggleSwitchUserDefined from './ToggleSwitchUserDefined';
import MemoBox from './MemoBox';

export default function EditJobModalMatrix({ currentJob, modalEditJob, setModalEditJob, slotClickedOn, setRefreshMe }) {
  Modal.setAppElement('#root');
  const [checkBox, setCheckBox] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(null)
  const [inHandDate, setInHandDate] = useState(null)
  const [userCheckBoxes, setUserCheckBoxes] = useState([''])
  const [userMemoBoxes, setUserMemoBoxes] = useState([''])
  const [emptyJob, setEmptyJob] = useState({
    nameOfJob: currentJob.job_name, 
    delivery: currentJob.delivery,
    inHand: currentJob.in_hand,
    cncParts: currentJob.cnc_parts,
    qualityControl: currentJob.quality_control,
    productTag: currentJob.product_tag,
    hardware: currentJob.hardware,
    powderCoating: currentJob.powder_coating,
    color: currentJob.color
  })
  const [jobData, setJobData] = useState(emptyJob);

  useEffect(() =>{
    setJobData(emptyJob)
    if(currentJob.check_boxes){
      setUserCheckBoxes(currentJob.check_boxes)
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
    let frank = false
    console.log(toggleTitle)
    if (toggleTitle === 'cncParts') {
      if (typeof jobData[toggleTitle] === 'undefined') {
        frank = !currentJob.cnc_parts;
      } else {
        frank = !jobData[toggleTitle];
      }
    }
    if (toggleTitle === 'hardware') {
      if (typeof jobData[toggleTitle] === 'undefined') {
        frank = !currentJob.harware;
      } else {
        frank = !jobData[toggleTitle];
      }
    }
    if (toggleTitle === 'qualityControl') {
      if (typeof jobData[toggleTitle] === 'undefined') {
        frank = !currentJob.quality_control;
      } else {
        frank = !jobData[toggleTitle];
      }
    }
    if (toggleTitle === 'productTag') {
      if (typeof jobData[toggleTitle] === 'undefined') {
        frank = !currentJob.product_tag;
      } else {
        frank = !jobData[toggleTitle];
      }
    }
    if (toggleTitle === 'powderCoating') {
      if (typeof jobData[toggleTitle] === 'undefined') {
        frank = !currentJob.powder_coating;
      } else {
        frank = !jobData[toggleTitle];
      }
    }
    console.log(frank)
    setJobData(prevState => ({
      ...prevState,
      [toggleTitle]: frank
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
    console.log('current job');
    console.log(currentJob);
    
    const pairedCheckBoxes = userCheckBoxes.map((checkbox, index) => {
      if (index < currentJob.check_boxes.length && checkbox === '') {
        return currentJob.check_boxes[index].title;
      }
      return checkbox;
    });
    console.log(userMemoBoxes)
    console.log(currentJob.memo_boxes)
    const pairedMemoBoxes = userMemoBoxes.map((memo, index) => {
      if (index < currentJob.memo_boxes.length && memo === '') {
        return currentJob.memo_boxes[index].memo;
      }
      return memo;
    });

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
    if (userCheckBoxes.length < currentJob.check_boxes.length) {
      // Get a new array starting from the length of userCheckBoxes
      const slicedCheckBoxes = currentJob.check_boxes.slice(userCheckBoxes.length);
      
      // Loop through the slicedCheckBoxes array
      for (let i = 0; i < slicedCheckBoxes.length; i++) {
        const id = slicedCheckBoxes[i].id;
        fetch(`/check_boxes/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }

    const job_name = typeof jobData.nameOfJob !== 'undefined' ? jobData.nameOfJob : currentJob.job_name;
    const color = typeof jobData.color !== 'undefined' ? jobData.color : currentJob.color;
    const delivery = typeof jobData.delivery !== 'undefined' ? jobData.delivery : currentJob.delivery;
    const in_hand = typeof jobData.inHand !== 'undefined' ? jobData.inHand : currentJob.in_hand;
    const cnc_parts = typeof jobData.cncParts !== 'undefined' ? jobData.cncParts : currentJob.cnc_parts;
    const quality_control = typeof jobData.qualityControl !== 'undefined' ? jobData.qualityControl : currentJob.quality_control;
    const product_tag = typeof jobData.productTag !== 'undefined' ? jobData.productTag : currentJob.product_tag;
    const hardware = typeof jobData.hardware !== 'undefined' ? jobData.hardware : currentJob.hardware;
    const powderCoating = typeof jobData.powderCoating !== 'undefined' ? jobData.powderCoating : currentJob.powder_coating;

    console.log('submit info')
    console.log({
      job_name,
      color,
      delivery,
      in_hand,
      cnc_parts,
      quality_control,
      product_tag,
      hardware,
      powderCoating,
      memo_boxes: pairedMemoBoxes,
      check_boxes: pairedCheckBoxes
    })
    console.log('stringy')
    console.log(JSON.stringify({
      job_name: job_name,
      color: color,
      start_time: currentJob.start_time,
      delivery: delivery,
      in_hand: in_hand,
      cnc_parts: `${cnc_parts}`,
      quality_control: `${quality_control}`,
      product_tag: `${product_tag}`,
      hardware: `${hardware}`,
      powderCoating: `${powderCoating}`,
      memo_boxes: pairedMemoBoxes,
      check_boxes: pairedCheckBoxes
    }))
    
    // Fetch POST job
    fetch(`/jobs/${currentJob.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        job_name: job_name,
        color: color,
        start_time: currentJob.start_time,
        delivery: delivery,
        in_hand: in_hand,
        cnc_parts: `${cnc_parts}`,
        quality_control: `${quality_control}`,
        product_tag: `${product_tag}`,
        hardware: `${hardware}`,
        powderCoating: `${powderCoating}`,
        memo_boxes: pairedMemoBoxes,
        check_boxes: pairedCheckBoxes
      })
    })
    .then(response => response.json())
    .then(data => {
      setModalEditJob(!modalEditJob)
      setRefreshMe(prev => !prev)
    })
    // Reset the input value if needed
    setJobData(emptyJob);
    // setUserCheckBoxes([''])
    // setUserMemoBoxes([''])
    // setDeliveryDate(null)
    // setInHandDate(null)
  };

  const handleColorDropdownChange = (e) => {
    jobData.color = e.target.value
  }

  const handleModalClose = (e) => {
    setDeliveryDate(null)
    setInHandDate(null)
    setModalEditJob()
    setCheckBox(false);
    setJobData(emptyJob)
    // setUserCheckBoxes([''])
    // setUserMemoBoxes([''])
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
      console.log(date)
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

  const test = () => {
    console.log(jobData)
  }

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
        title={`CheckBox ${index +1}`}
      />
    ));
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
          <button onClick={test}>Test</button>
          <h2 className="modalTitle" >{`EDIT JOB: ${currentJob.job_name}`}</h2>
          {slotClickedOn && <p className="modalDate">Start Date: {slotClickedOn.start.toLocaleDateString()}</p>}
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