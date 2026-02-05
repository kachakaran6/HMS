import { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import { toast } from "sonner";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/api/v1/appointment/all`, {
          withCredentials: true,
        });

        setAppointments(data.appointments || data.appointements || []);
      } catch {
        toast.error("Failed to fetch appointments", { position: "top-right" });
      } finally {
        setLoading(false);
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

      toast.success("Appointment updated", { position: "top-right" });
    } catch {
      toast.error("Failed to update appointment", { position: "top-right" });
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

  const Loader = () => (
    <div className="flex items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
    </div>
  );

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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="h-11 w-48">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="latest">Latest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
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
            {loading ? (
              /* 🔄 LOADER STATE */
              <TableRow>
                <TableCell colSpan={role === "admin" ? 7 : 6} className="py-20">
                  <div className="flex items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredAppointments.length === 0 ? (
              /* ❌ EMPTY STATE */
              <TableRow>
                <TableCell
                  colSpan={role === "admin" ? 7 : 6}
                  className="text-center py-10 text-slate-500"
                >
                  No appointments found
                </TableCell>
              </TableRow>
            ) : (
              /* ✅ DATA STATE */
              filteredAppointments.map((a) => (
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
                      <Select
                        value={a.status}
                        onValueChange={(value) =>
                          handleUpdateStatus(a._id, value)
                        }
                      >
                        <SelectTrigger className="h-9 w-36 text-sm">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default Appointments;
