import { React, useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./App.css";
import MyCalendar from "./componates/MyCalendar";
import HomePage from "./componates/HomePage";
import SideMenu from "./componates/SideMenu";
import myImage from './images/reliable_design_logo2.jpg';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [refreshMe, setRefreshMe] = useState(false);
  const [viewDates, setViewDates] = useState({})

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const handleRangeChange = (range) => {
    const startDate = range.start;
    const endDate = range.end;
    console.log(startDate, endDate);
    setViewDates({startDate, endDate})
  };

  return (
    <div className="App">
      <img className="mainLogo" src={myImage} alt="Reliable Design Logo"/>
      <div className="mainMenu">
        <button onClick={handleClick}>Menu</button>
      </div>
      <div className="mainContainer">
        <div className={`menuBar ${isMenuOpen ? '' : 'collapsed'}`}>
          {isMenuOpen && 
            <div className="sideBarSpacer"></div>
          }
          {isMenuOpen && 
            <SideMenu 
              isMenuOpen={isMenuOpen} 
              setRefreshMe={setRefreshMe} 
              refreshMe={refreshMe}
              // viewDates={viewDates}
            />
          }
        </div>
        <div className={`mainContent ${isMenuOpen ? '' : 'expanded'}`}>
          <Routes>
              {/* <Route
                path="/"
                element={<HomePage />}
              /> */}
              <Route
                path="/"
                element={<MyCalendar setRefreshMe={setRefreshMe} refreshMe={refreshMe} 
                handleRangeChange={handleRangeChange}
                />}
              />
            </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;