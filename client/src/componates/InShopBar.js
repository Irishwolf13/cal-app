import React, { useState } from 'react';

export default function InShopBar({ job, setCurrentlySelected, currentlySelected, setCurrentJob }) {
  const [activeStatus, setActiveStatus] = useState(false);

  const handleBarClick = () => {
    setCurrentlySelected(job.uuid);
    setCurrentJob(job)
  };

  const handleActivityClick = () => {
    setActiveStatus(!activeStatus);
    // This will be a PATCH request for the active status of this job.
  };

  // This function gets the date difference
  const getDaysDifference = () => {
    const shipDate = new Date(job.delivery);
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
    <div className={`inShopBar ${job.uuid === currentlySelected ? 'selected' : 'notSelected'}`} onClick={handleBarClick}>
      <div className='inShopBarActivity' onClick={handleActivityClick}>
        <button className={
          `circle ${
              job.status === 'inActive' ? 'grey' 
            : job.status === 'active' ? 'blue' 
            : job.status === 'noCalendar' ? 'darkGrey' 
            : ''
          }`
        }></button>
      </div>
      <div className='inShopBarName'> {job.job_name} </div>
      <div className='inShopBarDate'>
        <div className={`circle ${circleClass}`}>{label}</div>
      </div>
      <button className='inShopBarCut'> N </button>
      <button className='inShopBarWeld'> N </button>
      <button className='inShopBarFinish'> N </button>
    </div>
  );
}
