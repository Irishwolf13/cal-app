import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  //allow navigation
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate('/calendar');
  }
  return (
    <div>
      <button onClick={handleOnClick}>Go to Calendar</button>
    </div>
  )
}
