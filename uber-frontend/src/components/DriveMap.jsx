import React, { useEffect, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import MapWithMarkers from './MapWithMarkers';

function DriveMap({ source, destination }) {
  const [directionPath, setDirectionPath] = useState([]);

  useEffect(() => {
    if (
      source.lat && source.longi &&
      destination.lat && destination.longi &&
      window.google && window.google.maps
    ) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: { lat: source.lat, lng: source.longi },
          destination: { lat: destination.lat, lng: destination.longi },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            const path = result.routes[0].overview_path.map(coord => ({
              lat: coord.lat(),
              lng: coord.lng()
            }));
            setDirectionPath(path);
          } else {
            console.error("Directions request failed due to", status);
          }
        }
      );
    }
  }, [source, destination]);

  return (
    <APIProvider apiKey={'AIzaSyAtDN_jFGEmle4__UZbUSLubKU1R3HHoc0'} libraries={['places', 'directions']}>
      <MapWithMarkers
        source={source}
        destination={destination}
        directionPath={directionPath}
      />
    </APIProvider>
  );
}

export default DriveMap;
