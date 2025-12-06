import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { Menu } from "lucide-react";

const Sidebar = () => {
  const aToken = useSelector((state) => state.app.aToken);
  const doctorToken = useSelector((state) => state.doctor.token);

  const [open, setOpen] = useState(false);

 
  if (!aToken && !doctorToken) return null;

  const menuItemClasses = (isActive, color = "blue") =>
    `flex items-center gap-3 py-3 px-6  cursor-pointer rounded-r-full 
     transition-all duration-200
     ${isActive ? `bg-${color}-50 border-r-4 border-${color}-600` : "hover:bg-gray-100"}
    `;

  return (
    <>
     
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
        onClick={() => setOpen(!open)}
      >
        <Menu />
      </button>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-[1500px] w-[260px] bg-white border-r shadow-lg z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:block
        `}
      >
        <ul className="pt-16 md:pt-4">
          {/* ---------------- ADMIN MENU ---------------- */}
          {aToken && (
            <>
              <NavLink
                to="/admin-dashboard"
                className={({ isActive }) => menuItemClasses(isActive, "blue")}
                onClick={() => setOpen(false)}
              >
                <img className="w-5" src={assets.home_icon} alt="" />
                <p className="text-sm font-medium text-gray-700">Dashboard</p>
              </NavLink>

              <NavLink
                to="/all-appointments"
                className={({ isActive }) => menuItemClasses(isActive, "blue")}
                onClick={() => setOpen(false)}
              >
                <img className="w-5" src={assets.appointment_icon} alt="" />
                <p className="text-sm font-medium text-gray-700">Appointments</p>
              </NavLink>

              <NavLink
                to="/add-doctors"
                className={({ isActive }) => menuItemClasses(isActive, "blue")}
                onClick={() => setOpen(false)}
              >
                <img className="w-5" src={assets.add_icon} alt="" />
                <p className="text-sm font-medium text-gray-700">Add Doctors</p>
              </NavLink>

              <NavLink
                to="/doctor-list"
                className={({ isActive }) => menuItemClasses(isActive, "blue")}
                onClick={() => setOpen(false)}
              >
                <img className="w-5" src={assets.people_icon} alt="" />
                <p className="text-sm font-medium text-gray-700">Doctor List</p>
              </NavLink>
            </>
          )}

          {/* ---------------- DOCTOR MENU ---------------- */}
          {doctorToken && (
            <>
              <NavLink
                to="/doctor-dashboard"
                className={({ isActive }) => menuItemClasses(isActive, "green")}
                onClick={() => setOpen(false)}
              >
                <img className="w-5" src={assets.home_icon} alt="" />
                <p className="text-sm font-medium text-gray-700">Dashboard</p>
              </NavLink>

              <NavLink
                to="/doctor-appointment"
                className={({ isActive }) => menuItemClasses(isActive, "green")}
                onClick={() => setOpen(false)}
              >
                <img className="w-5" src={assets.appointment_icon} alt="" />
                <p className="text-sm font-medium text-gray-700">Appointments</p>
              </NavLink>

              <NavLink
                to="/doctor-profile"
                className={({ isActive }) => menuItemClasses(isActive, "green")}
                onClick={() => setOpen(false)}
              >
                <img className="w-5" src={assets.people_icon} alt="" />
                <p className="text-sm font-medium text-gray-700">My Profile</p>
              </NavLink>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
