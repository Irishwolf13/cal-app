import React, { useState, useEffect } from 'react';

export default function InShopBar({ job, setCurrentlySelected, currentlySelected, setCurrentJob }) {
  const [activeStatus, setActiveStatus] = useState(job.status);
  const [activityDropdownVisible, setActivityDropdownVisible] = useState(false); // State for visibility
  const [cutDropDownVisible, setCutDropDownVisible] = useState(false); // State for visibility
  const [weldDropDownVisible, setWeldDropDownVisible] = useState(false); // State for visibility
  const [finishDropDownVisible, setFinishDropDownVisible] = useState(false); // State for visibility
  const [shopStatus, setShopStatus] = useState({ cut: "notStarted", weld: "notStarted", finish: "notStarted" })

  useEffect(() => {
    setShopStatus({
      cut: job.cut,
      weld: job.weld,
      finish: job.finish
    })
  }, [job]);

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
        return { buttonClass: "darkBlue", buttonText: "N" };
      case "production":
        return { buttonClass: "green", buttonText: "P" };
      case "finish":
        return { buttonClass: "darkGrey", buttonText: "F" };
      default:
        return { buttonClass: "darkBlue", buttonText: "N" };
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
      <div className={`inShopActivityDropdown ${activityDropdownVisible ? 'visible' : 'invisible'}`}>
        <button className="circle blue selection" onClick={() => handleActivitySelectionClicked("active")}></button>
        <button className="circle grey selection" onClick={() => handleActivitySelectionClicked("inActive")}></button>
        <button className="circle darkGrey selection" onClick={() => handleActivitySelectionClicked("noCalendar")}></button>
      </div>

      {/* These could be made into componates later if we wanted to add more items to the list. */}
      <div className={`inShopBarCut ${cutWeldFinish(shopStatus.cut).buttonClass}`} onClick={() => handleJobStatusClicked(setCutDropDownVisible, cutDropDownVisible)}>
        {cutWeldFinish(shopStatus.cut).buttonText}
        <div className={`inShopBarSelectContainer ${cutDropDownVisible ? 'visible' : 'invisible'}`}>
          <div className="inShopBarSelect darkBlue" onClick={() => cutWeldFinishStatus("cut", 'notStarted')}>N</div>
          <div className="inShopBarSelect green" onClick={() => cutWeldFinishStatus("cut", 'production')}>P</div>
          <div className="inShopBarSelect darkGrey" onClick={() => cutWeldFinishStatus("cut", 'finish')}>F</div>
        </div>
      </div>

      <div className={`inShopBarWeld ${cutWeldFinish(shopStatus.weld).buttonClass} `} onClick={() => handleJobStatusClicked(setWeldDropDownVisible, weldDropDownVisible)}>
        {cutWeldFinish(shopStatus.weld).buttonText}
        <div className={`inShopBarSelectContainer ${weldDropDownVisible ? 'visible' : 'invisible'}`}>
          <div className="inShopBarSelect darkBlue" onClick={() => cutWeldFinishStatus("weld", 'notStarted')}>N</div>
          <div className="inShopBarSelect green" onClick={() => cutWeldFinishStatus("weld", 'production')}>P</div>
          <div className="inShopBarSelect darkGrey" onClick={() => cutWeldFinishStatus("weld", 'finish')}>F</div>
        </div>
      </div>

      <div className={`inShopBarFinish ${cutWeldFinish(shopStatus.finish).buttonClass}`} onClick={() => handleJobStatusClicked(setFinishDropDownVisible, finishDropDownVisible)}>
        {cutWeldFinish(shopStatus.finish).buttonText}
        <div className={`inShopBarSelectContainer ${finishDropDownVisible ? 'visible' : 'invisible'}`}>
          <div className="inShopBarSelect darkBlue" onClick={() => cutWeldFinishStatus("finish", 'notStarted')}>N</div>
          <div className="inShopBarSelect green" onClick={() => cutWeldFinishStatus("finish", 'production')}>P</div>
          <div className="inShopBarSelect darkGrey" onClick={() => cutWeldFinishStatus("finish", 'finish')}>F</div>
        </div>
      </div>

    </div>
  );
}