import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

export default function ({ modalCompanyHours, handleCompanyButton}) {
  const [newComapnyHours, setNewCompanyHours] = useState(50)
  const handlePerDaySubmit = (e) => {
    e.preventDefault();
    // PATCH TO THE BACKEND NEW COMPANY HOURS
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
          placeholder= {newComapnyHours}
          onChange={(e) => setNewCompanyHours(e.target.value)}
          autoFocus
        />
        <br></br>
        <button type="submit">Submit</button>
      </form>
    </Modal>
  )
}
