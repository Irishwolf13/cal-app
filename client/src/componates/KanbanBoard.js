import { React, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function KanbanBaord() {
  //allow navigation
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate('/');
  }

  const fetchData = () => {
    fetch('/jobs')
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  // Get my Data
  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div>
      <button onClick={handleOnClick}>Go to MyCalendar</button>
    </div>
  )
}
