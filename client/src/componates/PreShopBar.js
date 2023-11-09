import React, { useState } from 'react';

export default function PreShopBar({ 
  myID, myName, myShipDate, setCurrentlySelected, currentlySelected, myStatus
}) {
  const [activeStatus, setActiveStatus] = useState(myStatus);
  const [activityDropdownVisible, setActivityDropdownVisible] = useState(false); // State for visibility
  
  
  // This is clicked to populate the details panel
  const handleBarClick = () => {
    setCurrentlySelected(myID);
  };

  const handleActivityClick = (color) => {
    // This will be a PATCH request for the active status of this job.
    setActivityDropdownVisible(!activityDropdownVisible); // Toggle visibility
  };
  const handleActivitySelectionClicked = (color) => {
    console.log(color)
    setActiveStatus(color)
    setActivityDropdownVisible(!activityDropdownVisible); // Toggle visibility
  }

  // This function gets the date difference for days remaining and set class for color of circle
  const getDaysDifference = () => {
    const shipDate = new Date(myShipDate);
    const currentDate = new Date();
    const timeDifference = shipDate.getTime() - currentDate.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) - 1;
  
    if (dayDifference < 0) {
      return { class: 'grey', label: 'x' };
    } else if (dayDifference >= 0 && dayDifference <= 7) {
      return { class: 'red', label: `${dayDifference}d` };
    } else if (dayDifference <= 28) {
      return { class: 'yellow', label: `${Math.floor(dayDifference / 7)}w` };
    } else {
      return { class: 'green', label: `${Math.floor(dayDifference / 30)}m` };
    }
  };
  const { class: circleClass, label } = getDaysDifference();
  

  return (
    <div className={`preShopBar ${myID === currentlySelected ? 'selected' : 'notSelected'}`}>
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
      <div className='preShopBarName' onClick={handleBarClick}> {myName} </div>
      <div className='preShopBarDate'> 
        <div className={`circle ${circleClass}`}>{label}</div>
      </div>
      {activityDropdownVisible ? (
        <div className='preShopActivityDropdown visible'>
          <button className="circle blue selection" onClick={() => handleActivitySelectionClicked("active")}></button>
          <button className="circle grey selection" onClick={() => handleActivitySelectionClicked("inActive")}></button>
          <button className="circle darkGrey selection" onClick={() => handleActivitySelectionClicked("noCalendar")}></button>
        </div>
      ) : (
        <div className='preShopActivityDropdown invisible'>
          {/* Invisible class will hide the div */}
          <button className="circle blue selection" onClick={() => handleActivitySelectionClicked("active")}></button>
          <button className="circle grey selection" onClick={() => handleActivitySelectionClicked("inActive")}></button>
          <button className="circle darkGrey selection" onClick={() => handleActivitySelectionClicked("noCalendar")}></button>
        </div>
      )}
    </div>
  );
}