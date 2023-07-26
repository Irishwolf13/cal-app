import React from 'react'
import { useState, useEffect } from "react";

export default function SideMenu() {
  const [allJobs, setAllJobs] = useState(null);
  const [refreshMe, setRefreshMe] = useState(null);

  useEffect(() => {
    // Fetch PATCH job
    fetch(`/jobs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Data: ',data)
      setAllJobs(data)
    })
  }, [refreshMe]);

  const handleClick = () => {
    setRefreshMe(prev => !prev);
  }

  const frank = (toDisplay) => {
    if (toDisplay) {
      return toDisplay.map(element => {
        return <div className="sideBarInfo" key={element.uuid} style={{ backgroundColor: element.color }}>
          <div>JobName: {element.job_name}</div>
          <div>Job Hours: {element.inital_hours}</div>
          <div>Job Start Date: {element.events[0].start_time}</div>
          <div>Job End Date: {element.events[element.events.length -1].start_time}</div>
          <div>Delivery Date: {element.delivery}</div>
        </div>;
      });
    }
  };
  return (
    <div>
      <button onClick={handleClick}>ReFresh</button>
      {frank(allJobs)}
    </div>
  )
}
