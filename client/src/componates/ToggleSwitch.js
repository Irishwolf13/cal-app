import React, { useState } from 'react';

function ToggleSwitch({title, toggleChange, option}) {
  const [isSelected, setIsSelected] = useState(false);

  const handleClicked = () => {
    setIsSelected(!isSelected)
    toggleChange(option)
  }

  return (
    <div>
      <div
        className={`toggle-switch ${isSelected ? 'toggleOn' : ''}`}
        onClick={handleClicked}
      >
        <div className="toggle-ball"></div>
        <div className="toggle-title">{title}</div>
      </div>
    </div>
  );
}

export default ToggleSwitch;