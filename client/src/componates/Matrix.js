import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PreShopBar from './PreShopBar';
import InShopBar from './InShopBar';
import CompletedBar from './CompletedBar';

export default function Matrix() {
  const [jobsPreShop, setJobsPreShop] = useState([]);
  const [jobsInShop, setJobsInShop] = useState([]);
  const [jobsComplete, setJobsComplete] = useState([]);
  const [currentlySelected, setCurrentlySelected] = useState(0);

  //allow navigation
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/');
  }
 
  useEffect(() => {
    fetchJobs()
  }, []);

  const fetchJobs = () => {
    fetch(`/jobs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setJobsPreShop(data);
      console.log(data);
    })
  }

  return (
    <div>
      <button className="navigationButton"onClick={handleNavigate}>Calendar</button>
      <div className="mainContainer">
        <div className="matrixContainer">
{/* PreShop */}
          <div className="preShopContainer">
            <div className='preShopMainTitle'> PreShop </div>
            <div className='preShopTitleBar'>
              <div className='titleActivity'>
                <select className='activeDropDown'>  
                  <option value="ascending">All</option>
                  <option value="descending">Scheduled</option>
                </select>
              </div>
              <div className='preShopTitleName'></div>
              <div className='titleDate'>
                {/* <select className='dropDown'>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select> */}
              </div>
            </div>
            {jobsPreShop.map(job => (
              <PreShopBar 
                key={job.uuid}
                myID={job.uuid}
                myStatus={job.status}
                myName={job.job_name}
                myShipDate={job.delivery}
                setCurrentlySelected={setCurrentlySelected}
                currentlySelected={currentlySelected}
              />
            ))}
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
              <div className='titleDate'>
                {/* <select className='dropDown'>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select> */}
              </div>
              <div className='inShopTitleCut'>Cut</div>
              <div className='inShopTitleWeld'>Weld</div>
              <div className='inShopTitleFinish'>FIN</div>
            </div>
            {/* <InShopBar 
              setCurrentlySelected={setCurrentlySelected}
              currentlySelected={currentlySelected}
              myID={3}
              myName={"Third Job With Longer Name"}
              myShipDate={"11/22/2023"}
              myStatus={'active'}
            /> */}
          </div>
{/* Expandable */}
          <div className="expandableContainer">
            <div className='expandable'>Expandable</div>
          </div>
{/* Completed */}
          <div className="completedContainer">
            <div className='CompletedMainTitle'>Completed</div>
            <CompletedBar />
          </div>
        </div>
        <div className="detailContainer">detailContainer</div>
      </div>
    </div>
  )
}
