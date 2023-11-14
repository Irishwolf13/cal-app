import React, { useState, useEffect } from 'react';

export default function MemoBox({ memo, index, removeMemoBox, handleMemoChange }) {
  const [inputValue, setInputValue] = useState('');

  // This is better way to track keystrokes
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);
  }
  useEffect(() => {
    handleMemoChange(index, inputValue);
  }, [inputValue]);
  // This is better way to track keystrokes

  const handleClicked = (e) => {
    e.preventDefault();
    removeMemoBox(index);
  }

  return (
    <div className='memoBox-container'>
      <div className={`toggle-switch toggleOn`} onClick={handleClicked}>
        <div className="toggle-ball"></div>
      </div>
      {/* <div className='toggle-memo-title'>{`MemoBox ${index + 1}`}</div> */}
      {/* <input className='memoBox' type="text" value={inputValue} onChange={(e) => handleInputChange(e)} /> */}
      <textarea
        className='memoBox'
        value={inputValue}
        placeholder={`MemoBox ${index + 1}`} 
        onChange={(e) => handleInputChange(e)}
      ></textarea>
    </div>
  );
}