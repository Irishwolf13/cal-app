import React, { useState, useEffect } from 'react';
import SideMenuItem from "./SideMenuItem";

export default function SideMenu({ isMenuOpen, refreshMe, setRefreshMe, viewDates }) {
  const [allJobs, setAllJobs] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {
    // Fetch PATCH job
    fetch(`/jobs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log('Data: ', data);
        let sortedData = sortDataByDeliveryDate(data);
        setAllJobs(sortedData);
        setSelectedDates(Array(sortedData.length).fill(null));
      });
  }, [refreshMe]);

  const sortDataByDeliveryDate = (data) => {
    data.sort((a, b) => {
      // Extracting start_time from events array of each object
      const deliveryDateA = a.delivery;
      const deliveryDateB = b.delivery;

      if (deliveryDateA < deliveryDateB) {
        return -1;
      }
      if (deliveryDateA > deliveryDateB) {
        return 1;
      }
      return 0;
    });
    return data;
  };

  const handleDatePicker = (date, index) => {
    const newSelectedDates = [...selectedDates];
    if (date !== null) {
      newSelectedDates[index] = date;
      setSelectedDates(newSelectedDates);
      handlePatchJob(allJobs[index].id, date);
    } else {
      newSelectedDates[index] = null;
      setSelectedDates(newSelectedDates);
    }
  };
  const displayContent = (event) => {
    const deliveryDate = new Date(event.delivery);
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    return `${formattedDeliveryDate}`;
  };

  const handlePatchJob = (id, selectedDate) => {
    // console.log("Selected Date:",selectedDate);
    fetch(`/jobs/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newDelivery: selectedDate,
      })
    })
    .then(setRefreshMe((prev) => !prev))
  };

  const renderElements = (toDisplay) => {
    if (toDisplay) {
      return toDisplay.map((element, index) => {
        // console.log(viewDates)
        return (
          <div className="sideBarInfo" key={element.uuid} style={{ background: `linear-gradient(to right, white 90%, ${element.color} 100%)` }}>
            <SideMenuItem 
              element={element}
              index={index}
              displayContent={displayContent}
              selectedDates={selectedDates}
              handleDatePicker={handleDatePicker}
            />
          </div>
        );
      });
    }
  };

  return (
    <div>
      {renderElements(allJobs)}
    </div>
  );
}
