import React, { useState, useEffect } from 'react';

function ToggleSwitchUserDefined({index, handleUserInputChange}) {
  const [inputValue, setInputValue] = useState('');

  // This is better way to track keystrokes
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);
  }
  useEffect(() => {
    handleUserInputChange(index, inputValue);
  }, [inputValue]);
  // This is better way to track keystrokes

  const handleRemoveClicked = (e) => {
    e.preventDefault();
    console.log(index)
  }

  return (
    <div className='toggle-container'>
      <div className={`toggle-switch toggleOnLock`}>
        <div className="toggle-ball"></div>
      </div>
      <div className="toggle-title-user">
        <input
          className='toggle-title-input'
          placeholder={'User Defined'}
          value={inputValue}
          onChange={handleInputChange}
        />
        <div className='toggle-title-remove' onClick={handleRemoveClicked}><button>-</button></div>
      </div>
    </div>
  );
}

export default ToggleSwitchUserDefined;