import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAToken } from "../redux/app/appSlice"; 
import { setDoctorToken } from "../redux/doctor/doctorSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const backendUrl = useSelector((store) => store.app.backendUrl);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
    
      if (state === "Admin") {
        const res = await axios.post(backendUrl + "api/admin/login", {
          email,
          password,
        });

        if (res.data.success) {
          toast.success("Admin Login Successful");
          dispatch(setAToken(res.data.token)); 
          sessionStorage.setItem("aToken", res.data.token); 
           navigate('/doctor-list')
        } else {
          toast.error(res.data.message);
        }
      }

      // ---------------- DOCTOR LOGIN ----------------
      if (state === "Doctor") {
        const res = await axios.post(backendUrl + "api/doctor/login", {
          email,
          password,
        });

        if (res.data.success) {
          toast.success("Doctor Login Successful");
          dispatch(setDoctorToken(res.data.token));
          sessionStorage.setItem("doctorToken", res.data.token); 
           navigate('/doctor-profile')
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Server Error");
    }
  };

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={handleLogin}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5e5e5e] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="ml-1 text-blue-600">{state}</span> Login
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-[#dadada] rounded w-full p-2 mt-1"
            type="email" placeholder="admin@doctor.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-[#dadada] rounded w-full p-2 mt-1"
            type="password" placeholder="admin123"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="bg-blue-600 text-white w-full py-2 rounded-md text-base cursor-pointer">
          Login
        </button>

        {state === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span
              className="cursor-pointer text-blue-600 underline"
              onClick={() => setState("Doctor")}
            >
              Click Here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              className="cursor-pointer text-blue-600 underline"
              onClick={() => setState("Admin")}
            >
              Click Here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
