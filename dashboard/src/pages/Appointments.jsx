import { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import { toast } from "sonner";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Context } from "../main";

const Appointments = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const { user } = useContext(Context);
  const role = localStorage.getItem("role");

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/api/v1/appointment/all`, {
          withCredentials: true,
        });

        setAppointments(data.appointements || []);
      } catch {
        toast.error("Failed to fetch appointments");
      }
    };

    fetchAppointments();
  }, [baseURL]);

  /* ================= FILTER + ROLE ================= */
  const filteredAppointments = useMemo(() => {
    return (
      appointments
        // 🔐 ROLE BASED FILTER
        .filter((a) => {
          if (role === "doctor") {
            return a.doctorId === user?._id;
          }
          return true; // admin
        })

        // 🔍 SEARCH
        .filter((a) => {
          const q = search.toLowerCase();
          return (
            a.firstName.toLowerCase().includes(q) ||
            a.lastName.toLowerCase().includes(q) ||
            a.department.toLowerCase().includes(q) ||
            a.doctor?.firstName?.toLowerCase().includes(q) ||
            a.doctor?.lastName?.toLowerCase().includes(q)
          );
        })

        // 🏷 STATUS FILTER
        .filter((a) =>
          statusFilter === "all" ? true : a.status === statusFilter,
        )

        // ⏱ SORT
        .sort((a, b) =>
          sortOrder === "latest"
            ? new Date(b.appointment_date) - new Date(a.appointment_date)
            : new Date(a.appointment_date) - new Date(b.appointment_date),
        )
    );
  }, [appointments, search, statusFilter, sortOrder, role, user]);

  /* ================= UPDATE STATUS (ADMIN ONLY) ================= */
  const handleUpdateStatus = async (id, status) => {
    if (role !== "admin") return;

    try {
      await axios.put(
        `${baseURL}/api/v1/appointment/update/${id}`,
        { status },
        { withCredentials: true },
      );

      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a)),
      );

      toast.success("Appointment updated");
    } catch {
      toast.error("Failed to update appointment");
    }
  };

  /* ================= STATUS BADGE ================= */
  const statusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-100 text-red-700">Cancelled</Badge>;
      case "Completed":
        return <Badge className="bg-blue-100 text-blue-700">Completed</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-700">Confirmed</Badge>;
    }
  };

  return (
    <section className="space-y-6 bg-slate-50 p-6 rounded-xl">
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-slate-900">
        {role === "doctor" ? "My Appointments" : "All Appointments"}
      </h1>

      {/* FILTER BAR */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
        <Input
          placeholder="Search patient, doctor, department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11"
        />

        <div className="flex flex-wrap gap-4">
          <select
            className="h-11 w-48 rounded-lg border px-3 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            className="h-11 w-48 rounded-lg border px-3 text-sm"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-100">
            <TableRow>
              <TableHead>Patient</TableHead>
              {role === "admin" && <TableHead>Doctor</TableHead>}
              <TableHead>Department</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Visited</TableHead>
              {role === "admin" && (
                <TableHead className="text-right">Action</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredAppointments.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={role === "admin" ? 7 : 6}
                  className="text-center py-10 text-slate-500"
                >
                  No appointments found
                </TableCell>
              </TableRow>
            )}

            {filteredAppointments.map((a) => (
              <TableRow key={a._id}>
                <TableCell className="font-medium">
                  {a.firstName} {a.lastName}
                </TableCell>

                {role === "admin" && (
                  <TableCell>
                    Dr. {a.doctor.firstName} {a.doctor.lastName}
                  </TableCell>
                )}

                <TableCell>{a.department}</TableCell>

                <TableCell>
                  {new Date(a.appointment_date).toLocaleDateString()}
                </TableCell>

                <TableCell>{statusBadge(a.status)}</TableCell>

                <TableCell className="text-center text-xl">
                  {a.hasVisited ? (
                    <GoCheckCircleFill className="text-green-600" />
                  ) : (
                    <AiFillCloseCircle className="text-red-500" />
                  )}
                </TableCell>

                {role === "admin" && (
                  <TableCell className="text-right">
                    <select
                      value={a.status}
                      onChange={(e) =>
                        handleUpdateStatus(a._id, e.target.value)
                      }
                      className="h-9 w-36 rounded-lg border px-2 text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default Appointments;
