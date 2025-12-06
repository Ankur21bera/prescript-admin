import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorProfile, updateDoctorProfile } from '../../redux/doctor/doctorSlice';
import toast from 'react-hot-toast';
import { Card, Label, TextInput, Button, Select } from 'flowbite-react';

const Doctorprofile = () => {
  const dispatch = useDispatch();
  const { token, doctorData, loading } = useSelector((state) => state.doctor);

  const [fees, setFees] = useState('');
  const [available, setAvailable] = useState(false);
  const [addess, setAddress] = useState({ line1: "", line2: "" });

  useEffect(() => {
    if (token) {
      dispatch(fetchDoctorProfile());
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (doctorData) {
      setFees(doctorData.fees || "");
      setAvailable(doctorData.available || false);
      setAddress(doctorData.addess || { line1: "", line2: "" });
    }
  }, [doctorData]);

  if (loading || !doctorData)
    return <div className="text-center p-8">Loading...</div>;

  const { image, name, degree, experience, speciality, about, email } = doctorData;

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedFields = { fees, available, addess };
    await dispatch(updateDoctorProfile(updatedFields));
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-8">
      <div className="w-full max-w-4xl">

        {/* Profile Card */}
        <Card className="shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">

            {/* Doctor Image */}
            <img
              className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
              src={image}
              alt="doctor"
            />

            {/* Doctor Info */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">{name}</h2>
              <p className="text-gray-600">{degree} | {speciality}</p>
              <p className="text-gray-600">{experience} Experience</p>
              <p className={`mt-2 font-semibold ${available ? "text-green-600" : "text-red-600"}`}>
                {available ? "Available for Appointments" : "Not Available"}
              </p>
            </div>

          </div>

          {/* About */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold">About</h3>
            <p className="text-gray-700 mt-2">{about}</p>
          </div>

          {/* Contact Info */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Contact Information</h3>
            <p className="text-gray-700 mt-1">Email: {email}</p>
            <p className="text-gray-700 mt-1">
              Address: {addess?.line1}, {addess?.line2}
            </p>
          </div>

          {/* Fees */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Consultation Fees</h3>
            <p className="text-gray-700 mt-1">₹{fees}</p>
          </div>

        </Card>

        {/* Update Form */}
        <Card className="mt-8 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Update Profile</h3>

          <form onSubmit={handleUpdate} className="space-y-5">

            {/* Fees */}
            <div>
              <Label value="Fees (₹)" />
              <TextInput
                type="number"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                required
              />
            </div>

            {/* Availability */}
            <div>
              <Label value="Availability" />
              <Select
                value={available ? "true" : "false"}
                onChange={(e) => setAvailable(e.target.value === "true")}
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </Select>
            </div>

            {/* Address Line 1 */}
            <div>
              <Label value="Address Line 1" />
              <TextInput
                type="text" placeholder='address1'
                value={addess.line1}
                onChange={(e) => setAddress({ ...addess, line1: e.target.value })}
               
              />
            </div>

            {/* Address Line 2 */}
            <div>
              <Label value="Address Line 2" />
              <TextInput
                type="text" placeholder='address2'
                value={addess.line2}
                onChange={(e) => setAddress({ ...addess, line2: e.target.value })}
               
              />
            </div>

            <Button type="submit" color="blue" className="w-full md:w-auto">
              Update Profile
            </Button>

          </form>
        </Card>
      </div>
    </div>
  );
};

export default Doctorprofile;
