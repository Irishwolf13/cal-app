import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PreShopBar from './PreShopBar';
import InShopBar from './InShopBar';
import CompletedBar from './CompletedBar';
import DetailPanel from './DetailPanel';
import CreateJobModal from "./CreateJobModal";

export default function Matrix({ changeDate }) {
  const [jobsPreShop, setJobsPreShop] = useState([]);
  const [jobsInShop, setJobsInShop] = useState([]);
  const [jobsComplete, setJobsComplete] = useState([]);
  const [currentJob, setCurrentJob] = useState({});
  const [currentlySelected, setCurrentlySelected] = useState(0);
  const [preShopOption, setPreShopOption] = useState("All");
  const [inShopOption, setInShopOption] = useState("All");
  const [completedOption, setCompletedOption] = useState("All");

  const [allEvents, setAllEvents] = useState([{}]);
  const [modalCreateJob, setModalCreateJob] = useState(false);
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
  }, [currentJob, refreshMe, preShopOption]);

  const fetchJobs = () => {
    console.log('fetch ran')
    fetch(`/jobs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      const preShopJobs = data.filter(job => {
        console.log(job.status)
        if (preShopOption === "All") {return (job.status === "active" || job.status === "noCalendar" || job.status === "inActive") && job.quadrent === "preShop";}
        if (preShopOption === "Scheduled") {return (job.status === "active" || job.status === "inActive") && job.quadrent === "preShop";}
        if (preShopOption === "NoCalendar") {return (job.status === "noCalendar") && job.quadrent === "preShop";}
      }).sort((a, b) => new Date(a.delivery) - new Date(b.delivery));
  
      const inShopJobs = data.filter(job => job.quadrent === "inShop").sort((a, b) => new Date(a.delivery) - new Date(b.delivery));
      const completeJobs = data.filter(job => job.quadrent === "complete").sort((a, b) => new Date(a.delivery) - new Date(b.delivery));
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
      />
    ));
  }

  const handleUpdateJob = (myKey, myValue) => {
    // console.log('HERE '+ myKey, myValue);
    const updatedJob = { ...currentJob };
    updatedJob[myKey] = myValue;
    setCurrentJob(updatedJob);
  };
  const customCheckMarkUpdate = (id) => {
    const updatedJob = { ...currentJob };
    updatedJob.check_boxes = updatedJob.check_boxes.map((checkbox) => {
      if (checkbox.id === id) {
        checkbox.done = !checkbox.done;
      }
      return checkbox;
    });
    setCurrentJob(updatedJob);
  };
  const createNewJob = () => {
    console.log('iran')
    setModalCreateJob(!modalCreateJob)
  }

  return (
    <div>
      <button onClick={createNewJob}>new Job</button>
      <button className="navigationButton"onClick={handleNavigate}>Calendar</button>
      <CreateJobModal
        modalCreateJob={modalCreateJob}
        setModalCreateJob={setModalCreateJob}
        slotClickedOn={slotClickedOn}
        setAllEvents={setAllEvents}
        allEvents={allEvents}
        setRefreshMe={setRefreshMe}
      />
      <div className="mainContainer">
        <div className="matrixContainer">
          {/* PreShop */}
          <div className="preShopContainer">
            <h2 className='preShopMainTitle'> PreShop </h2>
              <div className='preShopTitleBar'>
              <select className='activeDropDown' value={preShopOption} onChange={(e) => setPreShopOption(e.target.value)}>
                <option value="All">All Jobs</option>
                <option value="Scheduled">Scheduled</option>
                <option value="NoCalendar">NoCalendar</option>
              </select>
              </div>
            <div className='preShopMainInfo'>
              {mapJobs(jobsPreShop, PreShopBar)}
            </div>
          </div>
          {/* In Shop */}
          <div className="inShopContainer">
            <h2 className='inShopMainTitle'>In Shop</h2>
            <div className='inShopTitleBar'>
              <div className='titleActivity'>
                  <select className='activeDropDown' value={inShopOption} onChange={(e) => setInShopOption(e.target.value)}>  
                    <option value="ascending">All</option>
                    <option value="descending">Active</option>
                    <option value="descending">inActive</option>
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
                  <select className='activeDropDown'>  
                    <option value="ascending">All</option>
                    <option value="descending">Inactive</option>
                    <option value="descending">Shipped</option>
                  </select>
              </div>
              <div className='inShopActivity'></div>
              <div className='inShopTitleName'></div>
              <div className='inShopTitleDate'>Ship Date</div>
            </div>
            {mapJobs(jobsComplete, CompletedBar)}
          </div>
        </div>
        <DetailPanel 
          currentJob={currentJob}
          fetchJobs={fetchJobs}
          handleUpdateJob={handleUpdateJob} 
          customCheckMarkUpdate={customCheckMarkUpdate}
        />
      </div>
    </div>
  )
}