import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/hero.css'
import MapComponent from './MapComponent';
import DriverLogIn from './DriverLogIn';
import DriverGetStarted from './DriverGetStarted';


function HeroSection() {
  return (
    <>
        <div className='row' style={{'height':'950px'}}>
            <div className="col-md-6">
                <div className='check-fare'>
                    <h1>Go  anywhere  with <br></br>Uber</h1>
                    <div className='check-fare-form'>
                        <form action="" method="post">
                            <div>
                                <input type="text"  placeholder='Pick up location' />
                            </div>
                            <div>
                                <input type="text" placeholder='destination' name=""/>
                            </div>
                            <div>
                                <input style={{'width':'195px'}} type="date" name=""  />
                                <input type="datetime" placeholder='time' style={{'width':'176px'}} name=""/>
                            </div>
                            <div>
                                <button className='btn btn-dark '>Search cab</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className='map-comp'>
                    <MapComponent/>     
                </div>   
                
            </div>
        </div>
        <div className="row">
            <div className="col-md-6">
                <DriverLogIn/>
            </div>
            <div className="col-md-6">
                <DriverGetStarted/>
            </div>
        </div>
    </>

  )
}

export default HeroSection