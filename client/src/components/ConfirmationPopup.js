import React from 'react';
import ReactModal from 'react-modal';

export default function ConfirmationPopup({ message, onConfirm, onCancel }) {
  return (
    <ReactModal
      isOpen={true} // Always keep the modal open when used as a subcomponent
      onRequestClose={onCancel}
      contentLabel="Confirmation Popup"
    >
      <div>
        <p>{message}</p>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    </ReactModal>
  );
}
