import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./app/appSlice";
import adminReducer from "./admin/adminSlice";
import doctorReducer from "./doctor/doctorSlice";

const store = configureStore({
  reducer: {
    app: appReducer,
    admin: adminReducer,
    doctor: doctorReducer,
  },
});

export default store;
