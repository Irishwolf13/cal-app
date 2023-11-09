import React from 'react'

export default function DetailPanel( {currentJob} ) {
  console.log(currentJob)
  return (
    <div className="detailContainer">
      <div>Job Name: {currentJob.job_name}</div>
      <div>Delivery Date: {currentJob.delivery}</div>
      <div>InHand Date: </div>
      
    </div>
  )
}
