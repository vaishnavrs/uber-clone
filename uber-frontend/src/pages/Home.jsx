import React from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import { BrowserRouter,Routes,Route } from 'react-router'
import Login from './Login'
import LoginVerify from './LoginVerify'
import SearchCab from './SearchCab'
import Travel from './Travel'
import DriverDashBoard from '../components/DriverDashBoard'

function Home() {
  return (
    <div style={{'overflow':'hidden'}}>
        <BrowserRouter>
          <Header/>
          <Routes>
            <Route path='/' element={<HeroSection/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/login-verfify' element={<LoginVerify/>}/>
            <Route path='/search-cab' element={<SearchCab/>}/>
            <Route path='/travel' element={<Travel/>}/>
            <Route path='/driver-dashboard' element={<DriverDashBoard/>}/>
          </Routes>
        </BrowserRouter>
        
    </div>
  )
}

export default Home