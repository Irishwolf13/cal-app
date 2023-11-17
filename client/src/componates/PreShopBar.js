import React, { useState } from 'react';

export default function PreShopBar({ job, setCurrentlySelected, currentlySelected, setCurrentJob, setRefreshMe }) {
  const [activeStatus, setActiveStatus] = useState(job.status);
  const [activityDropdownVisible, setActivityDropdownVisible] = useState(false); // State for visibility
  
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
    }).then(() => {setRefreshMe(prev => !prev);});
  };

  // This function gets the date difference for days remaining and set class for color of circle
  const getDaysDifference = () => {
    const shipDate = new Date(job.delivery);
    const currentDate = new Date();
    const timeDifference = Math.floor((shipDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60));
    const dayDifference = Math.floor(timeDifference / 24);
  
    if (dayDifference < 0) {
      return { class: 'grey', label: 'x' };
    } else if (dayDifference >= 0 && dayDifference <= 6) {
      return { class: 'red', label: `${dayDifference}d` };
    } else if (dayDifference <= 28) {
      return { class: 'yellow', label: `${Math.floor(dayDifference / 7)}w` };
    } else {
      return { class: 'green', label: `${Math.floor(dayDifference / 30)}m` };
    }
  };
  const { class: circleClass, label } = getDaysDifference();

  return (
    <div className={`preShopBar ${job.uuid === currentlySelected ? 'selected' : 'notSelected'} ${activeStatus === 'inActive' ? 'lightGrey' : activeStatus === 'noCalendar' ? 'grey' : ''}`}>
      <div className='preShopBarActivity'>
        <button className={
          `circle ${
            activeStatus === 'inActive' ? 'grey' 
          : activeStatus === 'active' ? 'blue' 
          : activeStatus === 'noCalendar' ? 'darkGrey' 
          : ''
          }`
        } onClick={handleActivityClick}></button>
      </div>
      <div className='preShopBarName' onClick={handleBarClick}> {job.job_name} </div>
      <div className='preShopBarDate'> 
        <div className={`circle ${circleClass}`}>{label}</div>
      </div>
      <div className={`preShopActivityDropdown ${activityDropdownVisible ? 'visible' : 'invisible'}`}>
        <button className="circle blue selection" onClick={() => handleActivitySelectionClicked("active")}></button>
        <button className="circle grey selection" onClick={() => handleActivitySelectionClicked("inActive")}></button>
        <button className="circle darkGrey selection" onClick={() => handleActivitySelectionClicked("noCalendar")}></button>
      </div>
    </div>
  );
}