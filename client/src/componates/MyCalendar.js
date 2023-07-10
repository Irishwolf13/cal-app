import { React, useState, useEffect } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import CreateJobModal from "./CreateJobModal";
import EditJobModal from "./EditJobModal";

const localizer = momentLocalizer(moment) // or globalizeLocalizer
const DnDCalendar = withDragAndDrop(Calendar)

export default function MyCalendar() {
  const [isSelectable, setIsSelectable] = useState(true);
  const [allEvents, setAllEvents] = useState([]);
  const [modalCreateJob, setModalCreateJob] = useState(false);
  const [modalEditJob, setModalEditJob] = useState(false);
  const [eventClickedOn, setEventClickedOn] = useState();
  const [refreshMe, setRefreshMe] = useState(false);

  const fetchData = () => {
    fetch('/events')
      .then(response => response.json())
      .then(data => {
        const tempArray = data.map(event => {
          const tempObject = {
            title: `${event.job.job_name} -- ${event.hours_per_day} / ${event.hours_remaining}`,
            job_id: event.job_id,
            start: event.start_time,
            end: event.end_time,
            color: event.color,
            myID: event.id,
            uuid: event.uuid
          }
          return tempObject
        })
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

  const handleEventClicked = (event) => {
    console.log(event)
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
          console.log('stop that shit yo!')
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
    console.log(event)
    setModalCreateJob(!modalCreateJob)
    setEventClickedOn(event)
  }

  return (
    <div>
      <CreateJobModal
        modalCreateJob={modalCreateJob}
        setModalCreateJob={setModalCreateJob}
        eventClickedOn={eventClickedOn}
        setAllEvents={setAllEvents}
        allEvents={allEvents}
        setRefreshMe={setRefreshMe}
      />
      <EditJobModal 
        modalEditJob={modalEditJob}
        setModalEditJob={setModalEditJob}
      />
      <DnDCalendar
        localizer={localizer}
        events={allEvents}
        startAccessor={(event) => { return new Date(event.start) }}
        endAccessor="end"
        draggableAccessor={(event) => true}
        selectable={isSelectable}
        resizable={false}
        // draggableAccessor={(event) => true} // In my old code, but doesn't seem to work here yet.
        onSelectEvent={handleEventClicked}
        onEventDrop={handleEventDrop}
        onSelectSlot={handleSelectSlot}
        style={{ height: 700, margin: "20px", zIndex: 1 }}
        eventPropGetter={(event) =>
          event.color
            ? {
                style: {
                  background: event.color,
                  color: event.color === 'rgb(172, 236, 253)' || event.color === 'Yellow' || event.color === 'orange' ? 'black' : ''
                }
              }
            : {}
        }
      />
    </div>
  )
}
