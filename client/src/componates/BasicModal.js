import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

export default function ({ modalCompanyHours, handleCompanyButton, newCompanyHours, setNewCompanyHours}) {
  const handlePerDaySubmit = (e) => {
    e.preventDefault();
    // Fetch POST Daily Maxium Hours
    fetch(`/daily_maximums`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({daily_max: newCompanyHours})
    })
    .then(response => response.json())
    .then(data => {
      setNewCompanyHours(data.daily_max)
    })
    handleCompanyButton()
  }
  
  return (
    <Modal
      isOpen={modalCompanyHours}
      onRequestClose={e => handleCompanyButton()}
      overlayClassName="Overlay"
      className="modalAdjust"
    >
      <form className="createJobForm" onSubmit={handlePerDaySubmit}>
        <label htmlFor="companyHours">Daily Max</label>
        <input
          type="number"
          id="companyHours"
          name="companyHours"
          placeholder= {newCompanyHours}
          onChange={(e) => setNewCompanyHours(e.target.value)}
          autoFocus
        />
        <br></br>
        <button type="submit">Submit</button>
      </form>
    </Modal>
  )
}
