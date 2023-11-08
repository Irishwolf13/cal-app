import React, { useState } from 'react';
import blueCircle from '../images/blueCircle.png';
import greyCircle from '../images/greyCircle.png';
import redCircle from '../images/redCircle.png';
import greenCircle from '../images/greenCircle.png';
import yellowCircle from '../images/yellowCircle.png';

export default function PreShopBar({ 
  myID, myName, myShipDate, setCurrentlySelected, currentlySelected 
}) {
  const [activeStatus, setActiveStatus] = useState(false);
  
  // This is clicked to populate the details panel
  const handleBarClick = () => {
    setCurrentlySelected(myID);
  };

  const handleActivityClick = () => {
    setActiveStatus(!activeStatus);
    // This will be a PATCH request for the active status of this job.
  };

  // This function gets the date difference for days remaining and set class for color of circle
  const getDaysDifference = () => {
    const shipDate = new Date(myShipDate);
    const currentDate = new Date();
    const timeDifference = shipDate.getTime() - currentDate.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
    if (dayDifference <= 7) {
      return {
        class: 'red',
        label: `${dayDifference}d`
      };
    } else if (dayDifference <= 28) {
      return {
        class: 'yellow',
        label: `${Math.floor(dayDifference / 7)}w`
      };
    } else {
      return {
        class: 'green',
        label: `${Math.floor(dayDifference / 30)}m`
      };
    }
  };
  
  const { class: circleClass, label } = getDaysDifference();

  return (
    <div className={`preShopBar ${myID === currentlySelected ? 'selected' : 'notSelected'}`} onClick={handleBarClick}>
      <div className='preShopBarActivity' onClick={handleActivityClick}>
        <img className='activityCircle' src={activeStatus ? blueCircle : greyCircle} alt="here" onClick={() => setActiveStatus(!activeStatus)} />
      </div>
      <div className='preShopBarName'> {myName} </div>
      <div className='preShopBarDate'> 
        <div className={`circle ${circleClass}`}>{label}</div>
      </div>
    </div>
  );
}