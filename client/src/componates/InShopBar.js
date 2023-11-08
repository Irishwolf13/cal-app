import React, { useState } from 'react';
import blueCircle from '../images/blueCircle.png';
import greyCircle from '../images/greyCircle.png';

export default function InShopBar({ 
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
    <div className={`inShopBar ${myID === currentlySelected ? 'selected' : 'notSelected'}`} onClick={handleBarClick}>
      <div className='inShopBarActivity' onClick={handleActivityClick}>
      <img className='activityCircle' src={activeStatus ? blueCircle : greyCircle} alt="here" onClick={() => setActiveStatus(!activeStatus)} />
      </div>
      <div className='inShopBarName'> {myName} </div>
      <div className='inShopBarDate'> {myDate} </div>
      <button className='inShopBarCut'> N </button>
      <button className='inShopBarWeld'> N </button>
      <button className='inShopBarFinish'> N </button>
    </div>
  );
}
