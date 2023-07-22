import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

export default function EditJobModal({ modalEditJob, setModalEditJob, eventClickedOn, setRefreshMe, allEvents}) {
  Modal.setAppElement('#root')

  const [newPerDay, setNewPerDay] = useState('');
  const [options, setOptions] = useState(false);
  const [newColor, setNewColor] = useState('');
  const [newHours, setNewHours] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [isFirstDay, setIsFirstDay] = useState(false)

  const handlePerDaySubmit = async (e) => {
    e.preventDefault();
    if (newPerDay < 0) {
      alert('Can not have negative hours')
      return;
    }
    try {
      const response = await fetch(`/jobs/${eventClickedOn.job_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({eventClickedOn, newPerDay: newPerDay})
      });
      const data = await response.json();

      let myInfo = data.events;
      let myRemaining = myInfo[myInfo.length -1].hours_remaining
      let myPerDay = myInfo[myInfo.length -1].hours_per_day

      if (myRemaining <= 0) {
        for (let i = myInfo.length - 1; i >= 0; i--) {
          if (myInfo[i].hours_remaining <= 0) {
            await handleSubClicked(e);
          }
        }
      }
      if (myRemaining > myPerDay) {
        const myNumber = Math.ceil(myRemaining/myPerDay)
        for (let index = 1; index < myNumber; index++) {
          await handleAddClicked(e);
        }        
      }
      setRefreshMe(prev => !prev);
      setModalEditJob(!modalEditJob);
    } catch (error) {
      console.error(error);
    }
  };

  const handleJobChangeSubmit = (e) => {
    e.preventDefault();
    if (newHours < 0) {
      alert('Can not have negative hours')
      return
    }
    postJobChange(eventClickedOn)
    setOptions(!options)
    setNewColor('')
    setNewHours('')
    setNewTitle('')
  }
  // const checkLastEvent = (eventClickedOn) => {
  //   console.log(eventClickedOn)
  //   const filteredEvents = allEvents.filter(myEvent => myEvent.job_id === eventClickedOn.job_id);
  //   const lastObject = filteredEvents[filteredEvents.length - 1];
  //   console.log('lastObject', lastObject)
  // }
  const postJobChange = () => {
    // Fetch POST job
    fetch(`/jobs/${eventClickedOn.job_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({eventClickedOn, newColor: newColor, newHours: newHours, newTitle: newTitle})
    })
    .then(response => response.json())
    .then(data => {
      setRefreshMe(prev => !prev)
      setModalEditJob(!modalEditJob)
    })
  }
  const handleButtonClicked = (e) => {
    setOptions(!options)
    checkFirstDay()
  }
  const handleColorDropdownChange = (e) => {
    setNewColor(e.target.value)
  }
  const handleDeleteJob = () => {
    const userConfirmation = window.confirm("Delete this job forever?");
    if (userConfirmation) {
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
      setOptions(!options)
      setModalEditJob(!modalEditJob)
    } else {
      // If the user clicked "No" or closed the dialog
    }
  }
  
  const handleAddClicked = async (e) => {
    e.preventDefault();
    // Fetch POST job
    try {
      const response = await fetch(`/jobs/add/${eventClickedOn.job_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({job_id: eventClickedOn.job_id})
      });

      const data = await response.json();
      setRefreshMe(prev => !prev);
      // setOptions(!options)
      // setModalEditJob(!modalEditJob)
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubClicked = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/jobs/sub/${eventClickedOn.job_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({job_id: eventClickedOn.job_id})
      });
      const data = await response.json();
      setRefreshMe(prev => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  const checkFirstDay = () =>  {
    if (eventClickedOn.uuid === allEvents.filter(obj => obj.job_id === eventClickedOn.job_id)[0].uuid) {
      setIsFirstDay(true)
    } else {
      setIsFirstDay(false)
    }
  }

  const handleModalClosed = (e) => {
    setModalEditJob()
    setOptions(false)
  }

  return (
    <div>
      <Modal
        isOpen={modalEditJob}
        onRequestClose={handleModalClosed}
        overlayClassName="OverlayAdjust"
        className="modalAdjust"
      >
        <button className="optionsButton" onClick={handleButtonClicked}>...</button>
        {!options &&
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
        }
        {options &&
          <div>
            <div>Changes for Entire Job</div>
            <br></br>
            <form className="createJobForm" onSubmit={handleJobChangeSubmit}>
              <label htmlFor="totalHours">Hours</label>
              <input
                type="number"
                id="totalHours"
                placeholder='New Hours'
                onChange={(e) => setNewHours(e.target.value)}
              />
              <br></br>
              <label htmlFor="totalHours">Title</label>
              <input
                type="text"
                id="jobName"
                placeholder='New Title'
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <br></br>
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
              <div className='smallBreak'></div>
              <button className='editingButtons' type="submit">Submit</button>
              <br></br>
              <button  className='editingButtons' onClick={handleSubClicked}>Sub Day</button>
              <button  className='editingButtons' onClick={handleAddClicked}>Add Day</button>
            </form>
              {isFirstDay && <button className='deleteJobButton' onClick={handleDeleteJob} >Delete Job</button>}
          </div>
        }

      </Modal>
    </div>
  )
}
