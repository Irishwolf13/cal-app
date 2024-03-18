import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'

export default function EditJobModal({ modalEditJob, setModalEditJob, eventClickedOn, setRefreshMe, allEvents}) {
  Modal.setAppElement('#root')

  const [newPerDay, setNewPerDay] = useState('');
  const [options, setOptions] = useState(false);
  const [newColor, setNewColor] = useState('');
  const [newCalendar, setNewCalendar] = useState('');
  const [newHours, setNewHours] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [isFirstDay, setIsFirstDay] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [tempHoursRemaining, setTempHoursRemaining] = useState(0)

  const handlePerDaySubmit = (e) => {
    e.preventDefault();
    if (newPerDay < 0) {
      alert('Can not have negative hours')
      return
    }
    // Fetch PATCH job
    fetch(`/jobs/${eventClickedOn.job_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({eventClickedOn, newPerDay: newPerDay})
    })
    .then(response => response.json())
    .then(data => {
      // console.log("There:",eventClickedOn.uuid)
      // console.log("Here: ",data.events[data.events.length - 1].uuid)
      if (eventClickedOn.uuid === data.events[data.events.length - 1].uuid) {
        handleAddClicked(e)
      }else {
        autoAddEvents(e, data)
        autoSubEvents(e, data)
      }
      setRefreshMe(prev => !prev)
      setModalEditJob(!modalEditJob)
    })
    // console.log('EventClickedON',eventClickedOn)
  }
  const handleJobChangeSubmit = (e) => {
    e.preventDefault();
    if (newHours < 0) {
      alert('Can not have negative hours')
      return
    }
    let infoToSend = ''
    if (selectedDate !== null) {
      selectedDate.setDate(selectedDate.getDate() + 1);
      setSelectedDate(selectedDate);
      infoToSend = JSON.stringify({eventClickedOn, newColor: newColor, newHours: newHours, newTitle: newTitle, newCalendar: newCalendar, newDelivery: selectedDate})
    }else {
      infoToSend = JSON.stringify({eventClickedOn, newColor: newColor, newHours: newHours, newTitle: newTitle, newCalendar: newCalendar})
    }
    // Fetch POST job
    fetch(`/jobs/${eventClickedOn.job_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: infoToSend
    })
    .then(response => response.json())
    .then(data => {
      autoAddEvents(e, data)
      autoSubEvents(e, data)
      setRefreshMe(prev => !prev)
      setModalEditJob(!modalEditJob)
    })
    setOptions(!options)
    setNewColor('')
    setNewCalendar('')
    setNewHours('')
    setNewTitle('')
    setSelectedDate(null)
  }
  const handleButtonClicked = (e) => {
    let jobToFind = eventClickedOn.job_id
    let foundJobID = allEvents.find(job => job.job_id === jobToFind)
    setTempHoursRemaining(foundJobID.title.match(/--\s*(.*?)\s*\//)[1])
    setOptions(!options)
    checkFirstDay()
    setNewCalendar(eventClickedOn.calendar)
  }
  const handleColorDropdownChange = (e) => {
    setNewColor(e.target.value)
  }
  const handleCalendarDropdownChange = (e) => {
    setNewCalendar(e.target.value)
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
  
  const handleAddClicked = (e, numberToAdd = 1) => {
    e.preventDefault();
    // Fetch POST job
    fetch(`/jobs/add/${eventClickedOn.job_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({job_id: eventClickedOn.job_id, numb_add: numberToAdd})
    })
    .then(response => response.json())
    .then(data => {
      setRefreshMe(prev => !prev)
      // setOptions(!options)
      // setModalEditJob(!modalEditJob)
    })
  }
  const autoAddEvents = (e, data) => {
    let lastDay = data.events[data.events.length -1]
    if (lastDay.hours_remaining >= data.hours_per_day) {
      lastDay.hours_per_day = data.hours_per_day
    }else {
      lastDay.hours_per_day = lastDay.hours_remaining
    }
    const filteredEvent = allEvents.filter(event => event.uuid === lastDay.uuid);
    eventClickedOn = filteredEvent[0]
    // Fetch PATCH job
    fetch(`/jobs/${filteredEvent[0].job_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({eventClickedOn, newPerDay: lastDay.hours_per_day})
    })
    .then(response => response.json())
    .then(data => {
      let addCount = 0
      let jobPerDay = data.hours_per_day
      let lastPerDay = data.events[data.events.length -1].hours_per_day
      let lastHoursRemaining = data.events[data.events.length -1].hours_remaining - lastPerDay
      while (lastHoursRemaining > 0) {
        addCount = addCount + 1
        lastHoursRemaining = lastHoursRemaining - jobPerDay
      }
      handleAddClicked(e, addCount)
      setRefreshMe(prev => !prev)
      setModalEditJob(!modalEditJob)
    })
  }

  const handleSubClicked = (e, numberToSubtract = 1) => {
    e.preventDefault();
    // Fetch POST job
    fetch(`/jobs/sub/${eventClickedOn.job_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({job_id: eventClickedOn.job_id, numb_subtract: numberToSubtract})
    })
    .then(response => response.json())
    .then(data => {
      setRefreshMe(prev => !prev)
      // setOptions(!options)
      // setModalEditJob(!modalEditJob)
    })
  }

  const autoSubEvents = (e, data) => {
    let subCount = 0
    for (let i = 0; i < data.events.length; i++) {
      const element = data.events[i];
      if (element.hours_remaining <= 0) {
        subCount++
      }
    }
    if (subCount > 0){
      handleSubClicked(e, subCount)
    }
  }

  const checkFirstDay = () =>  {
    if (eventClickedOn.uuid === allEvents.filter(obj => obj.job_id === eventClickedOn.job_id)[0].uuid) {
      setIsFirstDay(true)
    } else {
      setIsFirstDay(false)
    }
  }

  const handleModalClosed = (e) => {
    setNewColor('')
    setNewCalendar('')
    setNewHours('')
    setNewTitle('')
    setSelectedDate(null)
    setModalEditJob()
    setOptions(false)
  }

  const handleDatePicker = (date) => {
    if (date !== null) {
      const selectedDate = date;
      selectedDate.setDate(selectedDate.getDate());
      setSelectedDate(selectedDate);
    }else {setSelectedDate(null)}
  }

  function getPlaceholderDate() {
    const deliveryDate = new Date(eventClickedOn.delivery);
    const formattedDate = deliveryDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    return formattedDate;
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
              placeholder={eventClickedOn ? eventClickedOn.title.match(/\/\s*(\d+)/)[1] : ''}
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
              <label htmlFor="totalHours">Job Name</label>
              <input
                type="text"
                id="jobName"
                placeholder={eventClickedOn.title.match(/^(.*?)\s*--/)[1]}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <br></br>
              <label htmlFor="totalHours">Job Hours</label>
              <input
                type="number"
                id="totalHours"
                placeholder={tempHoursRemaining}
                onChange={(e) => setNewHours(e.target.value)}
              />
              <br></br>
              <label>Delivery</label>
              <DatePicker 
                selected={selectedDate} 
                onChange={date => handleDatePicker(date)} 
                placeholderText={getPlaceholderDate(eventClickedOn.delivery)}
              />
              <br></br>
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
              <select id="calendar-dropdown" value={newCalendar} onChange={(e) => handleCalendarDropdownChange(e)}>
                <option value="" disabled>Select calendar</option>
                <option value="0">Main Calendar</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
              <br></br>
              <button className='editingButtons' type="submit">Submit</button>
              <br></br>
              <button  className='editingButtons' onClick={e => handleSubClicked(e)}>Sub Day</button>
              <button  className='editingButtons' onClick={e => handleAddClicked(e)}>Add Day</button>
            </form>
              {isFirstDay && <button className='deleteJobButton' onClick={handleDeleteJob} >Delete Job</button>}
          </div>
        }

      </Modal>
    </div>
  )
}
