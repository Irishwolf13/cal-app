import React, { useState, useEffect } from 'react';
import Board from 'react-trello';

const data = require('../data.json');

const handleDragStart = (cardId, laneId) => {
  console.log('drag started');
  console.log(`cardId: ${cardId}`);
  console.log(`laneId: ${laneId}`);
};

const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
  console.log('drag ended');
  console.log(`cardId: ${cardId}`);
  console.log(`sourceLaneId: ${sourceLaneId}`);
  console.log(`targetLaneId: ${targetLaneId}`);
};

export default function KanbanBoard() {
  const [boardData, setBoardData] = useState({ lanes: [] });
  const [eventBus, setEventBus] = useState(null);

  useEffect(() => {
    async function fetchBoard() {
      const response = await getBoard();
      setBoardData(response);
    }
    fetchBoard();
  }, []);

  const getBoard = () => {
    return new Promise((resolve) => {
      resolve(data);
    });
  };

  const completeCard = () => {
    eventBus.publish({
      type: 'ADD_CARD',
      laneId: 'COMPLETED',
      card: {
        id: 'Milk',
        title: 'Buy Milk',
        label: '15 mins',
        description: 'Use Headspace app',
      },
    });
    eventBus.publish({
      type: 'REMOVE_CARD',
      laneId: 'PLANNED',
      cardId: 'Milk',
    });
  };

  const addCard = () => {
    eventBus.publish({
      type: 'ADD_CARD',
      laneId: 'BLOCKED',
      card: {
        id: 'Ec2Error',
        title: 'EC2 Instance Down',
        label: '30 mins',
        description: 'Main EC2 instance down',
      },
    });
  };

  const shouldReceiveNewData = (nextData) => {
    console.log('New card has been added');
    console.log(nextData);
  };

  const handleCardAdd = (card, laneId) => {
    console.log(`New card added to lane ${laneId}`);
    console.dir(card);
  };

  return (
    <div className="App">
      <div className="App-intro">
        <button onClick={completeCard} style={{ margin: 5 }}>
          Complete Buy Milk
        </button>
        <button onClick={addCard} style={{ margin: 5 }}>
          Add Blocked
        </button>
        <Board
          editable
          onCardAdd={handleCardAdd}
          data={boardData}
          draggable
          onDataChange={shouldReceiveNewData}
          eventBusHandle={setEventBus}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
        />
      </div>
    </div>
  );
}
