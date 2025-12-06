import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { assets } from '../assets/assets';
import { clearAToken } from '../redux/app/appSlice';
import { useNavigate } from 'react-router-dom';
import { logoutDoctor } from '../redux/doctor/doctorSlice';

const Navbar = () => {
  const aToken = useSelector((state) => state.app.aToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearAToken());
    dispatch(logoutDoctor())
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center px-6 sm:px-12 py-4 border-b bg-white shadow-sm">
      
      {/* Logo + Role */}
      <div className="flex items-center gap-3">
        <img
          className="w-32 sm:w-40 cursor-pointer"
          src={assets.admin_logo}
          alt="Admin Logo"
        />
        <p className="text-gray-700 font-semibold text-sm sm:text-base">
          {aToken ? "Admin Panel" : "Doctor Panel"}
        </p>
      </div>

    
      <button
        onClick={handleLogout} className="px-4 py-2 bg-red-500 cursor-pointer text-white rounded-md text-sm font-medium  hover:bg-red-600 transition-all shadow-md active:scale-95"
      >
        Logout
      </button>

    </div>
  );
};

export default Navbar;
