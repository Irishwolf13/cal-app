import React, { useState } from 'react';

export default function InShopBar({ job, setCurrentlySelected, currentlySelected, setCurrentJob }) {
  const [activeStatus, setActiveStatus] = useState(job.status);
  const [activityDropdownVisible, setActivityDropdownVisible] = useState(false); // State for visibility
  
  // This is clicked to populate the details panel
  const handleBarClick = () => {
    setCurrentlySelected(job.uuid);
    setCurrentJob(job)
  };

  const handleActivityClick = () => {
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

  // This function gets the date difference
  const getDaysDifference = () => {
    const shipDate = new Date(job.delivery);
    const currentDate = new Date();
    const timeDifference = shipDate.getTime() - currentDate.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) - 1;
  
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
    <div className={`inShopBar ${job.uuid === currentlySelected ? 'selected' : 'notSelected'}`}>
      <div className='inShopBarActivity'>
        <button className={
          `circle ${
              activeStatus === 'inActive' ? 'grey' 
            : activeStatus === 'active' ? 'blue' 
            : activeStatus === 'noCalendar' ? 'darkGrey' 
            : ''
          }`
        } onClick={handleActivityClick}></button>
      </div>
      <div className='inShopBarName' onClick={handleBarClick}> {job.job_name} </div>
      <div className='inShopBarDate'>
        <div className={`circle ${circleClass}`}>{label}</div>
      </div>
      {activityDropdownVisible ? (
        <div className='inShopActivityDropdown visible'>
          <button className="circle blue selection" onClick={() => handleActivitySelectionClicked("active")}></button>
          <button className="circle grey selection" onClick={() => handleActivitySelectionClicked("inActive")}></button>
          <button className="circle darkGrey selection" onClick={() => handleActivitySelectionClicked("noCalendar")}></button>
        </div>
      ) : (
        <div className='inShopActivityDropdown invisible'>
          {/* Invisible class will hide the div */}
          <button className="circle blue selection" onClick={() => handleActivitySelectionClicked("active")}></button>
          <button className="circle grey selection" onClick={() => handleActivitySelectionClicked("inActive")}></button>
          <button className="circle darkGrey selection" onClick={() => handleActivitySelectionClicked("noCalendar")}></button>
        </div>
      )}
      <button className='inShopBarCut'> N </button>
      <button className='inShopBarWeld'> N </button>
      <button className='inShopBarFinish'> N </button>
    </div>
  );
}
