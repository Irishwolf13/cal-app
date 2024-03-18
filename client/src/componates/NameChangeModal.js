import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

export default function ({ modalNameChange, handleNameChangeButton, currentCalendar, setCurrentCalendar, calendarNames}) {
  const [myNewName, setMyNewName] = useState('')

  const handlePerDaySubmit = (e) => {
    e.preventDefault();
    console.log(myNewName)
    // // Fetch POST Daily Maxium Hours
    // fetch(`/daily_maximums`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({daily_max: currentCalendar})
    // })
    // .then(response => response.json())
    // .then(data => {
    //   setCurrentCalendar(data.daily_max)
    // })
    // handleNameChangeButton()
  }
  
  return (
    <Modal
      isOpen={modalNameChange}
      onRequestClose={e => handleNameChangeButton()}
      overlayClassName="Overlay"
      className="modalAdjust"
    >
      <form className="changeNameForm" onSubmit={handlePerDaySubmit}>
        <label htmlFor="calendarName">New Calendar Name</label>
        <input
          type="input"
          id="calendarName"
          name="calendarName"
          placeholder={calendarNames[currentCalendar]}
          onChange={(e) => setMyNewName(e.target.value)}
          autoFocus
          />
        <br></br>
        <button type="submit">Submit</button>
      </form>
    </Modal>
  )
}
