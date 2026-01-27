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
    <section className="page dashboard">
      {/* 🔹 TOP BANNER */}
      <div className="banner">
        {/* First Box */}
        <div className="firstBox">
          <img src="/doc.png" alt="dashboard" />
          <div className="content">
            <div>
              <p>Hello,</p>
              <h5>{user?.firstName || "Admin"}</h5>
            </div>
            <p>
              Welcome to the Hospital Management System Dashboard. Manage
              doctors, patients, appointments and messages from here.
            </p>
          </div>
        </div>

        {/* Second Box */}
        <div className="secondBox">
          <p>Total Doctors</p>
          <h3>{totalDoctors}</h3>
        </div>

        {/* Third Box */}
        <div className="thirdBox">
          <p>Total Appointments</p>
          <h3>{totalAppointments}</h3>
        </div>
      </div>

      {/* 🔹 BOTTOM BANNER */}
      <div className="banner">
        <h5>Recent Appointments</h5>

        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Department</th>
              <th>Status</th>
              <th>Visited</th>
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
                  <tr key={appointment._id}>
                    <td>
                      {appointment.firstName} {appointment.lastName}
                    </td>

                    <td>
                      Dr. {appointment.doctor.firstName}{" "}
                      {appointment.doctor.lastName}
                    </td>

                    <td>
                      {new Date(
                        appointment.appointment_date,
                      ).toLocaleDateString()}
                    </td>

                    <td>{appointment.department}</td>
                    <td>
                      <select
                        className={
                          appointment.status === "Pending"
                            ? "value-pending"
                            : appointment.status === "Cancelled"
                              ? "value-rejected"
                              : appointment.status === "Confirmed" ||
                                  appointment.status === "Completed"
                                ? "value-accepted"
                                : ""
                        }
                        value={appointment.status}
                        onChange={(e) =>
                          handleUpdateStatus(appointment._id, e.target.value)
                        }
                      >
                        <option value="Pending" className="value-pending">
                          Pending
                        </option>

                        <option value="Confirmed" className="value-accepted">
                          Confirmed
                        </option>

                        <option value="Cancelled" className="value-rejected">
                          Cancelled
                        </option>

                        <option value="Completed" className="value-accepted">
                          Completed
                        </option>
                      </select>
                    </td>

                    {/* <td className={statusClass}>{statusText}</td> */}
                    {/* <td>{appointment.hasVisited ? "Yes" : "No"}</td> */}
                    <td>
                      {appointment.hasVisited === true ? (
                        <GoCheckCircleFill />
                      ) : (
                        <AiFillCloseCircle />
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4">No appointments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Dashboard;
