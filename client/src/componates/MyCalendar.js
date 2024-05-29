import { React, useState, useEffect } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import CreateJobModal from "./CreateJobModal";
import EditJobModal from "./EditJobModal";
import BasicModal from "./BasicModal";
import NameChangeModal from "./NameChangeModal";
import { useNavigate } from 'react-router-dom';
// import SideBar from "./SideBar";

const localizer = momentLocalizer(moment) // or globalizeLocalizer
const DnDCalendar = withDragAndDrop(Calendar)

export default function MyCalendar({myDate, currentCalendar, setCurrentCalendar, calendarNames, setCalendarNames}) {
  const [isSelectable, setIsSelectable] = useState(true);
  const [allEvents, setAllEvents] = useState([]);
  const [modalCreateJob, setModalCreateJob] = useState(false);
  const [modalEditJob, setModalEditJob] = useState(false);
  const [modalCompanyHours, setModalCompanyHours] = useState(false);
  const [modalNameChange, setModalNameChange] = useState(false);
  const [slotClickedOn, setslotClickedOn] = useState();
  const [eventClickedOn, setEventClickedOn] = useState();
  const [refreshMe, setRefreshMe] = useState(false);
  const [calSize, setCalSize] = useState(900);
  const [newCompanyHours, setNewCompanyHours] = useState()
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selections, setSelections] = useState([true, true, true, true]);

  //allow navigation
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/matrix');
  }

  useEffect(() => {
    if (currentCalendar !== `all`) {
      const updatedFilteredEvents = allEvents.filter(event => event.calendar === parseInt(currentCalendar));
      setFilteredEvents(updatedFilteredEvents);
    } else {
      const selectedIndexes = selections.reduce((indexes, isSelected, index) => {
        if (isSelected) {
          indexes.push(index);
        }
        return indexes;
      }, []);
  
      const updatedFilteredEvents = allEvents.filter(event => selectedIndexes.includes(event.calendar));
      setFilteredEvents(updatedFilteredEvents);
    }
  }, [allEvents, currentCalendar, selections]);

  const fetchData = () => {
    fetch('/events')
      .then(response => response.json())
      .then(data => {
        const filteredData = data.filter(event => event.job.status !== 'noCalendar');  
        const tempArray = filteredData.map(event => {
          const tempObject = {
            title: `${event.job.job_name} -- ${event.hours_remaining} / ${event.hours_per_day}`,
            job_id: event.job_id,
            start: event.start_time,
            end: event.end_time,
            color: event.job.status === 'inActive' ? 'grey' : event.color,
            myID: event.id,
            perDay: event.hours_per_day,
            delivery: event.job.delivery,
            uuid: event.uuid,
            calendar: event.job.calendar,
            status: event.job.status
          };
          return tempObject;
        });
        // console.log(tempArray);
        sortJobAndStart(tempArray);
        setAllEvents(tempArray);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchData();
    // I took this out because it was causing a lot of delay for all the constant fetching.
    // const interval = setInterval(fetchData, 5000); // Run fetchData every 5 seconds
    // return () => clearInterval(interval);
  }, [refreshMe]);

  // Had to add this in to avoid some errors with slot section.
  useEffect(() => {
    setIsSelectable(!modalEditJob);
  }, [modalEditJob]);

  // This use effect is to set up inital state of the calendar.
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
    // This use effect is to set up inital state of the calendar.
    useEffect(() => {
      fetch(`/calendar_names/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        const sortedData = data.sort((a, b) => a.number - b.number);
        // console.log(sortedData);
        // Extract the name values from the objects
        const namesArray = sortedData.map(item => item.name);
        setCalendarNames(namesArray);
      });
    }, []);

  const updateCalendarNames = (newName, indexToUpdate) => {
    setCalendarNames(prevNames =>
      prevNames.map((name, index) => (index === indexToUpdate ? newName : name))
    );
  };

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
    // console.log(event)
    setslotClickedOn(event)
  }
// READ THROUGH THIS CODE AT SOME POINT AND UNDERSTAND WHAT IS HAPPENING
const checkIfOverHours = (date) => {
  const day = date.getUTCDate();
  const month = date.getUTCMonth();

  let tempHours = 0;
  filteredEvents.forEach(event => {
    if (event.status !== 'inActive') { // Check if event is not "inActive"
      let myDate = new Date(event.start);
      let eventDay = myDate.getUTCDate();
      let eventMonth = myDate.getUTCMonth();

      // Check if the current date is the last day of the month
      if (day === getLastDayOfMonth(month) && month === eventMonth && eventDay === getLastDayOfMonth(eventMonth)) {
        tempHours += event.perDay;
      }
      // Check if the current date is not the last day of the month and NOT the day before the last day of the month
      else if (day === eventDay && month === eventMonth && day !== getLastDayOfMonth(month) - 1) {
        tempHours += event.perDay;
      }
    }
  });

  if (tempHours > newCompanyHours) {
    return { className: 'overWarning' };
  }

  return null;
};
  // Helper function to get the last day of a specific month
  const getLastDayOfMonth = (month) => {
    const nextMonth = new Date(new Date().getUTCFullYear(), month + 1, 1);
    const lastDay = new Date(nextMonth - 1).getUTCDate();
    return lastDay;
  };
// END READ THROUGH THIS CODE AT SOME POINT AND UNDERSTAND WHAT IS HAPPENING

  const handleCompanyButton = () => {
    setModalCompanyHours(prev => !prev)
  }
  const handleNameChangeButton = () => {
    if (currentCalendar !== 'all') {
      setModalNameChange(prev => !prev)
    } else {
      alert("You can't change the all calendar name. Sorry.")
    }
  }

  const tooltipContent = (event) => {
    const deliveryDate = new Date(event.delivery);
    const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    return `${event.title}\nDelivery Date: ${formattedDeliveryDate}`;
  };

  const handleCalendarDropdownChange = (e) => {
    setCurrentCalendar(e.target.value)
  }

  const handleCheckboxChange = (index) => {
    const newSelections = [...selections];
    newSelections[index] = !newSelections[index];
    setSelections(newSelections);
    // console.log(selections)
  };

  return (
    <div>
      <div className="calendar-select">
      <select className='calendar-dropdown' id="calendar-dropdown" value={currentCalendar} onChange={(e) => handleCalendarDropdownChange(e)}>
        {calendarNames.map((name, index) => (
          <option key={index} value={index}>{name}</option>
        ))}
        <option value="all">All Calendars</option>
      </select>
      </div>
      <button className="dailyMaxButton" onClick={handleCompanyButton}>Daily Max</button>
      <button className="calendar-changeName" onClick={handleNameChangeButton}>Change Cal Name</button>
      <button className="navigationButton"onClick={handleNavigate}>Go to Matrix View</button>
      
      {calendarNames.map((name, index) => (
        <label key={index}>
          <input
            type="checkbox"
            checked={selections[index]}
            onChange={() => handleCheckboxChange(index)}
          />
          {name}
        </label>
      ))}
      
      <BasicModal
        modalCompanyHours = {modalCompanyHours}
        handleCompanyButton = {handleCompanyButton}
        newCompanyHours={newCompanyHours}
        setNewCompanyHours={setNewCompanyHours}
      />
      <NameChangeModal
        modalNameChange = {modalNameChange}
        handleNameChangeButton = {handleNameChangeButton}
        currentCalendar={currentCalendar}
        setCurrentCalendar={setCurrentCalendar}
        calendarNames={calendarNames}
        updateCalendarNames={updateCalendarNames}
      />
      <CreateJobModal
        modalCreateJob={modalCreateJob}
        setModalCreateJob={setModalCreateJob}
        slotClickedOn={slotClickedOn}
        setAllEvents={setAllEvents}
        allEvents={allEvents}
        setRefreshMe={setRefreshMe}
        currentCalendar={currentCalendar}
        calendarNames={calendarNames}
      />
      <EditJobModal
        eventClickedOn={eventClickedOn}
        modalEditJob={modalEditJob}
        setModalEditJob={setModalEditJob}
        setRefreshMe={setRefreshMe}
        allEvents={allEvents}
        calendarNames={calendarNames}
        // setIsSelectable={setIsSelectable}
        // isSelectable={isSelectable}
      />
      <div className="mainContentHolder">
        {/* <SideBar /> */}
        <DnDCalendar
          className="DnDCalendar"
          localizer={localizer}
          events={filteredEvents}
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
          defaultDate={myDate}
          eventPropGetter={(event) => {
            let style = {
              background: event.color,
              color:
                event.color === 'rgb(172, 236, 253)' ||
                event.color === 'rgb(171, 255, 171)' ||
                event.color === 'rgb(255, 166, 0)' ||
                event.color === 'rgb(253, 163, 214)' ||
                event.color === 'rgb(255, 189, 96)' ||
                event.color === 'rgb(255, 255, 0)' ||
                event.color === 'rgb(255, 63, 172)' ||
                event.color === 'rgb(255, 149, 0)' ||
                event.color === 'rgb(255, 60, 60)' ||
                event.color === 'rgb(255, 255, 193)'
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
    </div>
  )
}
