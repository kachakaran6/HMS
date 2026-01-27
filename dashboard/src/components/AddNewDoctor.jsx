import axios from "axios";
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";

const AddNewDoctor = () => {
  const { isAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [patientId, setPatientId] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [docDepartment, setDocDepartment] = useState("");
  const [docAvatar, setDocAvatar] = useState("");
  const [docAvatarPreview, setDocAvatarPreview] = useState("");
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Gynecologist",
    "Neurology",
    "Radiology",
    "Dermatology",
    "Cardiology",
  ];

  const navigateTo = useNavigate();

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocAvatarPreview(reader.result);
      setDocAvatar(file);
    };
  };

  const handleAddNewDoc = async (e) => {
    e.preventDefault();

    //    firstName,
    // lastName,
    // email,
    // phone,
    // password,
    // gender,
    // dob,
    // patientId,
    // doctorDepartment,
    // role: "doctor",
    // docAvatar: {
    //   public_id: cloudinaryResponse.public_id,
    //   url: cloudinaryResponse.secure_url,
    // },
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("patientId", patientId);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("doctorDepartment", docDepartment);
      formData.append("docAvatar", docAvatar);
      // http://localhost:3000/api/v1/user/doctor/addnew
      const res = await axios.post(
        `${baseURL}/api/v1/user/doctor/addnew`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      toast.success(res.data.message || "Registered successfully");
      navigateTo("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="page">
      <div className="container form-component add-doctor-form">
        <h2>Add Doctor</h2>
        <p>Please enter details of doctor</p>

        <form onSubmit={handleAddNewDoc}>
          <div className="first-wrapper">
            <div>
              <img
                src={
                  docAvatarPreview ? `${docAvatarPreview}` : "/docHolder.jpg"
                }
                alt="Doctor Avatar"
              />
            </div>

            <div>
              <input type="file" onChange={handleAvatar} />
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
              <select
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <select
                name="doctorDepartment"
                id=""
                value={docDepartment}
                onChange={(e) => setDocDepartment(e.target.value)}
              >
                <option value="">Select Department</option>
                {departmentsArray.map((depart) => (
                  <option value={depart} key={depart}>
                    {depart}
                  </option>
                ))}
              </select>
              <button type="submit">Add Doctor</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddNewDoctor;
