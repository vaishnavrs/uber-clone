import React from 'react'
import {APIProvider, Map} from '@vis.gl/react-google-maps';

function DriverDashBoardMap() {
  return (
            <APIProvider apiKey={'AIzaSyAtDN_jFGEmle4__UZbUSLubKU1R3HHoc0'}>
                <Map
                    style={{width:'100%'}}
                    defaultZoom={13}
                    defaultCenter={ { lat: -33.860664, lng: 151.208138 } }>
                </Map>
            </APIProvider>
  )
}

export default DriverDashBoardMap