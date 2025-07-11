import React, { useState } from 'react'
import '../styles/login.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router'
import { verfiyLogin } from '../api/auth';


function LoginVerify() {
  const location = useLocation()
  const phone = location.state
  const navigate = useNavigate()

  const [otpInput,setOtp] = useState(['','','',''])

  function otpHandler(e,index){
    const newOtp = [...otpInput]
    newOtp[index] = e.target.value
    setOtp(newOtp)

  }



  const loginHandler = async(e)=>{
    e.preventDefault()
    console.log("otp=",otpInput)
    if(otpInput.length<4){
      alert("enter the otp")
      return
    }
    const enteredOtp = otpInput.join('')
    const response =await verfiyLogin(enteredOtp,phone)
    if(response.error){
      alert(response.error.message)
      return
    }

    else{

      localStorage.setItem("access_token",response.tokens.access)
      localStorage.setItem("refresh_token",response.tokens.refresh)
      console.log("usertype",response.userType)

      if(response.userType ==='passenger'){
        navigate('/search-cab',{state:
          { phone :phone,
            userId:response.userId

          }})
      }else{
        console.log('userid in login verfify',response.userId)
        navigate('/driver-dashboard',{state:response.userId})

      }
      

    }
    
  }



  return (
    <div className='log-verfify'>
      <h2>Welcome Back</h2>
      <p>Enter the 4-digit code sent via SMS at {phone}</p>
      <div>
        <form action="" onSubmit={loginHandler} method="post">
          <div className="otp-input">
          <input type='text' value={otpInput[0]} onChange={(e)=>otpHandler(e,0)} maxLength={1}/>
          <input type='text' value={otpInput[1]} onChange={(e)=>otpHandler(e,1)} maxLength={1}/>
          <input type='text' value={otpInput[2]} onChange={(e)=>otpHandler(e,2)} maxLength={1}/>
          <input type='text' value={otpInput[3]} onChange={(e)=>otpHandler(e,3)} maxLength={1}/>
        </div>
        <div>
          <button className='resend'>Resend code via sms</button>
        </div>
        <div>
          <button className='back'><span className="material-symbols-outlined">arrow_back</span></button>
          <button type='submit' className='next'>Next<span className="material-symbols-outlined">arrow_forward</span></button>
        </div>
      </form>
      </div>
    </div>
  )
}

export default LoginVerify