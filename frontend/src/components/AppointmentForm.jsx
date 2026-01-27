import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AppointmentForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [patientId, setPatientId] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);
  const [doctors, setDoctors] = useState([]);

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Gynecologist",
    "Neurology",
    "Radiology",
    "Dermatology",
    "Cardiology",
  ];

  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data } = await axios.get(`${baseurl}/api/v1/user/allDoc`, {
        withCredentials: true,
      });
      setDoctors(data.users || []);
    };
    fetchDoctors();
  }, [baseurl]);

  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${baseurl}/api/v1/appointment/book`,
        {
          firstName,
          lastName,
          email,
          phone,
          patientId,
          dob,
          gender,
          appointment_date: appointmentDate,
          department,
          doctor_firstName: doctorFirstName,
          doctor_lastName: doctorLastName,
          address,
          hasVisited,
        },
        { withCredentials: true },
      );

      toast.success(data.message);
      navigateTo("/");
    } catch (error) {
      toast.error("Failed to book appointment", error.message);
    }
  };

  return (
    <section className="pt-28 pb-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Book an Appointment
          </h2>

          <form onSubmit={handleAppointment} className="space-y-6">
            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Patient & DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Patient ID"
                className="input"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
              <input
                type="date"
                className="input"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            {/* Gender & Appointment Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="input"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>

              <input
                type="date"
                className="input"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>

            {/* Department & Doctor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="input"
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setDoctorFirstName("");
                  setDoctorLastName("");
                }}
              >
                <option value="">Select Department</option>
                {departmentsArray.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>

              <select
                className="input"
                disabled={!department}
                value={
                  doctorFirstName && doctorLastName
                    ? `${doctorFirstName} ${doctorLastName}`
                    : ""
                }
                onChange={(e) => {
                  const [f, l] = e.target.value.split(" ");
                  setDoctorFirstName(f);
                  setDoctorLastName(l);
                }}
              >
                <option value="">Select Doctor</option>
                {doctors
                  .filter((doc) => doc.doctorDepartment === department)
                  .map((doc) => (
                    <option key={doc._id}>
                      {doc.firstName} {doc.lastName}
                    </option>
                  ))}
              </select>
            </div>

            {/* Address */}
            <textarea
              rows={4}
              className="input resize-none"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {/* Checkbox */}
            <label className="flex items-center gap-3 text-slate-700">
              <input
                type="checkbox"
                checked={hasVisited}
                onChange={(e) => setHasVisited(e.target.checked)}
                className="w-5 h-5 accent-blue-600"
              />
              Have you visited before?
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium hover:opacity-90 transition"
            >
              Book Appointment
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;
