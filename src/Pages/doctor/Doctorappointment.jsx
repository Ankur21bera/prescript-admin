import React, { useEffect } from "react";
import {
  Badge,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import {
  cancelAppointment,
  completeAppointment,
  fetchAllAppointments,
} from "../../redux/doctor/doctorSlice";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const DoctorAppointment = () => {
  const dispatch = useDispatch();

  const { appointments, token, loading, error } = useSelector(
    (state) => state.doctor
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchAllAppointments());
    }
  }, [token, dispatch]);

 const handleComplete = (id) => {
  toast.success("Appointment marked as completed!", {
    position: "top-center",
  });

  dispatch(completeAppointment(id));
  setTimeout(() => {
    window.location.reload();
  }, 800);
};

  const handleCancel = (id) => {
  toast.success("Appointment marked as cancel!", {
    position: "top-center",
  });

  dispatch(cancelAppointment(id));

  // Reload after action
  setTimeout(() => {
    window.location.reload();
  }, 800);
};


  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate()))
      age--;
    return `${age}yrs`;
  };

  const formatSlot = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return "N/A";
    const date = new Date(dateStr);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return `${date.getDate()} ${month}, ${timeStr}`;
  };

  const Currency = "₹";

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-3">All Appointments</h2>
      {loading && <p className="text-blue-600 mb-2">Loading...</p>}
      {error && <p className="text-red-500 mb-2">Error:(error)</p>}
      <div className="hidden sm:block rounded-lg shadow h-auto">
        <Table striped>
          <TableHead>
            <TableHeadCell>#</TableHeadCell>
            <TableHeadCell>Patient</TableHeadCell>
            <TableHeadCell>Payment</TableHeadCell>
            <TableHeadCell>Age</TableHeadCell>
            <TableHeadCell>Date & Time</TableHeadCell>
            <TableHeadCell>Fees</TableHeadCell>
            <TableHeadCell>Action</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {appointments?.length > 0 ? (
              appointments.map((item, index) => (
                <TableRow key={item._id} className="bg-white">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={item.userData?.image}
                        onError={(e) =>
                          (e.target.src = assets.default_user_icon)
                        }
                        alt=""
                      />
                      {item.userData?.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-white">
                      {item.payment ? "Online" : "Cash"}
                    </Badge>
                  </TableCell>
                  <TableCell>{calculateAge(item.userData?.dob)}</TableCell>
                  <TableCell>
                    {formatSlot(item.slotDate, item.slotTime)}
                  </TableCell>
                  <TableCell>
                    {Currency}
                    {item.amount}
                  </TableCell>
                  <TableCell>
                    {item.cancelled ? (
                      <Badge color="failure">Cancelled</Badge>
                    ) : item.isCompleted ? (
                      <Badge color="success">Completed</Badge>
                    ) : (
                      <div className="flex">
                       
                          <img onClick={()=>handleCancel(item._id)}
                            className="w-10 h-10 ml-2 cursor-pointer"
                            src={assets.cancel_icon}
                            alt=""
                          />
                          <img onClick={()=>handleComplete(item._id)}
                            className="w-10 h-10 mr-2 cursor-pointer"
                            src={assets.tick_icon}
                            alt=""
                          />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <p></p>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="sm:hidden flex flex-col gap-4 mt-4">
        {appointments?.length > 0 ? (
          appointments.map((item, index) => (
            <Card key={item._id} className="p-3 shadow">
              <div className="flex items-center gap-3">
                <img
                  src={item.userData?.image}
                  className="w-10 h-10 rounded-full"
                  onError={(e) => (e.target.src = assets.default_user_icon)}
                />
                <div>
                  <p className="font-semibold">{item.userData?.name}</p>
                  <p className="text-xs text-gray-500">#{index + 1}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <p>
                  <span className="font-semibold">Payment:</span>{" "}
                  {item.payment ? "Online" : "Cash"}
                </p>

                <p>
                  <span className="font-semibold">Age:</span>{" "}
                  {calculateAge(item.userData?.dob)}
                </p>

                <p className="col-span-2">
                  <span className="font-semibold">Date & Time:</span>{" "}
                  {formatSlot(item.slotDate, item.slotTime)}
                </p>

                <p>
                  <span className="font-semibold">Fees:</span> {Currency}
                  {item.amount}
                </p>
              </div>

            
              <div className="mt-3 flex gap-2">
                {item.cancelled ? (
                  <Badge color="failure">Cancelled</Badge>
                ) : item.isCompleted ? (
                  <Badge color="success">Completed</Badge>
                ) : (
                  <>
                    <Button
                      color="failure"
                      size="xs"
                      onClick={() => handleCancel(item._id)}
                      className="w-full"
                    >
                      <img src={assets.cancel_icon} alt="" />
                    </Button>

                    <Button
                      color="success"
                      size="xs"
                      onClick={() => handleComplete(item._id)}
                      className="w-full"
                    >
                      <img src={assets.tick_icon} alt="" />
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">
            No appointments found.
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointment;
