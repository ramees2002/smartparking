import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router'
import Home from './pages/Home'
import Login from './pages/Login'
import MyBookings from './pages/MyBookings'
import ParkingDetails from './pages/ParkingDetails'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './ProtectedRoute'
import AdminDashboard from './pages/adminDashboard'
import ParkingMap from './pages/parkingMap'
import Reviews from './pages/Reviews'






const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
     <Routes>
      <Route  path='/' element={<Home/>} ></Route>
      <Route  path='/login' element={<Login/>} ></Route>
      <Route  path='/mybookings' element={<ProtectedRoute><MyBookings/></ProtectedRoute>} ></Route>
      <Route  path='/parkingdetails' element={<ParkingDetails/>} ></Route>
      <Route  path='/myprofile' element={<ProtectedRoute><Profile/></ProtectedRoute>} ></Route>
      <Route  path='/register' element={<Register/>} ></Route>
      <Route  path='/map' element={<ParkingMap/>} ></Route>
      <Route  path='/admin' element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} ></Route>
      
      <Route  path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>} ></Route>
      <Route  path='/reviews' element={<Reviews/>} ></Route>
      
      
      
      </Routes> 
      </BrowserRouter>
      
    </div>
  )
}

export default App
