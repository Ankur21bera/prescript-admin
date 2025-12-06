import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
  approveOfflinePayment,
  cancelAppointment,
  getAllAppointments,
} from "../../redux/app/appSlice";
import { X } from "lucide-react";
import moment from "moment";

const Allappointment = () => {
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.app?.appointments || []);
  const loading = useSelector((state) => state.app?.loading);
  const [approvedIds, setApprovedIds] = useState([]);

  useEffect(() => {
    dispatch(getAllAppointments());
  }, [dispatch]);

  const handleApprove = async (id) => {
    const res = await dispatch(approveOfflinePayment(id));
    if (res.payload) {
      setApprovedIds((prev) => [...prev, id]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleCancel = async (id) => {
    await dispatch(cancelAppointment(id));
  };

  const getAge = (dob) => moment().diff(moment(dob, "DD-MM-YYYY"), "years");

  if (loading)
    return <p className="p-4 text-center">Loading appointments...</p>;
  return (
    <div className="p-4 flex justify-center">
      <div className="w-full md:w-[1300px]">
        <div className="hidden md:block">
          <Table hoverable={true} striped={true}>
            <TableHead>
              <TableHeadCell>#</TableHeadCell>
              <TableHeadCell>Patient</TableHeadCell>
              <TableHeadCell>Age</TableHeadCell>
              <TableHeadCell>Date & Time</TableHeadCell>
              <TableHeadCell>Doctor</TableHeadCell>
              <TableHeadCell>Fees</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
              <TableHeadCell>Approve Offline Payment</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {appointments.map((appt, index) => (
                <TableRow key={appt._id} className="bg-white">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="flex items-center gap-3">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={appt.userData?.image}
                      alt=""
                    />
                    {appt.userData?.name}
                  </TableCell>
                  <TableCell>{getAge(appt.userData?.dob)} yrs</TableCell>
                  <TableCell>
                    {formatDate(appt.slotDate)} – {appt.slotTime}
                  </TableCell>
                  <TableCell className="flex items-center gap-3">
                    <img
                      className="w-10 h-10 object-cover rounded-full"
                      src={appt.docData?.image}
                      alt=""
                    />
                    {appt.docData?.name}
                  </TableCell>
                  <TableCell>₹{appt.amount}</TableCell>
                  <TableCell>
                    {appt.cancelled ? (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm">
                        Cancelled
                      </span>
                    ) : (
                      <Button
                        color="failure"
                        size="xs"
                        pill={true}
                        onClick={() => handleCancel(appt._id)}
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </TableCell>

                  <TableCell>
                    {appt.paymentMethod === "online" ? (
                      appt.paymentStatus === "pending" ? (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">
                          Pending
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                          Paid
                        </span>
                      )
                    ) : (
                      <>
                        {appt.paymentStatus === "requested" ? (
                          <Button
                            className="px-3 py-2 rounded-full bg-blue-500 text-white cursor-pointer"
                            size="xs"
                            onClick={() => handleApprove(appt._id)}
                          >
                            Approve
                          </Button>
                        ) : appt.payment === true ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                            Paid
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">
                            Pending
                          </span>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden flex flex-col items-center gap-4">
          {appointments.map((appt, index) => (
            <div
              key={appt._id}
              className="border rounded-lg ml-20 shadow-md w-full p-4 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">#{index + 1}</span>
                <Button color="failure" size="xs" pill={true}>
                  <X size={16} />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={appt.userData?.image}
                  alt={appt.userData?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{appt.userData?.name}</p>
                  <p className="text-gray-500">
                    {getAge(appt.userData?.dob)} yrs
                  </p>
                </div>
              </div>

              <p>
                <span className="font-semibold">Date:</span>{" "}
                {moment(appt.slotDate).format("DD MMM YYYY")}
              </p>
              <p>
                <span className="font-semibold">Time:</span> {appt.slotTime}
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={appt.docData?.image}
                  alt={appt.docData?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="font-semibold">{appt.docData?.name}</p>
              </div>

              <p>
                <span className="font-semibold">Fees:</span> ₹{appt.amount}
              </p>

              {appt.cancelled ? (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm">
                  Cancelled
                </span>
              ) : (
                <Button
                  color="failure"
                  size="xs"
                  pill={true}
                  onClick={() => handleCancel(appt._id)}
                >
                  <X size={16} />
                </Button>
              )}

              {/* Approve Offline Payment */}
              <div className="text-center mt-2">
                {/* ONLINE PAYMENT */}
                {appt.paymentMethod === "online" ? (
                  appt.paymentStatus === "pending" ? (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm">
                      Pending
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
                      Paid Online
                    </span>
                  )
                ) : (
                 
                  <>
                  
                    {appt.paymentStatus === "requested" ? (
                      <Button className="px-3 py-2 rounded-lg text-white bg-blue-600"
                        color="primary"
                        size="sm"
                        onClick={() => handleApprove(appt._id)}
                      >
                        Approve
                      </Button>
                    ) : appt.payment === true ? (
                    
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
                        Paid
                      </span>
                    ) : (
                    
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm">
                        Pending
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Allappointment;
