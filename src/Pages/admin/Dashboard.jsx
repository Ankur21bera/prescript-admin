import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { cancelAppointment, getAdminDashboard } from '../../redux/app/appSlice';
import { assets } from '../../assets/assets';
const Dashboard = () => {
  const dispatch = useDispatch();
  const {aToken,dashboard} = useSelector((state)=>state.app);

   const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(()=>{
    if(aToken) dispatch(getAdminDashboard());
  },[aToken,dispatch])

  if (!dashboard) return null;
  return (
    <div className='p-4 md:p-6'>
     <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      <div className='flex items-center gap-4 bg-white shadow-sm p-4 rounded-xl border hover:scale-[1.02] transition'>
        <img src={assets.doctor_icon} alt="" />
       <div>
        <p className='text-2xl font-bold text-gray-700'>{dashboard.doctors}</p>
        <p className="text-gray-500">Doctors</p>
      </div> 
      </div>
      <div className='flex items-center gap-4 bg-white shadow-sm p-4 rounded-xl border hover:scale-[1.02] transition'>
       <img className='w-14' src={assets.appointments_icon} alt="" />
       <div>
            <p className="text-2xl font-bold text-gray-700">
              {dashboard.appointments}
            </p>
            <p className="text-gray-500">Appointments</p>
          </div>
      </div>
      <div className="flex items-center gap-4 bg-white shadow-sm p-4 rounded-xl border hover:scale-[1.02] transition">
          <img className="w-14" src={assets.patients_icon} alt="" />
          <div>
            <p className="text-2xl font-bold text-gray-700">
              {dashboard.patients}
            </p>
            <p className="text-gray-500">Patients</p>
          </div>
        </div>
     </div>

     <div className='bg-white mt-8 rounded-xl shadow-sm border'>
       <div className='flex items-center gap-3 px-4 py-4'>
         <img src={assets.list_icon} className="w-5" alt="" />
          <p className="font-semibold text-gray-700 text-lg">
            Latest Bookings
          </p>
       </div>
       <div className='divide-y'>
        {dashboard.latestAppointments?.map((item,index)=>(
          <div className='flex items-center justify-between px-4 py-4 gap-3 hover:bg-gray-50 transition' key={index}>
            <img className='rounded-full w-10 h-10' src={item.docData?.image} alt="" />
             <div className="flex-1 ml-2 text-sm">
                <p className="font-medium text-gray-800">
                  {item.docData?.name}
                </p>
                <p className="text-gray-500 text-[13px]">
                  {formatDate(item.slotDate)}
                </p>
              </div>
             {item.cancelled ? (
                <p className="text-red-500 font-medium text-sm">Cancelled</p>
              ) : (
                <img
                  onClick={() => {
                    if (
                      window.confirm("Are you sure you want to cancel this appointment?")
                    ) {
                      dispatch(cancelAppointment(item._id));
                    }
                  }}
                  className="w-9 cursor-pointer hover:scale-110 transition"
                  src={assets.cancel_icon}
                  alt="cancel"
                />
              )}
          </div>
        ))}
       </div>
     </div>
    </div>
  )
}

export default Dashboard