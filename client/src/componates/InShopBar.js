import React, { useState } from 'react';
import blueCircle from '../images/blueCircle.png';
import greyCircle from '../images/greyCircle.png';

export default function InShopBar({ 
  myID, myName, myShipDate, setCurrentlySelected, currentlySelected 
}) {
  const [activeStatus, setActiveStatus] = useState(false);

  const handleBarClick = () => {
    setCurrentlySelected(myID);
  };

  const handleActivityClick = () => {
    setActiveStatus(!activeStatus);
    // This will be a PATCH request for the active status of this job.
  };

  // This function gets the date difference for days remaining
  const getDaysDifference = () => {
    const shipDate = new Date(myShipDate);
    const currentDate = new Date();
    const timeDifference = shipDate.getTime() - currentDate.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
    if (dayDifference <= 7) {
      return `${dayDifference}d`;
    } else if (dayDifference <= 28) {
      const weekDifference = Math.floor(dayDifference / 7);
      return `${weekDifference}w`;
    } else {
      const monthDifference = Math.floor(dayDifference / 30);
      return `${monthDifference}m`;
    }
  };

  return (
    <div className={`inShopBar ${myID === currentlySelected ? 'selected' : 'notSelected'}`} onClick={handleBarClick}>
      <div className='inShopBarActivity' onClick={handleActivityClick}>
        <img className='activityCircle' src={activeStatus ? blueCircle : greyCircle} alt="here" onClick={() => setActiveStatus(!activeStatus)} />
      </div>
      <div className='inShopBarName'> {myName} </div>
      <div className='inShopBarDate'> {getDaysDifference()}</div>
      <button className='inShopBarCut'> N </button>
      <button className='inShopBarWeld'> N </button>
      <button className='inShopBarFinish'> N </button>
    </div>
  );
}