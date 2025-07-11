import {Map, Marker, useMap} from '@vis.gl/react-google-maps';
import { useEffect } from 'react';


function MapWithMarkers({ source, destination, directionPath }) {
  const map = useMap(); 

  useEffect(() => {
    if (map && source.lat && source.longi && destination.lat && destination.longi) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: source.lat, lng: source.longi });
      bounds.extend({ lat: destination.lat, lng: destination.longi });
      map.fitBounds(bounds);
    }

    
    if (map && directionPath.length > 0) {
      const polyline = new window.google.maps.Polyline({
        path: directionPath,
        geodesic: true,
        strokeColor: "#007bff",
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map: map,
      });

      return () => {
        polyline.setMap(null);
      };
    }
  }, [map, source, destination, directionPath]);


  return (
    <Map
      defaultZoom={10}
      defaultCenter={{ lat: source.lat || 10.0, lng: source.longi || 76.0 }}
      style={{ width: '100%', height: '100%' }}
    >
      <Marker position={{ lat: source.lat, lng: source.longi }} />
      <Marker position={{ lat: destination.lat, lng: destination.longi }} />
    </Map>
  );
}

export default MapWithMarkers