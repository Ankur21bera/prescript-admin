import React from 'react'
import { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { FetchDashboard } from '../../redux/doctor/doctorSlice';
import {Badge, Button, Card, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from 'flowbite-react'
import { assets } from '../../assets/assets';
const Doctordashboard = () => {

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-us",{month:"short"});
    const year = date.getFullYear(); 
    return `${day} ${month} ${year}`;
  }

  const formatTime = (timeString) => {
    return timeString.toUpperCase()
  }

 
const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((state) => state.doctor);

  useEffect(() => {
    dispatch(FetchDashboard());
  }, [dispatch]);

  if (loading || !dashboard) {
    return <p className="p-4">Loading dashboard data...</p>;
  }


  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-6'>Doctor Dashboard</h2>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
       <Card className='flex flex-row items-center'>
         <img className='w-10 h-10' src={assets.earning_icon} alt="" />
          <p className="text-3xl font-bold text-green-700">
            ₹{dashboard.earnings}
          </p>
       </Card>
       <Card className='flex flex-row items-center'>
         <img className='w-10 h-10' src={assets.appointment_icon} alt="" />
          <p className="text-3xl font-bold text-green-700">
            {dashboard.appointments}
          </p>
       </Card>
       <Card className='flex flex-row items-center'>
         <img className='w-10 h-10' src={assets.patients_icon} alt="" />
          <p className="text-3xl font-bold text-green-700">
            {dashboard.patients}
          </p>
       </Card>
      </div>
      <div className='hidden sm:block bg-white p-4 rounded shadow'>
       <Table hoverable={true}>
        <TableHead>
          <TableHeadCell>Patient Name</TableHeadCell>
          <TableHeadCell>Amount</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
          <TableHeadCell>Date</TableHeadCell>
        </TableHead>
        <TableBody className='divide-y'>
          {dashboard.latestAppointments.map((apt, index) => (
        <TableRow key={index} className="bg-white">
          <TableCell>{apt.userData?.name}</TableCell>
          <TableCell>₹{apt.amount}</TableCell>
          <TableCell>
            <Badge color={apt.isCompleted ? "success" : "warning"}>
              {apt.isCompleted ? "Completed" : "Pending"}
            </Badge>
          </TableCell>
          <TableCell>
            {formatDate(apt.slotDate)}, {formatTime(apt.slotTime)}
          </TableCell>
        </TableRow>
      ))}
        </TableBody>
       </Table>
      </div>
      <div className="sm:hidden space-y-4">
  {dashboard.latestAppointments.map((apt, index) => (
    <div key={index} className="bg-white p-4 rounded shadow">
      <div className="mb-2">
        <span className="font-semibold">Patient:</span> {apt.userData?.name}
      </div>

      <div className="mb-2">
        <span className="font-semibold">Amount:</span> ₹{apt.amount}
      </div>

      <div className="mb-2 flex items-center gap-2">
        <span className="font-semibold">Status:</span>
        <Badge color={apt.isCompleted ? "success" : "warning"}>
          {apt.isCompleted ? "Completed" : "Pending"}
        </Badge>
      </div>

      <div>
        <span className="font-semibold">Date:</span>  
        {formatDate(apt.slotDate)}, {formatTime(apt.slotTime)}
      </div>
    </div>
  ))}
</div>
    </div>
  )
}

export default Doctordashboard