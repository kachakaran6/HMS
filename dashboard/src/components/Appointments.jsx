import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Appointments = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  // 🔹 FETCH
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/api/v1/appointment/all`, {
          withCredentials: true,
        });
        setAppointments(data.appointements || []);
      } catch {
        toast.error("Failed to fetch appointments", { position: "top-right" });
      }
    };
    fetchAppointments();
  }, [baseURL]);

  // 🔹 FILTER + SEARCH + SORT
  const filteredAppointments = useMemo(() => {
    return appointments
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
      .filter((a) =>
        statusFilter === "all" ? true : a.status === statusFilter,
      )
      .sort((a, b) =>
        sortOrder === "latest"
          ? new Date(b.appointment_date) - new Date(a.appointment_date)
          : new Date(a.appointment_date) - new Date(b.appointment_date),
      );
  }, [appointments, search, statusFilter, sortOrder]);

  // 🔹 UPDATE STATUS
  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(
        `${baseURL}/api/v1/appointment/update/${id}`,
        { status },
        { withCredentials: true },
      );

      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a)),
      );

      toast.success("Appointment updated", { position: "top-right" });
    } catch {
      toast.error("Failed to update appointment", { position: "top-right" });
    }
  };

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
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
      </div>

      {/* 🔹 FILTER BAR */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
        <Input
          placeholder="Search patient, doctor, department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
        />

        <div className="flex flex-wrap gap-4">
          <select
            className="h-11 w-48 rounded-lg border border-slate-300 px-3 text-sm text-slate-700 focus:border-blue-600 focus:outline-none"
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
            className="h-11 w-48 rounded-lg border border-slate-300 px-3 text-sm text-slate-700 focus:border-blue-600 focus:outline-none"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* 🔹 TABLE */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-100">
            <TableRow>
              <TableHead className="text-slate-700">Patient</TableHead>
              <TableHead className="text-slate-700">Doctor</TableHead>
              <TableHead className="text-slate-700">Department</TableHead>
              <TableHead className="text-slate-700">Date</TableHead>
              <TableHead className="text-slate-700">Status</TableHead>
              <TableHead className="text-slate-700 text-center">
                Visited
              </TableHead>
              <TableHead className="text-right text-slate-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredAppointments.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-slate-500 py-10"
                >
                  No appointments found
                </TableCell>
              </TableRow>
            )}

            {filteredAppointments.map((a) => (
              <TableRow key={a._id} className="hover:bg-slate-50 transition">
                <TableCell className="font-medium text-slate-900">
                  {a.firstName} {a.lastName}
                </TableCell>

                <TableCell className="text-slate-700">
                  Dr. {a.doctor.firstName} {a.doctor.lastName}
                </TableCell>

                <TableCell className="text-slate-700">{a.department}</TableCell>

                <TableCell className="text-slate-700">
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

                <TableCell className="text-right">
                  <select
                    value={a.status}
                    onChange={(e) => handleUpdateStatus(a._id, e.target.value)}
                    className="h-9 w-36 rounded-lg border border-slate-300 px-2 text-sm focus:border-blue-600 focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default Appointments;
