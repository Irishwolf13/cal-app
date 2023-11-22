import React, { useState, useEffect } from 'react';

export default function CheckMarkCustom({id, status, title, customCheckMarkUpdate}) {

  useEffect(() => {

  },[status])

  const patchJob = (id, _key, _value) => {
    const requestBody = {};
    requestBody[_key] = `${_value}`;
    console.log('ID: ' + id)
    console.log('Key: ' + _key)
    console.log('Value: ' + _value)
    console.log('Request Body')
    console.log(requestBody);
    console.log('stringify')
    console.log(JSON.stringify(requestBody))
    // FETCH: UPDATE JOBS
    fetch(`/checks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  }

  const handleClick = () => {
    patchJob(id, "done", !status)
    customCheckMarkUpdate(id)
  };

  return (
    <div className='checkMark-container'>
      <div className={`checkMark-circle ${status ? 'green' : 'red'}`} onClick={handleClick}>
        <p className='checkMark-check'>{status ? '\u2713' : 'X'}</p>
        <p className='checkMark-label'>{title}</p>
      </div>
    </div>
  );
}