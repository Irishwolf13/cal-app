import React, { useState, useEffect, useRef } from 'react';

export default function MemoBoxDetails({ memo, id }) {
  const [inputValue, setInputValue] = useState(memo);
  const debounceTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Debounce function
  const debounce = (func, delay) => {
    return function () {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = setTimeout(() => {
        func.apply(this, arguments);
      }, delay);
    };
  };

  const saveMemo = () => {
    const requestBody = {};
    requestBody["memo"] = `${inputValue}`;

    // FETCH: UPDATE JOBS
    fetch(`/memo_boxes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => response.json())
      // .then(data => console.log(data))
      .catch(error => console.error(error));
  };

  const delayedSaveMemo = debounce(saveMemo, 1000); // Delayed saveMemo function

  useEffect(() => {
    delayedSaveMemo(); // Call the delayed saveMemo function
    return () => {
      clearTimeout(debounceTimeoutRef.current);
    };
  }, [inputValue]); // Run effect whenever inputValue changes

  return (
    <div className='memoBox-details-container'>
      <textarea
        className='memoBox-details'
        value={inputValue}
        placeholder={'MemoBox'}
        onChange={handleInputChange}
      ></textarea>
    </div>
  );
}
