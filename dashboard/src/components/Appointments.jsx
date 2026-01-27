import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Appointments = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");

  // 🔹 FETCH APPOINTMENTS
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/api/v1/appointment/all`, {
          withCredentials: true,
        });
        setAppointments(data.appointements || []);
      } catch (error) {
        toast.error("Failed to fetch appointments", error.message);
      }
    };

    fetchAppointments();
  }, [baseURL]);

  // 🔹 FILTER + SEARCH + SORT
  const filteredAppointments = appointments
    .filter((a) => {
      const query = search.toLowerCase();
      return (
        a.firstName.toLowerCase().includes(query) ||
        a.lastName.toLowerCase().includes(query) ||
        a.department.toLowerCase().includes(query) ||
        a.doctor?.firstName?.toLowerCase().includes(query) ||
        a.doctor?.lastName?.toLowerCase().includes(query)
      );
    })
    .filter((a) => (statusFilter ? a.status === statusFilter : true))
    .sort((a, b) => {
      if (sortOrder === "latest") {
        return new Date(b.appointment_date) - new Date(a.appointment_date);
      }
      return new Date(a.appointment_date) - new Date(b.appointment_date);
    });

  // 🔹 UPDATE STATUS
  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      await axios.put(
        `${baseURL}/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true },
      );

      setAppointments((prev) =>
        prev.map((a) => (a._id === appointmentId ? { ...a, status } : a)),
      );

      toast.success("Appointment updated");
    } catch {
      toast.error("Failed to update appointment");
    }
  };

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>

      {/* 🔹 CONTROLS */}
      {/* 🔹 CONTROLS */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        {/* Search (full width) */}
        <input
          type="text"
          placeholder="Search by patient, doctor, department..."
          className="input w-full text-base"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            className="input w-full sm:w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            className="input w-full sm:w-48"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* 🔹 TABLE */}
      <div className="bg-white rounded-2xl shadow p-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="py-3">Patient</th>
              <th className="py-3">Doctor</th>
              <th className="py-3">Department</th>
              <th className="py-3">Date</th>
              <th className="py-3">Status</th>
              <th className="py-3">Visited</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((a) => (
                <tr key={a._id} className="border-b last:border-none">
                  <td className="py-3">
                    {a.firstName} {a.lastName}
                  </td>

                  <td className="py-3">
                    Dr. {a.doctor.firstName} {a.doctor.lastName}
                  </td>

                  <td className="py-3">{a.department}</td>

                  <td className="py-3">
                    {new Date(a.appointment_date).toLocaleDateString()}
                  </td>

                  <td className="py-3">
                    <select
                      value={a.status}
                      onChange={(e) =>
                        handleUpdateStatus(a._id, e.target.value)
                      }
                      className={`
                        px-3 py-1 rounded-lg border text-sm
                        ${
                          a.status === "Pending"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                            : a.status === "Cancelled"
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

                  <td className="py-3 text-xl">
                    {a.hasVisited ? (
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
    </section>
  );
};

export default Appointments;
