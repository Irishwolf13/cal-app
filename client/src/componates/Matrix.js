import React from 'react'
import { useNavigate } from 'react-router-dom';

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
            <div className='testing'>Pre-Shop</div>
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
