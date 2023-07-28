import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function SideMenuItem({ element, index, displayContent, selectedDates, handleDatePicker }) {
  const [selectedValue, setSelectedValue] = useState('');

  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div className='sideMenuItemContainer'>
      <div className='sideMenuItemLeft'>Job Name:</div>
      <div className='sideMenuItemLeft'>{element.job_name}</div>
      <div className='sideMenuItemLeft'>Job Hours:</div>
      <div className='sideMenuItemLeft'>{element.inital_hours}</div>
      <div className='sideMenuItemLeft'>Start Date:</div>
      <div className='sideMenuItemLeft'>{element.events[0].start_time}</div>
      <div className='sideMenuItemLeft'>End Date:</div>
      <div className='sideMenuItemLeft'>{element.events[element.events.length - 1].start_time}</div>
      
      <div className='sideMenuItemLeft'>Current Status:</div>
      <select value={selectedValue} onChange={handleDropdownChange}>
        <option value="">Select an option</option>
        <option value="option1">Cut</option>
        <option value="option2">Machining</option>
        <option value="option3">Welding</option>
        <option value="option4">Cleaning</option>
        <option value="option5">Powder Coating</option>
      </select>
      <label className='sideMenuItemLeft'>Delivery Date:</label>
      <DatePicker
        selected={selectedDates[index]}
        onChange={(date) => handleDatePicker(date, index)}
        placeholderText={displayContent(element)}
      />
    </div>
  );
}
