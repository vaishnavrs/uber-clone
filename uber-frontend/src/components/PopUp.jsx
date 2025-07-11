import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../styles/popup.css'
import { useEffect, useState } from 'react';

function PopUp({receivedMsg,sendMessage}) {
    const [pickUpAddress,setPickupAddress] = useState('')
    const [destinationAddress,setDestinationAddress] = useState('')
    var fare =null
    console.log(receivedMsg)
    
    
   useEffect(() => {
        const fetchAddress = async (lat, lng, setAddress) => {
            try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAtDN_jFGEmle4__UZbUSLubKU1R3HHoc0`
            );
            const data = await response.json();
            const address = data.results[0]?.formatted_address || 'Unknown location';
            setAddress(address);
            } catch (error) {
            console.error(error);
            setAddress('Failed to fetch address');
            }
        };
        const latestMsg = receivedMsg[receivedMsg.length - 1];
        fare = latestMsg?.fare

        if (latestMsg?.pickup) {
            fetchAddress(latestMsg.pickup.lat, latestMsg.pickup.longi, setPickupAddress);
        }

        if (latestMsg?.destination) {
            fetchAddress(latestMsg.destination.lat, latestMsg.destination.longi, setDestinationAddress);
        }
        }, [receivedMsg]);

  return (  
        <div className='popup'>
             <Modal show={true}  centered backdrop="static">
                <Modal.Header>
                    <Modal.Title>New Ride</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Source:{pickUpAddress}</p>
                    <p>Destination:{destinationAddress}</p>
                    <p>Fare{fare}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => sendMessage('accept', receivedMsg[receivedMsg.length - 1])}>Accept</Button>
                    <Button variant="primary" onClick={() => sendMessage('reject', receivedMsg[receivedMsg.length - 1])}>Reject</Button>
                </Modal.Footer>
            </Modal>
        </div>

  );
}

export default PopUp;