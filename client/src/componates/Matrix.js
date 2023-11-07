import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PreShopBar from './PreShopBar';
import InShopBar from './InShopBar';
import CompletedBar from './CompletedBar';

export default function Matrix() {
  //allow navigation
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/');
  }

  const [currentlySelected, setCurrentlySelected] = useState(0);

  return (
    <div>
      <button className="navigationButton"onClick={handleNavigate}>Calendar</button>
      <div className="mainContainer">
        <div className="matrixContainer">
{/* PreShop */}
          <div className="preShopContainer">
            <div className='preShopMainTitle'> PreShop </div>
            <div className='preShopTitleBar'>
              <div className='preShopTitleActivity'>
                <select className='activeDropDown'>  
                  <option value="ascending">All Jobs</option>
                  <option value="descending">Active Only</option>
                </select>
              </div>
              <div className='preShopTitleName'> Show Name </div>
              <div className='preShopTitleDate'>
                Ship Date
                <select className='dropDown'>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div>
            </div>
            <PreShopBar
              setCurrentlySelected={setCurrentlySelected}
              currentlySelected={currentlySelected}
              myID={1}
              myName={"First Job"}
              myDate={"1/10/2023"}
            />
            <PreShopBar 
              setCurrentlySelected={setCurrentlySelected}
              currentlySelected={currentlySelected}
              myID={2}
              myName={"Second Job"}
              myDate={"2/22/2023"}
            />
          </div>
{/* In Shop */}
          <div className="inShopContainer">
            <h2 className='inShopMainTitle'>In Shop</h2>
            <div className='inShopTitleBar'>
              <div className='inShopActivity'></div>
              <div className='inShopTitleName'>Show Name</div>
              <div className='inShopTitleDate'>Date</div>
              <div className='inShopTitleCut'>Cut</div>
              <div className='inShopTitleWeld'>Weld</div>
              <div className='inShopTitleFinish'>Fin</div>
            </div>
            <InShopBar />
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
