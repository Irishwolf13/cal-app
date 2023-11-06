import { React, useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./App.css";
import MyCalendar from "./componates/MyCalendar";
import Matrix from "./componates/Matrix.js";
import myImage from './images/reliable_design_logo2.jpg';

function App() {

  return (
    <div className="App">
      <img className="mainLogo" src={myImage} alt="Reliable Design Logo"/>
      <Routes>
          <Route
            path="/"
            element={<MyCalendar />}
          />
          <Route
            path="/matrix"
            element={<Matrix />}
          />
        </Routes>
    </div>
  );
}

export default App;