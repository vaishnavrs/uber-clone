import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';

function DriverGetStarted() {

    const navigate = useNavigate()
  return (
    <div className='get-started'>
        <div>
            <h1>Drive when you want,make<br></br>  what you need</h1>
        </div>
        <div>
            <p>Make money on your schedule with deliveries or<br></br> rides—or both. You can use your own car or choose a rental<br></br> through Uber.</p>
        </div>
        <div>
            <button className='btn btn-dark'>Get started</button>
            <Link to="/login">Already have an account? Sign in</Link>

        </div>
    </div>
  )
}

export default DriverGetStarted