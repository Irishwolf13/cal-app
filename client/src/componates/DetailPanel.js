import React, { useState, useEffect } from 'react';
import CheckMarkBar from './CheckMarkBar';
import CheckMarkCustom from './CheckMarkCustom';
import MemoBoxDetails from './MemoBoxDetails';

export default function DetailPanel({ currentJob, handleUpdateJob, customCheckMarkUpdate, fetchJobs}) {
  const deliveryDate = new Date(currentJob.delivery);
  const in_hand = new Date(currentJob.in_hand);
  const [cncPartsDone, setCncPartsDone] = useState(false)
  const [qualityControlDone, setQualityControlDone] = useState(false)
  const [productTagDone, setProductTagDone] = useState(false)
  const [hardwareDone, setHardwareDone] = useState(false)

  useEffect(() => {
    console.log('currentJob')
    console.log(currentJob)
    setCncPartsDone(currentJob.cnc_done)
    setQualityControlDone(currentJob.quality_done)
    setProductTagDone(currentJob.product_done)
    setHardwareDone(currentJob.hardware_done)
  }, [currentJob])

  deliveryDate.setDate(deliveryDate.getDate());
  in_hand.setDate(in_hand.getDate());

  const changeQuadrent = (e) => {
    const requestBody = {};
    requestBody["quadrent"] = `${e.target.id}`;
  
    // FETCH: UPDATE JOBS
    fetch(`/jobs/${currentJob.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => response.json())
      .then(data => fetchJobs())
      .catch(error => console.error(error));
  }

  const renderMemoBoxes = () => {
    if (currentJob.memo_boxes && Array.isArray(currentJob.memo_boxes)) {
      return currentJob.memo_boxes.map((memo, index) => (
        <MemoBoxDetails key={memo.id} id={memo.id} memo={memo.memo} />
      ));
    }
    return null;
  }

  // Separate function to map check_boxes and create CheckMarkCustom elements
  const renderCheckMarkCustoms = () => {
    if (currentJob.check_boxes && Array.isArray(currentJob.check_boxes)) {
      return currentJob.check_boxes
        .filter(checkbox => checkbox.title !== '') // Filter out checkboxes with empty title
        .map((checkbox, index) => (
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
      <button id={'preShop'} onClick={changeQuadrent}>PreShop</button>
      <button id={'inShop'} onClick={changeQuadrent}>In Shop</button>
      <button id={'complete'} onClick={changeQuadrent}>Completed</button>
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
        {renderCheckMarkCustoms()}
        {renderMemoBoxes()}
      </div>
    </div>
  );
}
