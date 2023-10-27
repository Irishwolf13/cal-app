import { React, useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./App.css";
import MyCalendar from "./componates/MyCalendar";
import KanbandBoard from "./componates/KanbanBoard";
import myImage from './images/reliable_design_logo2.jpg';

function App() {

  return (
    <div className="App">
      <img className="mainLogo" src={myImage} alt="Reliable Design Logo"/>
      <Routes>
          {/* <Route
            path="/"
            element={<HomePage />}
          /> */}
          <Route
            path="/"
            element={<MyCalendar />}
          />
          <Route
            path="/KanbandBoard"
            element={<KanbandBoard />}
          />
        </Routes>
    </div>
  );
}

export default App;