import React, { useEffect, useState,useRef } from 'react';
import DriverSidebar from './DriverSideBar';
import DriverDashBoardMap from './DriverDashBoardMap';
import { useLocation } from 'react-router';
import PopUp from './PopUp';

function DriverDashBoard() {

  const [popup,setPopUp] = useState(false)
  const [receivedMsg, setReceivedMsg] = useState([]);
  const ws = useRef(null);
  const location = useLocation()
  const userId = location.state


  const sendMessage = (responseType, rideInfo) => {
      console.log("rideinfo",rideInfo)
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const payload = {
          type: 'driver_response',
          response: responseType,
          ride_id:rideInfo.ride_id,
          driver_id : userId,
          passenger: rideInfo.passenger,
          pickup: rideInfo.pickup,
          destination: rideInfo.destination,
          fare: rideInfo.fare,
          phone:rideInfo.phone
        };
        ws.current.send(JSON.stringify(payload));
        setPopUp(false); 
      } else {
        console.error('WebSocket is not open');
      }
    };

  useEffect(() => {
    
      if (!userId) return;
      const socketUrl = `ws://127.0.0.1:8000/ws/ride-request/${userId}/`;
      ws.current = new WebSocket(socketUrl);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setReceivedMsg((prev) => [...prev, data]);
        setPopUp(true)
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
    <>
    <div style={{ display: 'flex', height: '100vh' }}>
      <DriverSidebar />
      <div style={{ flex: 1, padding: '0' }}>
        <DriverDashBoardMap />
      </div>
    </div>
    {popup&&<PopUp receivedMsg={receivedMsg} sendMessage={sendMessage}/>}
</>

  );
}

export default DriverDashBoard;
