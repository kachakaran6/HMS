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
    <section className="page">
      <div className="container form-component add-admin-form">
        <h2>Add Admin</h2>
        <p>Please enter details of admin</p>

        <form onSubmit={handleAddNew}>
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="text"
            placeholder="Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />

          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* <div style={{ gap: "10px", justifyContent: "flex-end" }}>
            <p style={{ marginBottom: 0 }}>Already Registered?</p>
            <Link to="/login">Login Now</Link>
          </div> */}

          <div style={{ justifyContent: "center" }}>
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddNewAdmin;
