import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Modal, Button, Spinner, ModalHeader, ModalBody } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Adddoctor = () => {
 
  const { backendUrl, aToken } = useSelector((state) => state.app);
  console.log(backendUrl)

  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [speciality, setSpeciality] = useState('General physician');
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const resetForm = () => {
    setDocImg(false);
    setName('');
    setEmail('');
    setPassword('');
    setExperience('1 Year');
    setFees('');
    setAbout('');
    setSpeciality('General physician');
    setDegree('');
    setAddress1('');
    setAddress2('');
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!docImg) return toast.error('Please select the image');

    setLoading(true);

    setTimeout(async () => {
      try {
        const formData = new FormData();
        formData.append('image', docImg);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('experience', experience);
        formData.append('fees', fees);
        formData.append('about', about);
        formData.append('speciality', speciality);
        formData.append('degree', degree);
        formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

        const { data } = await axios.post(`${backendUrl}api/admin/add`,formData,
         {
         headers: {
         Authorization: `Bearer ${aToken}`,
         },
         }
        );

        if (data.success) {
          setShowModal(true);
        } else {
          toast.error(data.message);
        }

      } catch (error) {
        console.error(error);
        toast.error('Failed to add doctor');
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  return (
    <>
      <form onSubmit={onSubmitHandler} className="m-2 sm:m-5 w-full">
        <p className="mb-3 text-lg font-medium">Add Doctor</p>

        <div className="bg-white px-4 sm:px-8 py-6 border rounded w-full max-w-full sm:max-w-6xl max-h-[80vh] overflow-y-auto">

          {/* Upload Section */}
          <div className="flex items-center gap-4 mb-6 text-gray-500">
            <label htmlFor="doc-img">
              <img
                className="w-16 h-16 object-cover bg-gray-100 rounded-full cursor-pointer"
                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                alt="Upload Doctor"
              />
            </label>
            <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
            <p className="text-sm">Upload Doctor <br /> picture</p>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-6 text-gray-600">
            <div className="w-full lg:flex-1 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p>Doctor Name</p>
                <input value={name} onChange={(e) => setName(e.target.value)} className="border rounded px-3 py-2 w-full" type="text" required placeholder="Name" />
              </div>

              <div className="flex flex-col gap-1">
                <p>Doctor Email</p>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded px-3 py-2 w-full" type="email" required placeholder="Email" />
              </div>

              <div className="flex flex-col gap-1">
                <p>Password</p>
                <input value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded px-3 py-2 w-full" type="password" required placeholder="Password" />
              </div>

              <div className="flex flex-col gap-1">
                <p>Experience</p>
                <select value={experience} onChange={(e) => setExperience(e.target.value)} className="border rounded px-3 py-2 w-full">
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={`${i + 1} Year`}>{i + 1} Year</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <p>Fees</p>
                <input value={fees} onChange={(e) => setFees(e.target.value)} className="border rounded px-3 py-2 w-full" type="number" required placeholder="Fees" />
              </div>
            </div>

            <div className="w-full lg:flex-1 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p>Speciality</p>
                <select value={speciality} onChange={(e) => setSpeciality(e.target.value)} className="border rounded px-3 py-2 w-full">
                  <option value="General physician">General physician</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatricians">Pediatricians</option>
                  <option value="Neurologist">Neurologist</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <p>Education</p>
                <input value={degree} onChange={(e) => setDegree(e.target.value)} className="border rounded px-3 py-2 w-full" type="text" required placeholder="Education" />
              </div>

              <div className="flex flex-col gap-1">
                <p>Address</p>
                <input value={address1} onChange={(e) => setAddress1(e.target.value)} className="border rounded px-3 py-2 w-full" type="text" required placeholder="Address 1" />
                <input value={address2} onChange={(e) => setAddress2(e.target.value)} className="border rounded px-3 py-2 w-full" type="text" required placeholder="Address 2" />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2">About Doctor</p>
            <textarea value={about} onChange={(e) => setAbout(e.target.value)} className="w-full px-4 pt-2 border rounded" rows={5} required placeholder="Write About Doctor" />
          </div>

          <button type="submit" disabled={loading} className="bg-primary-600 cursor-pointer w-full sm:w-fit px-8 py-3 mt-6 text-white rounded-full text-center">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size="sm" />
                Adding Doctor...
              </span>
            ) : (
              'Add Doctor'
            )}
          </button>
        </div>
      </form>

      <Modal show={showModal} onClose={() => setShowModal(false)} size="md" popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-700">Doctor Added Successfully!</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className='cursor-pointer' onClick={() => {
                setShowModal(false);
                navigate("/doctor-list");
              }}>
                View Doctor
              </Button>
              <Button className='cursor-pointer' color="gray" onClick={() => {
                resetForm();
                setShowModal(false);
              }}>
                Add Another Doctor
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Adddoctor;
