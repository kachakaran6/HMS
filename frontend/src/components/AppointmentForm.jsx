import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AppointmentForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [patientId, setPatientId] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setappointmentDate] = useState("");
  const [department, setdepartment] = useState("");
  const [doctorFirstName, setdoctorFirstName] = useState("");
  const [doctorLastName, setdoctorLastName] = useState("");
  const [address, setaddress] = useState("");
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

  //   http://localhost:3000/api/v1/user/allDoc

  const baseurl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data } = await axios.get(
        `${baseurl}/api/v1/user/allDoc`,
        // {},
        { withCredentials: true },
      );
      setDoctors(data.users || []);
    };
    fetchDoctors();
  }, [baseurl]);

  const navigateTo = useNavigate();

  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      const hasVisitedBool = Boolean(hasVisited);
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
          hasVisited: hasVisitedBool,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      toast.success(data.message);
      navigateTo("/");
    } catch (error) {
      toast.error(error.reponse.data.message);
    }
  };

  console.log("Selected department:", department);
  console.log(
    "Doctors departments:",
    doctors.map((d) => d.doctorDepartment),
  );

  return (
    <div className="container form-component appointment-form">
      <h2>Appointment</h2>

      <form onSubmit={handleAppointment}>
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

        <div>
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
        </div>

        <div>
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
        </div>

        <div>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="date"
            placeholder="Appointment Date"
            value={appointmentDate}
            onChange={(e) => setappointmentDate(e.target.value)}
          />
        </div>

        <div>
          <select
            value={department}
            onChange={(e) => {
              setdepartment(e.target.value);
              setdoctorFirstName("");
              setdoctorLastName("");
            }}
          >
            <option value="">Select Department</option>
            {departmentsArray.map((depart) => (
              <option value={depart} key={depart}>
                {depart}
              </option>
            ))}
          </select>

          <select
            value={
              doctorFirstName && doctorLastName
                ? `${doctorFirstName} ${doctorLastName}`
                : ""
            }
            onChange={(e) => {
              const [firstName, lastName] = e.target.value.split(" ");
              setdoctorFirstName(firstName);
              setdoctorLastName(lastName);
            }}
            disabled={!department}
          >
            <option value="">Select Doctor</option>

            {Array.isArray(doctors) &&
              doctors
                .filter((doctor) => doctor.doctorDepartment === department)
                .map((doctor) => (
                  <option
                    key={doctor._id}
                    value={`${doctor.firstName} ${doctor.lastName}`}
                  >
                    {doctor.firstName} {doctor.lastName}
                  </option>
                ))}
          </select>
        </div>
        <textarea
          rows={10}
          value={address}
          onChange={(e) => setaddress(e.target.value)}
          placeholder="Address"
        ></textarea>

        <div
          style={{
            gap: "10px",
            justifyContent: "flex-end",
            flexDirection: "row",
          }}
        >
          <p style={{ marginBottom: 0 }}>Habe you visited before?</p>
          <input
            type="checkbox"
            checked={hasVisited}
            onChange={(e) => setHasVisited(e.target.value)}
            style={{ flex: "none", width: "25px" }}
          />
        </div>

        <div style={{ justifyContent: "center" }}>
          <button type="submit">Book Appointment</button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
