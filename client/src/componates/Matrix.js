import React from 'react'
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

  return (
    <div>
      <button className="navigationButton"onClick={handleNavigate}>Calendar</button>
      <div className="mainContainer">
        <div className="matrixContainer">
          <div className="preJob">
            <div className='preShopTitle'>
              <div className='preShopActivity'></div>
              <div className='preShopTitleName'> Pre-Shop </div>
              <div className='preShopDate'> Delivery </div>
            </div>
            <PreShopBar
              myJobName={"# JobNumberHere"}
              myDate={"1/10/2023"}
            />
            <PreShopBar 
              myJobName={"# OtherJobNumberHere"}
              myDate={"2/22/2023"}
            />
          </div>
          <div className="inShop">
            <div className='testing'>In Shop</div>
            <InShopBar />
          </div>
          <div className="expandableSpace">
            <div className='testing'>expandable</div>
          </div>
          <div className="completed">
            <div className='testing'>Completed</div>
            <CompletedBar />
          </div>
        </div>
        <div className="detailContainer">detailContainer</div>
      </div>
    </div>
  )
}
