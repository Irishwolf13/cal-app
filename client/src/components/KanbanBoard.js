import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function KanbanBoard() {
  //allow navigation
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/');
  }
  return (
    <div>
      <button onClick={handleNavigate}>Go to Calendar</button>
    </div>
  )
}
