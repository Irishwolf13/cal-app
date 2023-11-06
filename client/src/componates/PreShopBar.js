import React from 'react'
import myImage from '../images/blueCircle.png';

export default function PreShopBar({ myDate, myJobName }) {
  return (
    <div className='preShopBar'>
      <div className='preShopActivity'>
        <img className='activityCircle' src={myImage} alt="here" />
      </div>
      <div className='preShopShowName'> {myJobName} </div>
      <div className='preShopDate'> {myDate} </div>
    </div>
  )
}
