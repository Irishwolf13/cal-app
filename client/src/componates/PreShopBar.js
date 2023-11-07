import React from 'react';
import myImage from '../images/blueCircle.png';

export default function PreShopBar({ 
  myDate, 
  myName, 
  myID, 
  setCurrentlySelected, 
  currentlySelected 
}) 
{
  const handleClick = () => {
    setCurrentlySelected(myID);
  };

  return (
    <div className={`preShopBar ${myID === currentlySelected ? 'selected' : 'notSelected'}`} onClick={handleClick}>
      <div className='preShopBarActivity'>
        <img className='activityCircle' src={myImage} alt="here" />
      </div>
      <div className='preShopBarName'> {myName} </div>
      <div className='preShopBarDate'> {myDate} </div>
    </div>
  );
}
