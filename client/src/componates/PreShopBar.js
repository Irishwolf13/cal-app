import React from 'react'
import myImage from '../images/blueCircle.png';

export default function PreShopBar({ myDate, myJobName }) {
  return (
    <div className='preShopBar'>
      <div className='preShopBarActivity'>
        <img className='activityCircle' src={myImage} alt="here" />
      </div>
      <div className='preShopBarName'> {myJobName} </div>
      <div className='preShopBarDate'> {myDate} </div>
    </div>
  )
}
