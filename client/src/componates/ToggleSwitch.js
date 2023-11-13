import React, { useState } from 'react';

function ToggleSwitch() {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div
      className={`toggle-switch ${isSelected ? 'toggleOn' : ''}`}
      onClick={() => setIsSelected(!isSelected)}
    >
      <div className="ball" />
    </div>
  );
}

export default ToggleSwitch;