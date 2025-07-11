import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';

function Travel() {
  const location = useLocation();
  const [receivedMsg, setReceivedMsg] = useState([]);
  const userId = location.state;
  const ws = useRef(null);

  console.log("id in travel", userId);

  useEffect(() => {
    if (!userId) return;

    const socketUrl = `ws://127.0.0.1:8000/ws/ride-response/${userId}/`;
    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received from driver:", data);
      setReceivedMsg((prev) => [...prev, data]);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userId]);

  return (
    <div>
      <h2>Travel Page</h2>
      {receivedMsg.map((msg, index) => (
        <div key={index}>
          <p>{msg.message}</p>
        </div>
      ))}
    </div>
  );
}

export default Travel;
