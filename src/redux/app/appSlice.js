import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const initialState = {
  aToken: sessionStorage.getItem("aToken") || null,
  backendUrl: "https://prescript-backend-1.onrender.com/",
  doctors: [],
  appointments: [],
  latestAppointments: [],
  loading: false,
};

export const getAllDoctors = createAsyncThunk(
  "doctor/getAll",
  async (_, { getState }) => {
    const { aToken, backendUrl } = getState().app;
    const response = await axios.get(`${backendUrl}api/admin/list`, {
      headers: { Authorization: `Bearer ${aToken}` },
    });
    return response.data.doctors;
  }
);

export const changeAvailability = createAsyncThunk(
  "doctor/changeAvailability",
  async (id, { getState }) => {
    const { aToken, backendUrl } = getState().app;

    const response = await axios.post(
      `${backendUrl}api/admin/change-availability`,
      { id },
      {
        headers: { Authorization: `Bearer ${aToken}` },
      }
    );

    toast.success("Availability Changed");
    return response.data.updatedDoctor;
  }
);

export const deleteDoctor = createAsyncThunk(
  "doctor/delete",
  async (id, { getState }) => {
    const { aToken, backendUrl } = getState().app;
    toast.success("Delete Successfully");
    await axios.delete(`${backendUrl}api/admin/delete-doctor/${id}`, {
      headers: { Authorization: `Bearer ${aToken}` },
    });
    return id;
  }
);

export const updatedDoctor = createAsyncThunk(
  "doctor/update",
  async ({ id, formData }, { getState }) => {
    const { aToken, backendUrl } = getState().app;

    const response = await axios.put(
      `${backendUrl}api/admin/update-doctor/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${aToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) toast.success("Update Successfully");

    return response.data.doctor;
  }
);

export const getAllAppointments = createAsyncThunk(
  "appointment/getAll",
  async (_, { getState }) => {
    const { aToken, backendUrl } = getState().app;

    const response = await axios.get(
      `${backendUrl}api/admin/list-appointment`,
      {
        headers: { Authorization: `Bearer ${aToken}` },
      }
    );

    console.log("Appointments Response:", response.data);

    return response.data.appointments;
  }
);

export const approveOfflinePayment = createAsyncThunk(
  "appointment/approveOffline",
  async (appointmentId, { getState }) => {
    const { aToken, backendUrl } = getState().app;

    const response = await axios.post(
      `${backendUrl}api/admin/approve-online`,
      { appointmentId },
      {
        headers: { Authorization: `Bearer ${aToken}` },
      }
    );

    console.log("Approve Offline:", response.data);

    if (response.data.success) {
      toast.success("Offline Payment Approved");
    } else {
      toast.error(response.data.message);
    }

    return response.data.appointment;
  }
);

export const cancelAppointment = createAsyncThunk(
  "appointment/cancel",
  async (appointmentId, { getState }) => {
    const { aToken, backendUrl } = getState().app;
    const response = await axios.post(
      `${backendUrl}api/admin/cancel-appointment`,
      { appointmentId },
      {
        headers: { Authorization: `Bearer ${aToken}` },
      }
    );
    if (response.data.success) {
      toast.success("Appointment Cancelled");
    } else {
      toast.error("response.data.message");
    }
    return response.data.appointment;
  }
);

export const getAdminDashboard = createAsyncThunk(
  "admin/dashboard",
  async(_,{getState}) => {
    const {aToken,backendUrl} = getState().app;
    const response = await axios.get(`${backendUrl}api/admin/dashboard`,{
      headers:{Authorization:`Bearer ${aToken}`}
    });
    console.log(response.data);
    return response.data.data
  }
)

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAToken: (state, action) => {
      state.aToken = action.payload;
      sessionStorage.setItem("aToken", action.payload);
    },
    clearAToken: (state) => {
      state.aToken = null;
      sessionStorage.removeItem("aToken");
    },
    setDoctors: (state, action) => {
      state.doctors = action.payload;
    },
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Doctor Reducers
    builder
      .addCase(getAllDoctors.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
        state.loading = false;
      })
      .addCase(changeAvailability.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;

        state.doctors = state.doctors.map((d) =>
          d._id === updated._id ? updated : d
        );
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.doctors = state.doctors.filter((d) => d._id !== action.payload);
      })
      .addCase(updatedDoctor.fulfilled, (state, action) => {
        const updated = action.payload;
        state.doctors = state.doctors.map((d) =>
          d._id === updated._id ? updated : d
        );
      });
    builder

      .addCase(getAllAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })

      .addCase(approveOfflinePayment.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;

        state.appointments = state.appointments.map((apt) =>
          apt._id === updated._id ? updated : apt
        );
      })

      .addCase(cancelAppointment.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;

        state.appointments = state.appointments.map((apt) =>
          apt._id === updated._id ? updated : apt
        );
      });
      builder
  .addCase(getAdminDashboard.pending, (state) => {
    state.loading = true;
  })
  .addCase(getAdminDashboard.fulfilled, (state, action) => {
    state.loading = false;
    console.log("Dashboard Saved in Redux:", action.payload);

    state.dashboard = action.payload;
  });
  },
});

export const { setAToken, clearAToken, setDoctors, setAppointments } =
  appSlice.actions;
export default appSlice.reducer;
