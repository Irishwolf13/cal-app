import React, { useState, useEffect } from 'react';
import CheckMarkBar from './CheckMarkBar';
import CheckMarkCustom from './CheckMarkCustom';

export default function DetailPanel({ currentJob, handleUpdateJob, customCheckMarkUpdate }) {
  const deliveryDate = new Date(currentJob.delivery);
  const in_hand = new Date(currentJob.in_hand);
  const [cncPartsDone, setCncPartsDone] = useState(false)
  const [qualityControlDone, setQualityControlDone] = useState(false)
  const [productTagDone, setProductTagDone] = useState(false)
  const [hardwareDone, setHardwareDone] = useState(false)

  useEffect(() => {
    console.log(currentJob)
    setCncPartsDone(currentJob.cnc_done)
    setQualityControlDone(currentJob.quality_done)
    setProductTagDone(currentJob.product_done)
    setHardwareDone(currentJob.hardware_done)
  }, [currentJob])

  deliveryDate.setDate(deliveryDate.getDate());
  in_hand.setDate(in_hand.getDate());

  // Separate function to map check_boxes and create CheckMarkCustom elements
  const renderCheckMarkCustoms = () => {
    if (currentJob.check_boxes && Array.isArray(currentJob.check_boxes)) {
      return currentJob.check_boxes.map((checkbox, index) => (
        <CheckMarkCustom key={index} id={checkbox.id} status={checkbox.done} title={checkbox.title} customCheckMarkUpdate={customCheckMarkUpdate}/>
      ));
    }
    
    return null;
  }

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
        {/* Render CheckMarkBar components as before */}
        {currentJob.cnc_parts && (<CheckMarkBar jobID={currentJob.id} title={`CnC parts`} status={cncPartsDone} backendName={'cnc_done'} handleUpdateJob={handleUpdateJob}/>)}
        {currentJob.quality_control && (<CheckMarkBar jobID={currentJob.id} title={`Quality Control Tags`} status={qualityControlDone} backendName={'quality_done'} handleUpdateJob={handleUpdateJob}/>)}
        {currentJob.product_tag && (<CheckMarkBar jobID={currentJob.id} title={`Product Tags`} status={productTagDone} backendName={'product_done'} handleUpdateJob={handleUpdateJob}/>)}
        {currentJob.hardware && (<CheckMarkBar jobID={currentJob.id} title={`HardwareDone`} status={hardwareDone} backendName={'hardware_done'} handleUpdateJob={handleUpdateJob}/>)}
        
        {/* Call the renderCheckMarkCustoms function to create CheckMarkCustom elements */}
        {renderCheckMarkCustoms()}
      </div>
    </div>
  );
}
