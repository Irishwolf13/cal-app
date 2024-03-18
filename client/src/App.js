import { React, useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import "./App.css";
import MyCalendar from "./componates/MyCalendar";
import Matrix from "./componates/Matrix.js";
import myImage from './images/reliable_design_logo2.jpg';
import { Auth } from './componates/auth.js';
import { auth } from "./config/firebase";
import { signOut } from 'firebase/auth';

function App() {
  const [myDate, setMyDate] = useState(new Date())
  const [currentCalendar, setCurrentCalendar] = useState(0);
  const [calendarNames, setCalendarNames] = useState([]);

  const changeDate = (date) => {
    const adjustDate = new Date(date)
    adjustDate.setDate(adjustDate.getDate() + 1)
    setMyDate(new Date(adjustDate))
  }

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backend, setBackend] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); // Set isAuthenticated to true if user is not null
      setLoading(false); // Set loading to false once the auth state is confirmed
    });

    return () => unsubscribe(); // Make sure to unsubscribe on cleanup
  }, []);

  const logOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <div className="App">
      <img className="mainLogo" src={myImage} alt="Reliable Design Logo"/>
      <div className='logOut'>
        {isAuthenticated ? 
          <div>
            <div>{auth?.currentUser?.email}</div>
            <div><button onClick={logOut}>Log out</button></div>
          </div>
          : <></>}
      </div>
      
      <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? 
              <MyCalendar 
                myDate={myDate} 
                currentCalendar={currentCalendar}
                calendarNames={calendarNames}
                setCalendarNames={setCalendarNames}
                setCurrentCalendar={setCurrentCalendar}/> 
              : <Auth />
            }
          />
          <Route
            path="/matrix"
            element={
              isAuthenticated ? 
              <Matrix 
                changeDate={changeDate}  
                currentCalendar={currentCalendar} 
                setCurrentCalendar={setCurrentCalendar}/> 
              : <Auth />
            }
          />
        </Routes>
    </div>
  );
}

export default App;