import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeAvailability, deleteDoctor, getAllDoctors, updatedDoctor } from '../../redux/app/appSlice';
import { Button, Modal, ModalBody, Textarea, TextInput } from 'flowbite-react';
import { assets } from '../../assets/assets';

const Doctorlist = () => {
  const dispatch = useDispatch();
  const {doctors,aToken} = useSelector((state)=>state.app);
  const [showEditModal,setShowEditModal] = useState(false);
  const [selectedDoctors,setSelectedDoctors] = useState(null);
  const [docImg,setDocImg] = useState(null);

  const [form,setForm] = useState({
    name:"",
    email:"",
    speciality:"",
    degree:"",
    experience:"",
    fees:"",
    about:"",
    address1:"",
    address2:""
  })

  const openEditModal = (doctor) => {
    setSelectedDoctors(doctor);
    setForm({
      name:doctor.name,
      email: doctor.email,
      speciality: doctor.speciality,
      degree: doctor.degree,
      experience: doctor.experience,
      fees: doctor.fees,
      about: doctor.about,
      address1: doctor.address?.line1 || "",
      address2: doctor.address?.line2 || "",
    });
    setShowEditModal(true)
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if(docImg) formData.append("image",docImg);
    formData.append("name",form.name);
    formData.append("email",form.email);
    formData.append("speciality",form.speciality);
    formData.append("degree",form.degree);
    formData.append("experience",form.experience);
    formData.append("fees",form.fees);
    formData.append("about",form.about);
    formData.append("address",JSON.stringify({line1:form.address1,line2:form.address2}));
    dispatch(updatedDoctor({id:selectedDoctors._id,formData}));
    setShowEditModal(false);
  }
  useEffect(()=>{
    if(aToken) dispatch(getAllDoctors());
    window.scrollTo(0,0)
  },[aToken])
  return (
    <div className='m-5 max-h-[90vh]'>
     <h1 className='text-lg font-medium'>All Doctors</h1>
     <div className='w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6  gap-4 pt-5 gap-y-6'>
     {Array.isArray(doctors)&&doctors.map((item)=>(
      <div key={item._id} className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden  cursor-pointer group'>
      <img className='bg-indigo-50 group-hover:bg-blue-600 transition-all duration-500 w-full h-40 object-cover' src={item.image} alt="" />
      <div className='p-4'>
       <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
       <p className='text-zinc-600 text-sm'>{item.speciality}</p>
       <div className='mt-2 flex items-center gap-1 text-sm'>
        <input type="checkbox" checked={item.available} onChange={()=>dispatch(changeAvailability(item._id))} />
        <p>Available</p>
       </div>
       <div className='mt-4 flex gap-2'>
        <button onClick={()=>{if(window.confirm("Are You Want To Delete Doctor"))dispatch(deleteDoctor(item._id))}} className='px-3 cursor-pointer py-1 text-sm bg-red-100 text-red-700 rounded'>Delete</button>
        <button onClick={() => openEditModal(item)} className='px-3 py-1 cursor-pointer text-sm bg-blue-100 text-blue-700 rounded'>Edit</button>
       </div>
      </div>
      </div>
     ))}
     </div>
     {showEditModal && (
      <Modal show={showEditModal} onClose={()=>setShowEditModal(false)} size='xl' popup>
        <h1 className="text-center text-[30px] font-semibold">Edit Doctor</h1>
        <ModalBody className='mt-3'>
         <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleEditSubmit}>
          {["name","email","speciality","degree","experience","fees","address1","address2"].map((field)=>(
            <TextInput key={field} value={form[field]}  onChange={(e) => setForm({ ...form, [field]: e.target.value })} placeholder={field} />
          ))}
          <Textarea  onChange={(e) => setForm({ ...form, about: e.target.value })} rows={3} placeholder='About' value={form.about}/>
          <div className='col-span-2'>
          <label htmlFor="doc-img">
            <img className='w-16 h-16 rounded-full object-cover cursor-pointer' src={docImg? URL.createObjectURL(docImg):assets.upload_area} alt="" />
          </label>
          <input onChange={(e)=>setDocImg(e.target.files[0])} type="file" id='doc-img' hidden />
          </div>  
          <div className='col-span-2 flex justify-end gap-3 mt-4'>
           <Button className='cursor-pointer' color="gray" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button className='cursor-pointer' type="submit">Update Doctor</Button>
          </div>
         </form>
        </ModalBody>
      </Modal>
     )}
    </div>
  )
}

export default Doctorlist