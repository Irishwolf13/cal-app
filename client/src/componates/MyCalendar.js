import { React, useState, useEffect } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

const localizer = momentLocalizer(moment) // or globalizeLocalizer
const DnDCalendar = withDragAndDrop(Calendar)

export default function MyCalendar() {
  const [isSelectable, setIsSelectable] = useState(true);
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    fetch('/events')
      .then(response => response.json())
      .then(data => {
        const tempArray = data.map(event => {
          console.log(event)
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
        console.log(tempArray)
        setAllEvents(tempArray)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleEventClicked = (event) => {
    console.log(event)
  }
  const handleEventDrop = (event) => {
    console.log(event)
  }
  const handleSelectSlot = (event) => {
    console.log(event)
  }

  return (
    <div>
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
