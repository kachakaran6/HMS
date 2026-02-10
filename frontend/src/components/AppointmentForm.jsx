/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export default function AppointmentForm() {
  // const navigate = useNavigate();
  const baseurl = import.meta.env.VITE_API_BASE_URL;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    doctorId: "",
    appointmentDate: null,
    timeSlot: "",
    address: "",
    hasVisited: false,
  });

  const [doctors, setDoctors] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      const { data } = await axios.get(`${baseurl}/api/v1/user/allDoc`, {
        withCredentials: true,
      });
      setDoctors(data.users || []);
    };
    fetchDoctors();
  }, [baseurl]);

  // Fetch availability
  useEffect(() => {
    if (form.doctorId && form.appointmentDate) {
      axios
        .get(`${baseurl}/api/v1/appointment/availability`, {
          params: {
            doctorId: form.doctorId,
            date: form.appointmentDate?.toISOString().split("T")[0],
          },
        })
        .then((res) => {
          setBookedSlots(res.data.bookedSlots || []);
        });
    }
  }, [form.doctorId, form.appointmentDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.timeSlot) {
      toast.warning("Please select a time slot");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${baseurl}/api/v1/appointment/book`,
        {
          ...form,
          appointment_date: form.appointmentDate?.toISOString().split("T")[0],
        },
        { withCredentials: true },
      );

      toast.success("Appointment booked successfully 🎉");

      // Reset form
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        doctorId: "",
        appointmentDate: null,
        timeSlot: "",
        address: "",
        hasVisited: false,
        dob: "",
        gender: "",
        doctor_firstName: "",
        doctor_lastName: "",
      });
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";

      if (message.includes("already booked")) {
        toast.error("This slot is already booked ❌");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 py-10 sm:py-16 px-4 sm:px-6 flex justify-center">
      <Card className="w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-xl border bg-white">
        <CardContent className="p-6 sm:p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Book Appointment
            </h2>
            <p className="text-muted-foreground text-sm">
              Schedule your consultation with our specialists
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Personal Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>

                <Input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                />

                <Select
                  onValueChange={(val) => setForm({ ...form, gender: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Appointment Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">
                Appointment Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Department */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select
                    value={form.department}
                    onValueChange={(val) =>
                      setForm({ ...form, department: val, doctorId: "" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Pediatrics",
                        "Orthopedics",
                        "Gynecologist",
                        "Neurology",
                        "Radiology",
                        "Dermatology",
                        "Cardiology",
                      ].map((dep) => (
                        <SelectItem key={dep} value={dep}>
                          {dep}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Doctor */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Doctor</label>
                  <Select
                    disabled={!form.department}
                    onValueChange={(val) => {
                      const selectedDoctor = doctors.find((d) => d._id === val);
                      setForm({
                        ...form,
                        doctorId: val,
                        doctor_firstName: selectedDoctor.firstName,
                        doctor_lastName: selectedDoctor.lastName,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors
                        .filter((d) => d.doctorDepartment === form.department)
                        .map((doc) => (
                          <SelectItem key={doc._id} value={doc._id}>
                            Dr. {doc.firstName} {doc.lastName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.appointmentDate
                        ? format(form.appointmentDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={form.appointmentDate}
                      onSelect={(date) =>
                        setForm({ ...form, appointmentDate: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Slots */}
              {form.doctorId && form.appointmentDate && (
                <div className="space-y-4">
                  <label className="text-sm font-medium">
                    Select Time Slot
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {TIME_SLOTS.map((slot) => {
                      const isBooked = bookedSlots.includes(slot);
                      const isSelected = form.timeSlot === slot;

                      return (
                        <Button
                          key={slot}
                          type="button"
                          disabled={isBooked}
                          variant="outline"
                          className={`rounded-xl transition-all
                            ${isBooked && "opacity-40 cursor-not-allowed"}
                            ${
                              isSelected &&
                              "bg-primary text-white border-primary scale-105"
                            }
                          `}
                          onClick={() => setForm({ ...form, timeSlot: slot })}
                        >
                          {slot}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-3">
              <Checkbox
                checked={form.hasVisited}
                onCheckedChange={(val) => setForm({ ...form, hasVisited: val })}
              />
              <span className="text-sm">I have visited before</span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 text-lg rounded-2xl transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Booking...
                </div>
              ) : (
                "Confirm Appointment"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
