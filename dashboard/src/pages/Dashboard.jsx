/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { toast } from "react-toastify";
// import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { isAuthenticated, user } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  //   /api/v1/appointment/all

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  // http://localhost:3000/api/v1/appointment/all

  //  firstName,lastName,email,phone,dob,gender,appointment_date,department,doctor_firstName,doctor_lastName,hasVisited,address,

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/api/v1/appointment/all`, {
          withCredentials: true,
        });
        setAppointments(data.appointements);
        console.log(data.message);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAppointment();
  }, [isAuthenticated]);

  useEffect(() => {
    // http://localhost:3000/api/v1/user/allDoc
    const fetchDoctors = async () => {
      const { data } = await axios.get(`${baseURL}/api/v1/user/allDoc`, {
        withCredentials: true,
      });
      setDoctors(data.users || []);
      console.log(data.users);
    };
    fetchDoctors();
  }, [isAuthenticated]);

  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `${baseURL}/api/v1/appointment/update/${appointmentId}`,
        {
          status,
        },
        {
          withCredentials: true,
        },
      );
      console.log(data.message);
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: status }
            : appointment,
        ),
      );
      toast.success("Appointment status updated successfully", data.message);
      // Optionally, you can refresh the appointments list or update the specific appointment in state
    } catch (error) {
      console.log(error);
      toast.error("Failed to update appointment status", error.message);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="space-y-8 bg-slate-50 p-6 rounded-xl">
      {/* ================= TOP SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* WELCOME CARD */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-6 flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0 bg-blue-50 rounded-xl p-4">
            <img
              src="/doc.png"
              alt="dashboard"
              className="w-20 h-20 object-contain"
            />
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-slate-500 text-sm">Welcome back,</p>
              {user && (
                <h5 className="text-2xl font-semibold text-slate-900">
                  {user.role === "doctor" ? "Dr." : "Admin"} {user.firstName}
                </h5>
              )}
            </div>

            <p className="text-slate-600 max-w-xl">
              This is your hospital dashboard. Monitor doctors, appointments,
              and patient activity from one secure place.
            </p>
          </div>
        </div>

        {/* KPI: DOCTORS */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <p className="text-slate-500 text-sm">Total Doctors</p>
          <h3 className="mt-2 text-3xl font-bold text-blue-600">
            {totalDoctors}
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Active registered doctors
          </p>
        </div>

        {/* KPI: APPOINTMENTS */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <p className="text-slate-500 text-sm">Total Appointments</p>
          <h3 className="mt-2 text-3xl font-bold text-blue-600">
            {totalAppointments}
          </h3>
          <p className="mt-1 text-xs text-slate-400">Scheduled appointments</p>
        </div>
      </div>

      {/* ================= RECENT APPOINTMENTS ================= */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-lg font-semibold text-slate-900">
            Recent Appointments
          </h5>
          <span className="text-sm text-slate-500">Last 5 entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-slate-600">
                <th className="py-3 px-2">Patient</th>
                <th className="py-3 px-2">Doctor</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Department</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-center">Visited</th>
              </tr>
            </thead>

            <tbody>
              {appointments && appointments.length > 0 ? (
                appointments.slice(0, 5).map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="border-b last:border-none hover:bg-slate-50 transition"
                  >
                    <td className="py-3 px-2 font-medium text-slate-900">
                      {appointment.firstName} {appointment.lastName}
                    </td>

                    <td className="py-3 px-2 text-slate-700">
                      Dr. {appointment.doctor.firstName}{" "}
                      {appointment.doctor.lastName}
                    </td>

                    <td className="py-3 px-2 text-slate-700">
                      {new Date(
                        appointment.appointment_date,
                      ).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-2 text-slate-700">
                      {appointment.department}
                    </td>

                    <td className="py-3 px-2">
                      <select
                        value={appointment.status}
                        onChange={(e) =>
                          handleUpdateStatus(appointment._id, e.target.value)
                        }
                        className={`h-9 rounded-lg px-3 text-sm border focus:outline-none
                        ${
                          appointment.status === "Pending"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                            : appointment.status === "Cancelled"
                              ? "bg-red-50 text-red-700 border-red-300"
                              : "bg-green-50 text-green-700 border-green-300"
                        }
                      `}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>

                    <td className="py-3 px-2 text-center text-xl">
                      {appointment.hasVisited ? (
                        <GoCheckCircleFill className="text-green-600" />
                      ) : (
                        <AiFillCloseCircle className="text-red-500" />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-500">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
