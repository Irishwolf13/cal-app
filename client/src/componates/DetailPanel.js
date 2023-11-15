import React, { useState, useEffect } from 'react';
import CheckMarkBar from './CheckMarkBar';

export default function DetailPanel({ currentJob, handleUpdateJob}) {
  const deliveryDate = new Date(currentJob.delivery);
  const in_hand = new Date(currentJob.in_hand);
  const [cncPartsDone, setCncPartsDone] = useState(false)
  const [qualityControlDone, setQualityControlDone] = useState(false)
  const [productTagDone, setProductTagDone] = useState(false)
  const [hardwareDone, setHardwareDone] = useState(false)

  useEffect(() => {
    setCncPartsDone(currentJob.cnc_done)
    setQualityControlDone(currentJob.quality_done)
    setProductTagDone(currentJob.product_done)
    setHardwareDone(currentJob.hardware_done)
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
        {currentJob.cnc_parts && (<CheckMarkBar jobID={currentJob.id} title={`CnC parts`} status={cncPartsDone} backendName={'cnc_done'} handleUpdateJob={handleUpdateJob}/>)}
        {currentJob.quality_control && (<CheckMarkBar jobID={currentJob.id} title={`Quality Control Tags`} status={qualityControlDone} backendName={'quality_done'} handleUpdateJob={handleUpdateJob}/>)}
        {currentJob.product_tag && (<CheckMarkBar jobID={currentJob.id} title={`Product Tags`} status={productTagDone} backendName={'product_done'} handleUpdateJob={handleUpdateJob}/>)}
        {currentJob.hardware && (<CheckMarkBar jobID={currentJob.id} title={`HardwareDone`} status={hardwareDone} backendName={'hardware_done'} handleUpdateJob={handleUpdateJob}/>)}
      </div>
    </div>
  );
}