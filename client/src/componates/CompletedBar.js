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
  const renderActivityCircle = (colorClass, handleClick, status, dataContent) => (
    <div 
      className={`circle ${colorClass} selection tooltip2`} 
      onClick={() => handleClick(status)}
      data-content={dataContent}
    ></div>
  );

  return (
    <div className={`completed ${job.uuid === currentlySelected ? 'selected' : 'notSelected'} ${activeStatus === 'inActive' ? 'lightGrey' : activeStatus === 'noCalendar' ? 'grey' : ''}`}>
      <div className='completedActivity'>
        <button className={
          `circle ${
            activeStatus === 'inActive' ? 'grey'
          : activeStatus === 'noCalendar' ? 'darkGrey' 
          : ''
          }`
        }></button>
      </div>
      <div className='completedActivityDropdown'>
        <div className='flex'>
          {renderActivityCircle('grey', handleActivitySelectionClicked, 'inActive', 'InActive')}
          {renderActivityCircle('darkGrey', handleActivitySelectionClicked, 'noCalendar', 'NoCalendar')}
        </div>
      </div>
      <div className='completedName' onClick={handleBarClick}> {job.job_name} </div>
      <div className={`completedActivityDropdown ${activityDropdownVisible ? 'visible' : 'invisible'}`}>
      </div>
      <div 
        className='completedDate tooltip' 
        onClick={handleNavigate}
        data-content={`Start: ${job.events[0].start_time}`}
        >{new Date(job.delivery).toLocaleDateString()}
      </div>
    </div>
  );
}