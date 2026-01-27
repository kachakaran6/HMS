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
    <section className="space-y-8">
      {/* 🔹 TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* First Box */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6 flex flex-col sm:flex-row gap-6">
          <img
            src="/doc.png"
            alt="dashboard"
            className="w-28 h-28 object-contain"
          />

          <div className="space-y-2">
            <div>
              <p className="text-slate-500">Hello,</p>
              <h5 className="text-xl font-semibold text-slate-900">
                {user?.firstName || "Admin"}
              </h5>
            </div>

            <p className="text-slate-600 max-w-xl">
              Welcome to the Hospital Management System Dashboard. Manage
              doctors, patients, appointments and messages from here.
            </p>
          </div>
        </div>

        {/* Second Box */}
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-slate-500">Total Doctors</p>
          <h3 className="text-3xl font-bold text-slate-900">{totalDoctors}</h3>
        </div>

        {/* Third Box */}
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-slate-500">Total Appointments</p>
          <h3 className="text-3xl font-bold text-slate-900">
            {totalAppointments}
          </h3>
        </div>
      </div>

      {/* 🔹 RECENT APPOINTMENTS */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h5 className="text-lg font-semibold mb-4">Recent Appointments</h5>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="py-3">Patient</th>
                <th className="py-3">Doctor</th>
                <th className="py-3">Date</th>
                <th className="py-3">Department</th>
                <th className="py-3">Status</th>
                <th className="py-3">Visited</th>
              </tr>
            </thead>

            <tbody>
              {appointments && appointments.length > 0 ? (
                appointments.slice(0, 5).map((appointment) => {
                  // const statusText = appointment.hasVisited
                  //   ? "Accepted"
                  //   : "Pending";

                  // const statusClass = appointment.hasVisited
                  //   ? "value-accepted"
                  //   : "value-pending";

                  return (
                    <tr
                      key={appointment._id}
                      className="border-b last:border-none"
                    >
                      <td className="py-3">
                        {appointment.firstName} {appointment.lastName}
                      </td>

                      <td className="py-3">
                        Dr. {appointment.doctor.firstName}{" "}
                        {appointment.doctor.lastName}
                      </td>

                      <td className="py-3">
                        {new Date(
                          appointment.appointment_date,
                        ).toLocaleDateString()}
                      </td>

                      <td className="py-3">{appointment.department}</td>

                      <td className="py-3">
                        <select
                          className={`
                          px-3 py-1 rounded-lg text-sm border
                          ${
                            appointment.status === "Pending"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                              : appointment.status === "Cancelled"
                                ? "bg-red-50 text-red-700 border-red-300"
                                : "bg-green-50 text-green-700 border-green-300"
                          }
                        `}
                          value={appointment.status}
                          onChange={(e) =>
                            handleUpdateStatus(appointment._id, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>

                      {/* <td className={statusClass}>{statusText}</td> */}
                      {/* <td>{appointment.hasVisited ? "Yes" : "No"}</td> */}
                      <td className="py-3 text-xl">
                        {appointment.hasVisited === true ? (
                          <GoCheckCircleFill className="text-green-600" />
                        ) : (
                          <AiFillCloseCircle className="text-red-500" />
                        )}
                      </td>
                    </tr>
                  );
                })
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
