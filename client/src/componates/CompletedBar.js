import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CompletedBar({ job, setCurrentlySelected, currentlySelected, setCurrentJob, changeDate}) {
  const [activeStatus, setActiveStatus] = useState(job.status);
  const [activityDropdownVisible, setActivityDropdownVisible] = useState(false); // State for visibility
  
      // This allows navigation
      const navigate = useNavigate();
      const handleNavigate = () => {
        changeDate(job.events[0].start_time);
        navigate('/');
      }

  // This is clicked to populate the details panel
  const handleBarClick = () => {
    setCurrentlySelected(job.uuid);
    
    fetch(`/jobs/${job.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        setCurrentJob(data); // Set the value of _job using setCurrentJob
      })
      .catch(error => console.error(error));
  };

  const handleActivityClick = (color) => {
    setActivityDropdownVisible(!activityDropdownVisible); // Toggle visibility
  };
  
  const handleActivitySelectionClicked = (color) => {
    setActiveStatus(color);
    setActivityDropdownVisible(!activityDropdownVisible); // Toggle visibility
    fetch(`/jobs/${job.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: color })
    });
  };

  return (
    <div className={`completed ${job.uuid === currentlySelected ? 'selected' : 'notSelected'} ${activeStatus === 'inActive' ? 'lightGrey' : activeStatus === 'noCalendar' ? 'grey' : ''}`}>
      <div className='completedActivity'>
        <button className={
          `circle ${
            activeStatus === 'inActive' ? 'grey'
          : activeStatus === 'noCalendar' ? 'darkGrey' 
          : ''
          }`
        } onClick={handleActivityClick}></button>
      </div>
      <div className='completedName' onClick={handleBarClick}> {job.job_name} </div>
      <div className={`completedActivityDropdown ${activityDropdownVisible ? 'visible' : 'invisible'}`}>
        <button className="circle grey selection" onClick={() => handleActivitySelectionClicked("inActive")}></button>
        <button className="circle darkGrey selection" onClick={() => handleActivitySelectionClicked("noCalendar")}></button>
      </div>
      <div className='completedDate' onClick={handleNavigate}>{new Date(job.delivery).toLocaleDateString()}</div>
    </div>
  );
}