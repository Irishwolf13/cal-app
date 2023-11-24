import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InShopBar({ job, setCurrentlySelected, currentlySelected, setCurrentJob, changeDate,cutWeldFinishOpen }) {
  const [activeStatus, setActiveStatus] = useState(job.status);
  const [activityDropdownVisible, setActivityDropdownVisible] = useState(false); // State for visibility
  const [cutDropDownVisible, setCutDropDownVisible] = useState(false); // State for visibility
  const [weldDropDownVisible, setWeldDropDownVisible] = useState(false); // State for visibility
  const [finishDropDownVisible, setFinishDropDownVisible] = useState(false); // State for visibility
  const [shopStatus, setShopStatus] = useState({ cut: "notStarted", weld: "notStarted", finish: "notStarted" })

  useEffect(() => {
    // HERE, passing in infor, so we can make it so the boxes close if the uuid doesn't match the last box clicked
    console.log(cutWeldFinishOpen)
    console.log(job.uuid)
    setShopStatus({
      cut: job.cut,
      weld: job.weld,
      finish: job.finish
    })
  }, [job]);

    // This allows navigation
    const navigate = useNavigate();
    const handleNavigate = () => {
      changeDate(job.events[0].start_time);
      navigate('/');
    }

  // This is clicked to populate the details panel
  const handleBarClick = () => {
    setCurrentlySelected(job.uuid);
    setCurrentJob(job)
  };

  const handleActivityClick = () => {
    setActivityDropdownVisible(!activityDropdownVisible); // Toggle visibility
  };
  const handleJobStatusClicked = (mySetter, myState) => {
    mySetter(!myState) // Toggle visibility
  }

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

  const cutWeldFinish = (type) => {
    switch (type) {
      case "notStarted":
        return { buttonClass: "red", buttonText: "N" };
      case "production":
        return { buttonClass: "yellow", buttonText: "P" };
      case "finish":
        return { buttonClass: "green", buttonText: "F" };
      default:
        return { buttonClass: "darkBlue", buttonText: "-" };
    }
  }

  const cutWeldFinishStatus = (type, status) => {
    fetch(`/jobs/${job.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ [type]: status })
    }).then(() => {
      // Update the state of shopStatus
      setShopStatus((prevState) => ({
        ...prevState,
        [type]: status
      }));
    });
  }

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

  const renderShopBarCut = (type, shopStatus, setCutDropDownVisible, cutWeldFinishStatus) => {
    const status = cutWeldFinish(shopStatus[type]);
  
    return (
      <div className={`inShopBarCut ${status.buttonClass}`} 
           onMouseEnter={() => setCutDropDownVisible(true)}
           onMouseLeave={() => setCutDropDownVisible(false)}>
        {status.buttonText}
        <div className="inShopBarSelectContainer">
          <div className="inShopBarSelect red" onClick={() => cutWeldFinishStatus(type, 'notStarted')}>N</div>
          <div className="inShopBarSelect yellow" onClick={() => cutWeldFinishStatus(type, 'production')}>P</div>
          <div className="inShopBarSelect green" onClick={() => cutWeldFinishStatus(type, 'finish')}>F</div>
        </div>
      </div>
    );
  };
  const renderActivityCircle = (color, status, handleActivitySelectionClicked, tooltipContent) => {
    return (
      <div 
        className={`circle ${color} selection tooltip2`} 
        onClick={() => handleActivitySelectionClicked(status)}
        data-content={tooltipContent}
      ></div>
    );
  };

  return (
    <div className={`inShopBar ${job.uuid === currentlySelected ? 'selected' : 'notSelected'} ${activeStatus === 'inActive' ? 'lightGrey' : activeStatus === 'noCalendar' ? 'grey' : ''}`}>
      <div className='inShopBarActivity'>
        <button className={
          `circle ${
            activeStatus === 'inActive' ? 'grey'
              : activeStatus === 'active' ? 'blue'
                : activeStatus === 'noCalendar' ? 'darkGrey'
                  : ''
            }`
        }></button>
      </div>
      <div className='inShopActivityDropdown'>
        <div className='flex'>
          {renderActivityCircle("blue", "active", handleActivitySelectionClicked, "Active")}
          {renderActivityCircle("grey", "inActive", handleActivitySelectionClicked, "InActive")}
          {renderActivityCircle("darkGrey", "noCalendar", handleActivitySelectionClicked, "NoCalendar")}
        </div>
      </div>

      <div className='inShopBarName' onClick={handleBarClick}> {job.job_name} </div>
      <div className='inShopBarDate'>
      <div 
          className={`circle tooltip ${circleClass}`} 
          onClick={handleNavigate} 
          data-content={`Start: ${job.events[0].start_time}`}
        >{label}</div>
      </div>
      {renderShopBarCut("cut", shopStatus, setCutDropDownVisible, cutWeldFinishStatus)}
      {renderShopBarCut("weld", shopStatus, setCutDropDownVisible, cutWeldFinishStatus)}
      {renderShopBarCut("finish", shopStatus, setCutDropDownVisible, cutWeldFinishStatus)}
    </div>
  );
}