import React, { useState, useEffect } from 'react';
import CheckMarkBar from './CheckMarkBar';
import CheckMarkCustom from './CheckMarkCustom';
import MemoBoxDetails from './MemoBoxDetails';

export default function DetailPanel({ currentJob, setCurrentJob, handleUpdateJob, customCheckMarkUpdate, fetchJobs}) {
  const deliveryDate = new Date(currentJob.delivery);
  const in_hand = new Date(currentJob.in_hand);
  const [cncPartsDone, setCncPartsDone] = useState(false)
  const [qualityControlDone, setQualityControlDone] = useState(false)
  const [productTagDone, setProductTagDone] = useState(false)
  const [hardwareDone, setHardwareDone] = useState(false)
  const [powderDone, setPowderDone] = useState(false)

  useEffect(() => {
    setCncPartsDone(currentJob.cnc_done)
    setQualityControlDone(currentJob.quality_done)
    setProductTagDone(currentJob.product_done)
    setHardwareDone(currentJob.hardware_done)
    setPowderDone(currentJob.powder_done)
  }, [currentJob])

  deliveryDate.setDate(deliveryDate.getDate());
  in_hand.setDate(in_hand.getDate());

  const handleDeleteJob = (job) => {
    const confirmation = window.confirm(`Are you sure you want to delete ${currentJob.job_name}?`);
    
    if (confirmation) {
      // console.log(currentJob);
      // // FETCH: UPDATE JOBS
      fetch(`/jobs/${currentJob.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify()
      })
      .then(data => {
        setCurrentJob({})
        fetchJobs()
      })
    }
  }

  const changeQuadrent = (e) => {
    const requestBody = {};
    requestBody["quadrent"] = `${e.target.id}`;
    if(e.target.id === 'complete') {
      requestBody["status"] = 'inActive';
    }
  
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

  // Separate function to map checks and create CheckMarkCustom elements
  const renderCheckMarkCustoms = () => {
    if (currentJob.checks && Array.isArray(currentJob.checks)) {
      return currentJob.checks
        .filter(checkbox => checkbox.title !== '') // Filter out checkboxes with empty title
        .map((checkbox, index) => (
          <CheckMarkCustom key={index} id={checkbox.id} status={checkbox.done} title={checkbox.title} customCheckMarkUpdate={customCheckMarkUpdate}/>
        ));
    }
    return null;
  }

  // Conditional rendering
  if (!currentJob.job_name) {
    return <div className="detailContainer"> 
            <div className='detail-text'>
              Details Panel
            </div>
          </div>
  }

  return (
    <div className="detailContainer">
      <div className='detail-text'>Details Panel</div>
      <button className='details-button' id={'preShop'} onClick={changeQuadrent}>PreShop</button>
      <button className='details-button' id={'inShop'} onClick={changeQuadrent}>In Shop</button>
      <button className='details-button' id={'complete'} onClick={changeQuadrent}>Completed</button>
      <div className='detail-text1'>{currentJob.job_name}</div>
      <div className='detail-text2'>Delivery Date: {deliveryDate.toDateString()}</div>
      <div className='detail-text3'>InHand Date: {in_hand.toDateString()}</div>
      <div className='frank'>
        {/* Render CheckMarkBar components as before */}
        {currentJob.cnc_parts && (<CheckMarkBar jobID={currentJob.id} title={`CnC parts`} status={cncPartsDone} backendName={'cnc_done'} handleUpdateJob={handleUpdateJob}/>)}
        {currentJob.quality_control && (<CheckMarkBar jobID={currentJob.id} title={`Quality Control Tags`} status={qualityControlDone} backendName={'quality_done'} handleUpdateJob={handleUpdateJob}/>)}
        {currentJob.product_tag && (<CheckMarkBar jobID={currentJob.id} title={`Product Tags`} status={productTagDone} backendName={'product_done'} handleUpdateJob={handleUpdateJob}/>)}
        {currentJob.hardware && (<CheckMarkBar jobID={currentJob.id} title={`Hardware`} status={hardwareDone} backendName={'hardware_done'} handleUpdateJob={handleUpdateJob}/>)}
        {currentJob.powder_coating && (<CheckMarkBar jobID={currentJob.id} title={`Powder Coating`} status={powderDone} backendName={'powder_done'} handleUpdateJob={handleUpdateJob}/>)}
        {renderCheckMarkCustoms()}
        {renderMemoBoxes()}
        <button className='details-delete-button' onClick={handleDeleteJob}>Delete Job</button>
      </div>
    </div>
  );
}
