import React, { useState } from 'react';
import Modal from 'react-modal';

export default function ({ modalNameChange, handleNameChangeButton, currentCalendar, setCurrentCalendar, calendarNames, updateCalendarNames}) {
  const [myNewName, setMyNewName] = useState('')

  const handlePerDaySubmit = (e) => {
    e.preventDefault();
  
    // Fetch GET request to check if array is empty
    fetch(`/calendar_names`)
      .then(response => response.json())
      .then(data => {
        if (data.length === 0) {
          // Perform POST request to add 4 objects
          for (let i = 0; i < 4; i++) {
            fetch('/calendar_names', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({number: i, name: `cal${i}`})
            }).then(response => response.json())
              .then(data => {
                console.log(data);
              });
          }
        } else {
          const findNumber = parseInt(currentCalendar)
          // Find the object with the same number as currentCalendar and update its name
          const matchingObject = data.find(obj => obj.number === findNumber);
          if (matchingObject) {
            const updatedName = myNewName; // Your new name
            fetch(`/calendar_names/${matchingObject.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({name: updatedName})
            })
            .then(response => response.json())
            .then(data => {
              console.log(data);
              updateCalendarNames(updatedName, findNumber); // This updates the parent state
              handleNameChangeButton(); // Close the modal after updating
            });
          }
        }
      });
  };
  
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
