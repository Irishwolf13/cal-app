import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PreShopBar from './PreShopBar';
import InShopBar from './InShopBar';
import CompletedBar from './CompletedBar';
import DetailPanel from './DetailPanel';
import CreateJobModal from "./CreateJobModal";
import EditJobModalMatrix from './EditJobModalMatrix';

export default function Matrix({ changeDate, currentCalendar, setCurrentCalendar }) {
  const [jobsPreShop, setJobsPreShop] = useState([]);
  const [jobsInShop, setJobsInShop] = useState([]);
  const [jobsComplete, setJobsComplete] = useState([]);
  const [currentJob, setCurrentJob] = useState({});
  const [currentlySelected, setCurrentlySelected] = useState(0);
  const [preShopOption, setPreShopOption] = useState("All");
  const [inShopOption, setInShopOption] = useState("All");
  const [completedOption, setCompletedOption] = useState("Warehouse");
  const [cutWeldFinishOpen, setCutWeldFinishOpen] = useState('1');

  const [allEvents, setAllEvents] = useState([{}]);
  const [modalCreateJob, setModalCreateJob] = useState(false);
  const [modalEditJob, setModalEditJob] = useState(false);
  const [slotClickedOn, setSlotClickedOn] = useState({
    start: new Date(new Date().getTime() - 12 * 60 * 60 * 1000),
    end: new Date(new Date().getTime() - 12 * 60 * 60 * 1000),
  });
  const [refreshMe, setRefreshMe] = useState(false);

  //allow navigation
  const navigate = useNavigate();
  const handleNavigate = () => {
    changeDate(new Date())
    navigate('/');
  }

  useEffect(() => {
    fetchJobs()
  }, [currentJob, refreshMe, preShopOption, inShopOption, completedOption]);

  const fetchJobs = () => {
    // console.log('fetch ran')
    fetch(`/jobs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      const preShopJobs = filterAndSortJobs(data, preShopOption, "preShop", currentCalendar);
      const inShopJobs = filterAndSortJobs(data, inShopOption, "inShop", currentCalendar);
      const completeJobs = filterAndSortJobs(data, completedOption, "complete", currentCalendar);
      
      setJobsPreShop(preShopJobs);
      setJobsInShop(inShopJobs);
      setJobsComplete(completeJobs);
    });
  };

  const mapJobs = (arrayToMap, Component) => {
    return arrayToMap.map(job => (
      <Component  
        key={job.uuid}
        job={job}
        setCurrentlySelected={setCurrentlySelected}
        currentlySelected={currentlySelected}
        setCurrentJob={setCurrentJob}
        setRefreshMe={setRefreshMe}
        changeDate={changeDate}
        cutWeldFinishOpen={cutWeldFinishOpen}
      />
    ));
  }

  const handleUpdateJob = (myKey, myValue) => {
    const updatedJob = { ...currentJob };
    updatedJob[myKey] = myValue;
    setCurrentJob(updatedJob);
  };
  const customCheckMarkUpdate = (id) => {
    const updatedJob = { ...currentJob };
    updatedJob.checks = updatedJob.checks.map((checkbox) => {
      if (checkbox.id === id) {
        checkbox.done = !checkbox.done;
      }
      return checkbox;
    });
    setCurrentJob(updatedJob);
  };
  const createNewJob = () => {
    setModalCreateJob(!modalCreateJob)
  }
  const editJob = () => {
    if (Object.keys(currentJob).length !== 0) {
      // console.log(currentJob);
      setModalEditJob(!modalEditJob);
    } else {
      alert("Please select a Job");
    }
  };

  const filterAndSortJobs = (data, option, quadrant, currentCalendar) => {
    let statuses = [];
    switch (option) {
      case "All":
        statuses = ["active", "noCalendar", "inActive"];
        break;
      case "Scheduled":
        // For "Scheduled", we need to ensure the job has a calendar set to currentCalendar
        statuses = ["active"];
        break;
      case "Active":
        statuses = ["active", "inActive"];
        break;
      case "NoCalendar":
      case "Shipped":
        statuses = ["noCalendar"];
        break;
      case "NoMatrix":
      case "Warehouse":
        statuses = ["noMatrix", "inActive"];
        break;
      default:
        console.error('Invalid option provided:', option);
        return [];
    }
  
    return data.filter(job =>
      statuses.includes(job.status) &&
      job.quadrent === quadrant && // Ensure you use the correct property name for quadrant. It might be a typo for 'quadrant'.
      (option !== "Scheduled" && job.calendar === parseInt(currentCalendar)) // Additional condition for "Scheduled"
    ).sort((a, b) => new Date(a.delivery) - new Date(b.delivery));
  };

  const handleCalendarDropdownChange = (e) => {
    setCurrentCalendar(e.target.value)
    setRefreshMe(prev => !prev)
  }
  return (
    <div>
        <div className="calendar-select">
          <select className='calendar-dropdown' id="calendar-dropdown" value={currentCalendar} onChange={(e) => handleCalendarDropdownChange(e)}>
          <option value="0">Calendar 0</option>
          <option value="1">Calendar 1</option>
          <option value="2">Calendar 2</option>
          <option value="3">Calendar 3</option>
          </select>
        </div>
      <button className="navigationButton"onClick={handleNavigate}>Go to Calendar View</button>
      <CreateJobModal
        modalCreateJob={modalCreateJob}
        setModalCreateJob={setModalCreateJob}
        slotClickedOn={slotClickedOn}
        setAllEvents={setAllEvents}
        allEvents={allEvents}
        setRefreshMe={setRefreshMe}
      />
      <EditJobModalMatrix
        currentJob={currentJob}
        modalEditJob={modalEditJob}
        setModalEditJob={setModalEditJob}
        slotClickedOn={slotClickedOn}
        setRefreshMe={setRefreshMe}
        setCurrentJob={setCurrentJob}
      />
      <div className="mainContainer">
        <div className="matrixContainer">
          {/* PreShop */}
          <div className="preShopContainer">
            <button className='matrixNewJob' onClick={createNewJob}>Create Job</button>
            <button className='matrixEditJob' onClick={editJob}>Edit Job</button>
            <h2 className='preShopMainTitle'> PreShop </h2>
              <div className='preShopTitleBar'>          
              
              <select className='activeDropDown' value={preShopOption} onChange={(e) => setPreShopOption(e.target.value)}>
                <option value="All">All Jobs</option>
                <option value="Scheduled">Scheduled</option>
                <option value="NoCalendar">NoCalendar</option>
                <option value="NoMatrix">NoMatrix</option>
              </select>
              </div>
            <div className='preShopMainInfo'>
              {mapJobs(jobsPreShop, PreShopBar)}
              <div className='matrix-spacer'></div>
            </div>
          </div>
          {/* In Shop */}
          <div className="inShopContainer">
            <h2 className='inShopMainTitle'>In Shop</h2>
            <div className='inShopTitleBar'>
              <div className='titleActivity'>
                  <select className='activeDropDown' value={inShopOption} onChange={(e) => setInShopOption(e.target.value)}>  
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="inActive">inActive</option>
                  </select>
              </div>
              <div className='inShopActivity'></div>
              <div className='inShopTitleName'></div>
              <div className='inShopTitleCut'>Cut</div>
              <div className='inShopTitleWeld'>Weld</div>
              <div className='inShopTitleFinish'>FIN</div>
            </div>
            <div className='inShopMainInfo'>
              {mapJobs(jobsInShop, InShopBar)}
              <div className='matrix-spacer'></div>
            </div>
          </div>
          {/* Expandable */}
          <div className="expandableContainer">
            <h2 className='expandable'>Expandable</h2>
          </div>
          {/* Completed */}
          <div className="completedContainer">
            <h2 className='CompletedMainTitle'>Completed</h2>
            <div className='inShopTitleBar'>
              <div className='titleActivity'>
                  <select className='activeDropDown' value={completedOption} onChange={(e) => setCompletedOption(e.target.value)}>  
                    <option value="All">All</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Shipped">Archived</option>
                  </select>
              </div>
              <div className='inShopActivity'></div>
              <div className='inShopTitleName'></div>
              <div className='inShopTitleDate'>Ship Date</div>
            </div>
            <div className='completedMainInfo'>
              {mapJobs(jobsComplete, CompletedBar)}
              <div className='matrix-spacer'></div>
            </div>
          </div>
        </div>
        <DetailPanel 
          currentJob={currentJob}
          setCurrentJob={setCurrentJob}
          fetchJobs={fetchJobs}
          handleUpdateJob={handleUpdateJob} 
          customCheckMarkUpdate={customCheckMarkUpdate}
        />
      </div>
    </div>
  )
}