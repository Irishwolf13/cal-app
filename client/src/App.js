import { React, useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./App.css";
import MyCalendar from "./componates/MyCalendar";
import myImage from './images/reliable_design_logo2.jpg';

function App() {
  //allow navigation
  const navigate = useNavigate();

  return (
    <div className="App">
      <img className="mainLogo" src={myImage} alt="Reliable Design Logo"/>
      <Routes>
          <Route
            path="/calendar"
            element={<MyCalendar />}
          />
        </Routes>
    </div>
  );
}

export default App;