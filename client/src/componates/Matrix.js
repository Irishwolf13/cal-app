import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PreShopBar from './PreShopBar';
import InShopBar from './InShopBar';
import CompletedBar from './CompletedBar';
import DetailPanel from './DetailPanel';
import CreateJobModal from "./CreateJobModal";

export default function Matrix() {
  const [jobsPreShop, setJobsPreShop] = useState([]);
  const [jobsInShop, setJobsInShop] = useState([]);
  const [jobsComplete, setJobsComplete] = useState([]);
  const [currentJob, setCurrentJob] = useState({});
  const [currentlySelected, setCurrentlySelected] = useState(0);

  //allow navigation
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/');
  }
 
  useEffect(() => {
    fetchJobs()
  }, [currentJob]);

  const fetchJobs = () => {
    fetch(`/jobs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      const preShopJobs = data.filter(job => job.quadrent === "preShop").sort((a, b) => new Date(a.delivery) - new Date(b.delivery));
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

  return (
    <div>
      <button className="navigationButton"onClick={handleNavigate}>Calendar</button>
      <div className="mainContainer">
        <div className="matrixContainer">
          {/* PreShop */}
          <div className="preShopContainer">
            <h2 className='preShopMainTitle'> PreShop </h2>
              <div className='preShopTitleBar'>
                <select className='activeDropDown'>  
                  <option value="ascending">All</option>
                  <option value="descending">Scheduled</option>
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
                  <select className='activeDropDown'>  
                    <option value="ascending">All</option>
                    <option value="descending">Active</option>
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
      <CreateJobModal />
    </div>
  )
}
