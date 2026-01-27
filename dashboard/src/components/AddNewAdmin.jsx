import axios from "axios";
import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";

const AddNewAdmin = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [patientId, setPatientId] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  //   const navigateTo = useNavigate();

  const handleAddNew = async (e) => {
    e.preventDefault();

    try {
      // http://localhost:3000/api/v1/user/admin/addnew
      const res = await axios.post(
        `${baseURL}/api/v1/user/admin/addnew`,
        {
          firstName,
          lastName,
          email,
          password,
          phone,
          patientId,
          dob,
          gender,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );

      toast.success(res.data.message || "Registered successfully");
      setIsAuthenticated(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="space-y-6">
      <div className="max-w-2xl bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold text-slate-900">Add Admin</h2>

        <p className="mt-1 text-slate-600">
          Please enter details of the new administrator
        </p>

        <form onSubmit={handleAddNew} className="mt-6 space-y-5">
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

          {/* Patient ID & DOB */}
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

          {/* Gender & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="input"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium hover:opacity-90 transition"
            >
              Register Admin
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddNewAdmin;
