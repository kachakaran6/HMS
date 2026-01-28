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
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>

      {/* 🔹 FILTER BAR */}
      <div className="bg-white border shadow-sm rounded-2xl p-6 space-y-4">
        <Input
          placeholder="Search patient, doctor, department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white"
        />

        <div className="flex flex-wrap gap-4">
          <select
            className="input w-48"
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
            className="input w-48"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* 🔹 TABLE */}
      <div className="bg-white border shadow-sm rounded-2xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Visited</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredAppointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-slate-500">
                  No appointments found
                </TableCell>
              </TableRow>
            )}

            {filteredAppointments.map((a) => (
              <TableRow key={a._id}>
                <TableCell>
                  {a.firstName} {a.lastName}
                </TableCell>

                <TableCell>
                  Dr. {a.doctor.firstName} {a.doctor.lastName}
                </TableCell>

                <TableCell>{a.department}</TableCell>

                <TableCell>
                  {new Date(a.appointment_date).toLocaleDateString()}
                </TableCell>

                <TableCell>{statusBadge(a.status)}</TableCell>

                <TableCell className="text-xl">
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
                    className="input w-36"
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
