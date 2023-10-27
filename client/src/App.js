import React from "react";
import { Routes, Route } from 'react-router-dom';
import "./App.css";
import MyCalendar from "./components/MyCalendar";
import KanbanBoard from "./components/KanbanBoard";
import myImage from './images/reliable_design_logo2.jpg';
const data = require('./data.json');

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
          path="/KanbanBoard"
          element={<KanbanBoard />}
        />
      </Routes>
    </div>
  );
}

export default App;