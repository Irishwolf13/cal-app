import React from 'react'

export default function SideMenuItem({ element }) {
  return (
    <div className='sideMenuItemContainer'>
      <div  className='sideMenuItemLeft'>Job Name:</div>
      <div  className='sideMenuItemLeft'>{element.job_name}</div>
      <div  className='sideMenuItemLeft'>Job Hours:</div>
      <div  className='sideMenuItemLeft'>{element.inital_hours}</div>
      <div  className='sideMenuItemLeft'>Start Date:</div>
      <div  className='sideMenuItemLeft'>{element.events[0].start_time}</div>
      <div  className='sideMenuItemLeft'>End Date:</div>
      <div  className='sideMenuItemLeft'>{element.events[element.events.length - 1].start_time}</div>
    </div>
  )
}
