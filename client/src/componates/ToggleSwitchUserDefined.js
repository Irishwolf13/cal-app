import React, { useState, useEffect } from 'react';

function ToggleSwitchUserDefined({index, handleUserInputChange, removeUserCheckBoxes, title}) {
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
    removeUserCheckBoxes(index)
  }

  return (
    <div className='toggle-container'>
      <div className={`toggle-switch toggleOn`} onClick={handleRemoveClicked}>
        <div className="toggle-ball"></div>
      </div>
      <div className="toggle-title-user">
        <input
          className='toggle-title-input'
          placeholder={title ? title : 'User Defined'}
          value={inputValue}
          onChange={handleInputChange}
        />
        {/* <div className='toggle-title-remove' onClick={handleRemoveClicked}><button>-</button></div> */}
      </div>
    </div>
  );
}

export default ToggleSwitchUserDefined;