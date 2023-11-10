import React from 'react';

export default function DetailPanel({ currentJob }) {
  const deliveryDate = new Date(currentJob.delivery);
  deliveryDate.setDate(deliveryDate.getDate());

  // console.log(currentJob);

  return (
    <div className="detailContainer">
      <div>Job Name: {currentJob.job_name}</div>
      <div>Delivery Date: {deliveryDate.toDateString()}</div>
      <div>InHand Date: </div>
    </div>
  );
}