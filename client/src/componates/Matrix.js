import React from 'react'
import { useNavigate } from 'react-router-dom';
import PreShopBar from './PreShopBar';

export default function Matrix() {
  //allow navigation
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/');
  }

  return (
    <div>
      <button className="navigationButton"onClick={handleNavigate}>Calendar</button>
      <div class="mainContainer">
        <div class="matrixContainer">
          <div class="preJob">
            <div className='preShopTitle'>
              <div className='preShopActivity'></div>
              <div className='preShopTitleName'> Pre-Shop </div>
              <div className='preShopDate'> Delivery </div>
            </div>
            <PreShopBar
              myJobName={"# JobNumberHere"}
              myDate="1/10/2023"
            />
            <PreShopBar 
              myJobName={"# OtherJobNumberHere"}
              myDate="2/22/2023"
            />
          </div>
          <div class="inShop">
            <div className='testing'>In Shop</div>
          </div>
          <div class="expandableSpace">
            <div className='testing'>expandable</div>
          </div>
          <div class="completed">
            <div className='testing'>Completed</div>
          </div>
        </div>
        <div class="detailContainer">detailContainer</div>
      </div>
    </div>
  )
}
