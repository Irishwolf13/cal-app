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

  useEffect(() => {
    fetch('/events')
      .then(response => response.json())
      .then(data => {
        const tempArray = data.map(event => {
          // console.log(event)
          const tempObject = {
            title: `${event.job.job_name} -- ${event.hours_per_day} / ${event.hours_remaining}`,
            job_id: event.job_id,
            start: event.start_time,
            end: event.end_time,
            color: event.color,
            myID: event.id
          }
          return tempObject
        })
        // console.log(tempArray)
        setAllEvents(tempArray)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleEventClicked = (event) => {
    console.log(event)
    setModalEditJob(!modalEditJob)
  }
// ********** YOU ARE HERE AND YOU"RE LOOKING TO ADJUST OPTIMISTICALLY *************
  const handleEventDrop = (object) => {
    const filteredEvents = allEvents.filter(event => event.job_id === object.event.job_id);
    console.log(filteredEvents);
    console.log("object.event: ",object.event)
    console.log("object: ",object)
    // Check to see if the dropped event.start is after the lower IDs start dates, because all events have to stay in order
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
    // .then(data => {
    //   const myJobNumber = data.id;
    //   const updatedEvents = [...allEvents];
    //   const unFilteredEvents = updatedEvents.filter(event => event.job_id !== myJobNumber);
    //   const filteredEvents = updatedEvents.filter(event => event.job_id === myJobNumber);
      
    //   data.events.forEach((event, index) => {
    //     // Check if the index is within the range of filteredEvents array
    //     if (index < filteredEvents.length) {
    //       // Replace start time of filteredEvents at the same index with event.start_time
    //       filteredEvents[index].start = event.start_time;
    //       filteredEvents[index].end = event.start_time;
    //     }
    //   });
    //   const adjustedEvents = [...unFilteredEvents, ...filteredEvents];
    //   setAllEvents(adjustedEvents)
    // });
    // // Use response to update allEvents
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
      />
      <EditJobModal 
        modalEditJob={modalEditJob}
        setModalEditJob={setModalEditJob}
      />
      <DnDCalendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
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
