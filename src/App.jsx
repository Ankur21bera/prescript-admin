import React from 'react'
import Login from './Pages/Login'
import { Toaster } from 'react-hot-toast'
import Navbar from './Components/Navbar'
import { useSelector } from 'react-redux'
import Sidebar from './Components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './Pages/admin/Dashboard'
import Allappointment from './Pages/admin/Allappointment'
import Adddoctor from './Pages/admin/Adddoctor'
import Doctorlist from './Pages/admin/Doctorlist'
import Doctordashboard from './Pages/doctor/Doctordashboard'
import Doctorprofile from './Pages/doctor/Doctorprofile'
import DoctorAppointment from './Pages/doctor/doctorAppointment'



const App = () => {
  const { aToken } = useSelector((state) => state.app);  
   const doctorToken = useSelector((state) => state.doctor.token);


  return aToken || doctorToken ? (
    <div className='bg-[#f8f9fd]'>
      <Toaster />
      <Navbar />
      <div className='flex items-start'>
      <Sidebar/>
      <Routes>
        <Route path='/' element={<></>}/>
        <Route path='/admin-dashboard' element={<Dashboard/>}/>
        <Route path='/all-appointments' element={<Allappointment/>}/>
        <Route path='/add-doctors' element={<Adddoctor/>}/>
        <Route path='/doctor-list' element={<Doctorlist/>}/>

        <Route path='/doctor-dashboard' element={<Doctordashboard/>}/>
        <Route path='/doctor-appointment' element={<DoctorAppointment/>}/>
        <Route path='/doctor-profile' element={<Doctorprofile/>}/>
      </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <Toaster />
    </>
  );
};

export default App;


