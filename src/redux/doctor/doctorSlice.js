import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';



const storedToken = sessionStorage.getItem("doctorToken");
const BASE_URL = "https://prescript-backend-1.onrender.com/api/doctor";


export const fetchAllAppointments = createAsyncThunk(
  "doctor/fetchAllAppointments",
  async(_,{getState,rejectWithValue}) => {
    try {
      const {token} = getState().doctor;
      const res = await axios.get(`${BASE_URL}/all-appointment`,{
        headers:{Authorization:`Bearer ${token}`}
      });
      console.log(res.data.appointments);
      return res.data.appointments
    } catch (error) {
      console.error("Error fetching appointments:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
)

export const completeAppointment = createAsyncThunk(
  "doctor/completeAppointment",
  async (appointmentId,{getState,rejectWithValue}) => {
    try {
      const {token} = getState().doctor;
      const res = await axios.post(`${BASE_URL}/complete-appointment`,{appointmentId},{
        headers:{Authorization:`Bearer ${token}`}
      })
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.error("Error completing appointment:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
)

export const cancelAppointment = createAsyncThunk(
  "doctor/cancelAppointment",
  async (appointmentId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().doctor;
      console.log("Cancelling appointment:", appointmentId);
      const res = await axios.post(
        `${BASE_URL}/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Appointment cancelled response:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error cancelling appointment:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const FetchDashboard = createAsyncThunk(
  "doctor/fetchDashboard",
  async(_,{getState,rejectWithValue})=>{
     try {
      const { token } = getState().doctor;

      const res = await axios.get(`${BASE_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data;
    } catch (error) {
      console.error("Dashboard fetch error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
) 


export const fetchDoctorProfile = createAsyncThunk(
  "doctor/fetchDoctorProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().doctor;

      const res = await axios.get(`${BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.profileData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateDoctorProfile = createAsyncThunk(
  "doctor/updateDoctorProfile",
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().doctor;

      const res = await axios.put(`${BASE_URL}/update-profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const doctorSlice = createSlice({
  name: "doctor",
  initialState: {
    token: storedToken ? storedToken : null,
    doctorData: null,
    appointments: [],
    dashboard: {
    earnings: 0,
    appointments: 0,
    patients: 0,
    latestAppointments: [],
  },

  loading: false,
  error: null, 
  },

  reducers: {
    setDoctorToken: (state, action) => {
      state.token = action.payload;
      sessionStorage.setItem("doctorToken", action.payload);
    },

    logoutDoctor: (state) => {
      state.token = null;
      state.doctorData = null;
      sessionStorage.removeItem("doctorToken");
    },

    setDoctorData: (state, action) => {
      state.doctorData = action.payload;
    },
  },
  extraReducers:(builder) => {
     builder
      .addCase(fetchAllAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Fetching appointments...");
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
        console.log("Appointments stored in state:", state.appointments);
      })
      .addCase(fetchAllAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Fetch appointments failed:", state.error);
      })

      .addCase(completeAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Completing appointment...");
      })
      .addCase(completeAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex(
          (a) => a._id === action.payload.appointmentId
        );
        if (index !== -1) {
          state.appointments[index].isCompleted = true;
          state.appointments[index].cancelled = false;
          state.appointments[index].notifications = [
            { message: action.payload.notification, date: new Date(), read: false },
          ];
        }
        console.log("Appointment updated in state:", state.appointments[index]);
      })
      .addCase(completeAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Complete appointment failed:", state.error);
      })

      .addCase(cancelAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Cancelling appointment...");
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex(
          (a) => a._id === action.payload.appointmentId
        );
        if (index !== -1) {
          state.appointments[index].isCompleted = false;
          state.appointments[index].cancelled = true;
          state.appointments[index].notifications = [
            { message: action.payload.notification, date: new Date(), read: false },
          ];
        }
        console.log("Appointment cancelled in state:", state.appointments[index]);
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Cancel appointment failed:", state.error);
      });
     builder
  .addCase(FetchDashboard.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(FetchDashboard.fulfilled, (state, action) => {
    state.loading = false;
    state.dashboard = action.payload; 
    console.log("Dashboard updated:", state.dashboard);
  })
  .addCase(FetchDashboard.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
    console.error("Dashboard fetch failed:", state.error);
  });
  builder
      .addCase(fetchDoctorProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorData = action.payload;
      })
      .addCase(fetchDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
  });
  builder
      .addCase(updateDoctorProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDoctorProfile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  }
});

export const { setDoctorToken, logoutDoctor, setDoctorData } =
  doctorSlice.actions;

export default doctorSlice.reducer;
