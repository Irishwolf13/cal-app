import React, { useState, useEffect } from 'react';
import CalendarSelection from './CalendarSelection';

export default function SideBar() {
  const [calendars, setCalendars] = useState([]);

  useEffect(() => {
    // Fetch data from backend
    fetch('/calendars')
      .then(response => response.json())
      .then(data => {
        setCalendars(data);
      })
      .catch(error => {
        console.error('Error fetching calendars:', error);
      });
  }, []);

  const handleDelete = (id) => {
    // Delete calendar from backend using ID
    fetch(`/calendars/${id}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          // Remove calendar from state
          setCalendars(prevCalendars => prevCalendars.filter(calendar => calendar.id !== id));
        } else {
          alert('Can not Delete Default Calendar');
        }
      })
      .catch(error => {
        console.error('Error deleting calendar:', error);
      });
  };

  return (
    <div className='sideBarMain'>
      {calendars.map(calendar => (
        <CalendarSelection
          key={calendar.id}
          calendar={calendar}
          onDelete={() => handleDelete(calendar.id)}
        />
      ))}
    </div>
  );
}