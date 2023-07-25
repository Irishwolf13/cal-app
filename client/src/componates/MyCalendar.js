import { React, useState, useEffect } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import CreateJobModal from "./CreateJobModal";
import EditJobModal from "./EditJobModal";
import BasicModal from "./BasicModal"

const localizer = momentLocalizer(moment) // or globalizeLocalizer
const DnDCalendar = withDragAndDrop(Calendar)

export default function MyCalendar() {
  const [isSelectable, setIsSelectable] = useState(true);
  const [allEvents, setAllEvents] = useState([]);
  const [modalCreateJob, setModalCreateJob] = useState(false);
  const [modalEditJob, setModalEditJob] = useState(false);
  const [modalCompanyHours, setModalCompanyHours] = useState(false);
  const [slotClickedOn, setslotClickedOn] = useState();
  const [eventClickedOn, setEventClickedOn] = useState();
  const [refreshMe, setRefreshMe] = useState(false);
  const [calSize, setCalSize] = useState(900);
  const [newComapnyHours, setNewCompanyHours] = useState()

  const fetchData = () => {
    fetch('/events')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const tempArray = data.map(event => {
          const tempObject = {
            title: `${event.job.job_name} -- ${event.hours_remaining} / ${event.hours_per_day}`,
            job_id: event.job_id,
            start: event.start_time,
            end: event.end_time,
            color: event.color,
            myID: event.id,
            perDay: event.hours_per_day,
            delivery: event.job.delivery,
            uuid: event.uuid
          }
          return tempObject
        })
        sortJobAndStart(tempArray)
        setAllEvents(tempArray)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchData();
    // const interval = setInterval(fetchData, 5000); // Run fetchData every 5 seconds
    // return () => clearInterval(interval);
  }, [refreshMe]);

  // Had to add this in to avoid some errors with slot section.
  useEffect(() => {
    setIsSelectable(!modalEditJob);
  }, [modalEditJob]);

  useEffect(() => {
    fetch(`/daily_maximums/1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setNewCompanyHours(data.daily_max)
    })
  }, [])

  const handleEventClicked = (event) => {
    // console.log(event)
    setIsSelectable(!isSelectable)
    setEventClickedOn(event)
    setModalEditJob(!modalEditJob)
  }

  const handleEventDrop = (object) => {
    // Check to make sure the date you moved to isn't the date you came from
    let dropDate = new Date(object.event.start)
    dropDate.setDate(dropDate.getDate() + 1)
    if (object.start.getDate() == dropDate.getDate()) {
      return
    }
    const filteredEvents = allEvents.filter(event => event.job_id === object.event.job_id)
    for (let index = 0; index < filteredEvents.length; index++) {
      const element = filteredEvents[index];
      if (element.uuid === object.event.uuid) {
        if (index === 0) {
          break
        }
        let prevDate = new Date(filteredEvents[index -1].start)
        prevDate.setDate(prevDate.getDate() +1)
        if (object.start <= prevDate) {
          // console.log('stop that shit yo!')
          return
        }
      }
    }

    // FETCH: UPDATE JOBS
    fetch(`/jobs/move/${object.event.job_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        newDate: object.start,
        myID: object.event.myID
      })
    })
    .then(response => response.json())
    .then(data => {
      const myJobNumber = data.id;
      const updatedEvents = [...allEvents];
      const unFilteredEvents = updatedEvents.filter(event => event.job_id !== myJobNumber);
      const filteredEvents = updatedEvents.filter(event => event.job_id === myJobNumber);

      data.events.forEach((event, index) => {
        // Check if the index is within the range of filteredEvents array
        if (index < filteredEvents.length) {
          // Replace start time of filteredEvents at the same index with event.start_time
          filteredEvents[index].start = event.start_time;
          filteredEvents[index].end = event.start_time;
        }
      });
      const adjustedEvents = [...filteredEvents, ...unFilteredEvents];
      sortJobAndStart(adjustedEvents);
      setAllEvents(adjustedEvents)
    });
    // Use response to update allEvents
  }
  const sortJobAndStart = (object) => {
    // console.log(object)
    object.sort((a, b) => {
      // First, compare the job_id
      if (a.job_id < b.job_id) {
        return -1;
      }
      if (a.job_id > b.job_id) {
        return 1;
      }
      // If job_id is the same, compare the start
      if (a.start < b.start) {
        return -1;
      }
      if (a.start > b.start) {
        return 1;
      }
      return 0; // If both job_id and start are equal
    });
  }

  const handleSelectSlot = (event) => {
    setModalCreateJob(!modalCreateJob)
    setslotClickedOn(event)
  }

  const checkIfOverHours = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
  
    // if (day === 14) {
      let tempHours = 0
      allEvents.forEach(event => {
        let myDate = new Date(event.start)
        if (day === myDate.getDate() + 1 && month === myDate.getMonth()) {
          tempHours += event.perDay
        }
      })
      if (tempHours > newComapnyHours) {
        return { className: 'overWarning' };
      }
    // }
    return null;
  };

  const handleCompanyButton = () => {
    setModalCompanyHours(prev => !prev)
  }

  const tooltipContent = (event) => {
    const deliveryDate = new Date(event.delivery);
    const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    return `Delivery Date: ${formattedDeliveryDate}`;
  };

  return (
    <div>
      <button className="basicButton" onClick={handleCompanyButton}>Daily Max</button>
      <BasicModal
        modalCompanyHours = {modalCompanyHours}
        handleCompanyButton = {handleCompanyButton}
        newComapnyHours={newComapnyHours}
        setNewCompanyHours={setNewCompanyHours}
      />
      <CreateJobModal
        modalCreateJob={modalCreateJob}
        setModalCreateJob={setModalCreateJob}
        slotClickedOn={slotClickedOn}
        setAllEvents={setAllEvents}
        allEvents={allEvents}
        setRefreshMe={setRefreshMe}
      />
      <EditJobModal
        eventClickedOn={eventClickedOn}
        modalEditJob={modalEditJob}
        setModalEditJob={setModalEditJob}
        setRefreshMe={setRefreshMe}
        allEvents={allEvents}
        // setIsSelectable={setIsSelectable}
        // isSelectable={isSelectable}
      />
      <DnDCalendar
        localizer={localizer}
        events={allEvents}
        views={['month', 'agenda']}
        startAccessor="start"
        endAccessor="end"
        draggableAccessor={(event) => true}
        selectable={isSelectable}
        resizable={false}
        onSelectEvent={handleEventClicked}
        onEventDrop={handleEventDrop}
        onSelectSlot={handleSelectSlot}
        popup
        style={{ height: calSize, margin: "20px", zIndex: 1 }}
        dayPropGetter={checkIfOverHours}
        tooltipAccessor={tooltipContent}
        eventPropGetter={(event) => {
          let style = {
            background: event.color,
            color:
              event.color === 'rgb(172, 236, 253)' ||
              event.color === 'rgb(255, 255, 0)' ||
              event.color === 'rgba(255, 166, 0, 0.623)' ||
              event.color === 'rgb(255, 63, 172)'
                ? 'black'
                : '',
          };
          
          let startIndex = event.title.indexOf("--") + 2;
          let endIndex = event.title.indexOf("/");
          let totalHoursInJob = event.title.substring(startIndex, endIndex).trim();
          
          if (parseInt(totalHoursInJob) - event.perDay < 0) {
            style.boxShadow = 'inset 0 0 0 3px red';
          } else {
            style.boxShadow = 'inset 0 0 0 1px black';
          }
          return { style };
        }}
      />
    </div>
  )
}
