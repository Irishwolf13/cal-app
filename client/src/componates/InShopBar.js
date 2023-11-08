import React, { useState } from 'react';

export default function InShopBar({ 
  myID, myName, myShipDate, setCurrentlySelected, currentlySelected, myStatus 
}) {
  const [activeStatus, setActiveStatus] = useState(false);

  const handleBarClick = () => {
    setCurrentlySelected(myID);
  };

  const handleActivityClick = () => {
    setActiveStatus(!activeStatus);
    // This will be a PATCH request for the active status of this job.
  };

  // This function gets the date difference
  const getDaysDifference = () => {
    const shipDate = new Date(myShipDate);
    const currentDate = new Date();
    const timeDifference = shipDate.getTime() - currentDate.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
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
    <div className={`inShopBar ${myID === currentlySelected ? 'selected' : 'notSelected'}`} onClick={handleBarClick}>
      <div className='inShopBarActivity' onClick={handleActivityClick}>
        <button className={
          `circle ${
              myStatus === 'inActive' ? 'grey' 
            : myStatus === 'active' ? 'blue' 
            : myStatus === 'noCalendar' ? 'darkGrey' 
            : ''
          }`
        }></button>
      </div>
      <div className='inShopBarName'> {myName} </div>
      <div className='inShopBarDate'>
        <div className={`circle ${circleClass}`}>{label}</div>
      </div>
      <button className='inShopBarCut'> N </button>
      <button className='inShopBarWeld'> N </button>
      <button className='inShopBarFinish'> N </button>
    </div>
  );
}
