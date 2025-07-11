import React, { useState } from 'react'
import { useEffect } from 'react';
import MapComponent from '../components/MapComponent'
import '../styles/search.css'
import Autocomplete from "react-google-autocomplete";
import DriveMap from '../components/DriveMap';
import { requestCab } from '../api/driveApi';
import { useLocation, useNavigate } from 'react-router';




function SearchCab() {
  

  const [dest,setDest] = useState('')
  const location = useLocation()
  const {phone,userId} = location.state
  const [pickup,setPickup] = useState('')
  const [drivemap,setDriveMap] = useState(false)
  const [start,setStart] = useState({
    lat:'',
    longi:''
  })
  const [end,setEnd] = useState({
    lat:'',
    longi:''
  })
  const navigate = useNavigate()




  function handleLocationSubmit(e){
    e.preventDefault()
    if(!dest || !pickup){
      alert('enter the source & destination')
      return
    }
    setDriveMap(true)
  }



 const searchCabHandler = async(e)=>{
    e.preventDefault()
    const travelData = {
      source:start,
      destination:end,
      distance :10,
      phone:phone
    }
    const response = await requestCab(travelData)
    if(response.error){
      alert(response.error.message)
      return
    }
    else{
        navigate('/travel',{state:userId})
    }

  }


  useEffect(() => {

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setStart({lat:latitude,longi:longitude})
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAtDN_jFGEmle4__UZbUSLubKU1R3HHoc0`
            );
            const data = await response.json();
            const address = data.results[0]?.formatted_address || `${latitude}, ${longitude}`;
            setPickup(address);

          } catch (err) {
            console.error("Geocoding failed:", err);
            setPickup(`${latitude}, ${longitude}`);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setPickup("Unable to detect location");
        }
      );
    } else {
      setPickup("Geolocation not supported");
    }
  }, []);



  
  console.log("start",start)

  return (
    <div className="row" style={{'height':'950px'}}>
      <div className="col-md-6">
          <div className="book-ride">
              <h1>Get Your Ride</h1>
                <div className="book-ride-form">
                    <form action="" method="post" onSubmit={handleLocationSubmit}>
                        <div>
                          <input type="text" value={pickup} name="" id="" placeholder='pickup location' />
                        </div>
                        <div>
                          <Autocomplete
                            apiKey={'AIzaSyAtDN_jFGEmle4__UZbUSLubKU1R3HHoc0'}
                            libraries={['places']}
                            onPlaceSelected={(place) => {
                              setDest(place.formatted_address || '');
                              const lat = place.geometry?.location?.lat();
                              console.log('lat',lat)
                              const lng = place.geometry?.location?.lng();
                              console.log('longitude',lng)
                                if (lat && lng) {
                                  setEnd({ lat: lat, longi: lng });
                                } else {
                                  console.warn("Could not extract coordinates from selected place.");
                                }
                            }}
                            options={{
                              types:[],
                              componentRestrictions:{country:'in'}

                            }}
                            placeholder="destination"
                            className="form-control"
                          />
                        </div>
                        <div>
                            {!drivemap?<button type='submit' className='btn btn-dark '>See prices</button>:
                                      <button onClick={searchCabHandler} type='submit' className='btn btn-dark'>Search cab</button>
                            }
                        </div>
                    </form>
                </div>
          </div>
      </div>
      <div className="col-md-6">
        <div className="map-comp">
          {console.log("end=",end)}
            {drivemap?<DriveMap source={start} destination ={end}/>:<MapComponent/>}
        </div>
      </div>
    </div>

  )
}

export default SearchCab