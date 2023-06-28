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
  const handleEventDrop = (object) => {
    const filteredEvents = allEvents.filter(event => event.job_id === object.event.job_id);
    console.log(filteredEvents);
  }
  const handleSelectSlot = (event) => {
    console.log(event)
    setModalCreateJob(!modalCreateJob)
  }

  return (
    <div>
      <CreateJobModal
        modalCreateJob={modalCreateJob}
        setModalCreateJob={setModalCreateJob}
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
        // draggableAccessor={(event) => true} In my old code, but doesn't seem to work here yet.
        onSelectEvent={handleEventClicked}
        onEventDrop={handleEventDrop}
        onSelectSlot={handleSelectSlot}
        style={{ height: 700, margin: "20px", zIndex: 1 }}
      />
    </div>
  )
}
