import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/login.css'
import { initiateLogin } from '../api/auth';
import { useNavigate } from 'react-router';
function Login() {


  const [phone,setNumber] = useState('')
  const navigate = useNavigate()


  const loginHandler = async(e)=>{

    e.preventDefault();
    if(!phone){
      alert('enter mobile number')
      return
    }

    const response = await initiateLogin(phone)
    if(response.error){
      alert(response.error.message)
    }else{
      navigate('/login-verfify',{state:phone})
    }

  }



  return (
    <div className='login'>
      <div>
        <h3>What's your phone number</h3>
      </div>

      <div>
        <form action="" onSubmit={loginHandler} method="post">
          <input type="tel" value={phone} className='form-control'onChange={(e)=>setNumber(e.target.value)} 
          placeholder='Enter your phone number' id="" />
          <button type='submit' className='btn btn-dark continue'>Continue</button>
        </form>
      </div>

      <div className="separator">
        <span>or</span>
      </div>

      <div>
        <button className='google'>Continue with Google</button>
      </div>
      <div>
        <button className='apple'>Continue with apple</button>
      </div>
      <div>
        <p>By proceeding, you consent to get calls, WhatsApp<br></br>
          or SMS/RCS messages, including by automated means, <br></br>
          from Uber and its affiliates to the number provided.</p>
      </div>
    </div> 
  )
}

export default Login