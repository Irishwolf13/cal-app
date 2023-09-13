import React, { useState } from 'react';
import ReactModal from 'react-modal';

export default function CalendarSelection({ calendar, onDelete }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = () => {
    setShowConfirmation(false);
    onDelete();
  };

  return (
    <div>
      <div>{calendar.name}</div>
      <button onClick={() => setShowConfirmation(true)}>Delete</button>

      <ReactModal
        isOpen={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
        contentLabel="Confirmation Popup"
        overlayClassName="Overlay"
        className="modalBasic"
      >
        <div className="popup-content">
          <p>{`Are you sure you want to delete the Calendar ${calendar.name}?`}</p>
          <button onClick={handleDelete}>Yes</button>
          <button onClick={() => setShowConfirmation(false)}>No</button>
        </div>
      </ReactModal>
    </div>
  );
}
