import { React, useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import "./App.css";
import MyCalendar from "./componates/MyCalendar";
import Matrix from "./componates/Matrix.js";
import myImage from './images/reliable_design_logo2.jpg';

function App() {
  const [myDate, setMyDate] = useState(new Date())

  const changeDate = (date) => {
    const adjustDate = new Date(date)
    adjustDate.setDate(adjustDate.getDate() + 1)
    setMyDate(new Date(adjustDate))
  }

  return (
    <div className="App">
      <img className="mainLogo" src={myImage} alt="Reliable Design Logo"/>
      <Routes>
          <Route
            path="/"
            element={<MyCalendar myDate={myDate}/>}
          />
          <Route
            path="/matrix"
            element={<Matrix changeDate={changeDate}/>}
          />
        </Routes>
    </div>
  );
}

export default App;