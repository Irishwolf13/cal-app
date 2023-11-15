import React, { useState, useEffect } from 'react';
import CheckMarkBar from './CheckMarkBar';

export default function DetailPanel({ currentJob, handleUpdateJob}) {
  const deliveryDate = new Date(currentJob.delivery);
  const in_hand = new Date(currentJob.in_hand);
  const [cncParts, setCncParts] = useState(false)
  const [qualityControl, setQualityControl] = useState(false)
  const [productTag, setProductTag] = useState(false)
  const [hardware, setHardware] = useState(false)

  useEffect(() => {
    setCncParts(currentJob.cnc_parts)
    setQualityControl(currentJob.quality_control)
    setProductTag(currentJob.product_tag)
    setHardware(currentJob.hardware)
  },[currentJob])

  deliveryDate.setDate(deliveryDate.getDate());
  in_hand.setDate(in_hand.getDate());

  // Conditional rendering
  if (!currentJob.job_name) {
    return <div className="detailContainer"> Details Panel</div>
  }

  return (
    <div className="detailContainer">
      <div>Details Panel</div>
      <div>Job Name: {currentJob.job_name}</div>
      <div>Delivery Date: {deliveryDate.toDateString()}</div>
      <div>InHand Date: {in_hand.toDateString()}</div>
      <div>
        <CheckMarkBar jobID={currentJob.id} title={`CnC parts`} status={cncParts} backendName={'cnc_parts'} handleUpdateJob={handleUpdateJob}/>
        <CheckMarkBar jobID={currentJob.id} title={`Quality Control Tags`} status={qualityControl} backendName={'quality_control'} handleUpdateJob={handleUpdateJob}/>
        <CheckMarkBar jobID={currentJob.id} title={`Product Tags`} status={productTag} backendName={'product_tag'} handleUpdateJob={handleUpdateJob}/>
        <CheckMarkBar jobID={currentJob.id} title={`Hardware`} status={hardware} backendName={'hardware'} handleUpdateJob={handleUpdateJob}/>
      </div>
    </div>
  );
}