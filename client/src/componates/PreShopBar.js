import React, { useState } from 'react';
import blueCircle from '../images/blueCircle.png';
import greyCircle from '../images/greyCircle.png';

export default function PreShopBar({ 
  myID, myName, myDate, setCurrentlySelected, currentlySelected 
}) {
  const [activeStatus, setActiveStatus] = useState(false);
  
  const handleBarClick = () => {
    setCurrentlySelected(myID);
  };
  const handleActivityClick = () => {
    setActiveStatus(!activeStatus);
    // This will be a PATCH request for the active status of this job.
  };

  return (
    <div className={`preShopBar ${myID === currentlySelected ? 'selected' : 'notSelected'}`} onClick={handleBarClick}>
      <div className='preShopBarActivity' onClick={handleActivityClick}>
      <img className='activityCircle' src={activeStatus ? blueCircle : greyCircle} alt="here" onClick={() => setActiveStatus(!activeStatus)} />
      </div>
      <div className='preShopBarName'> {myName} </div>
      <div className='preShopBarDate'> {myDate} </div>
    </div>
  );
}
