import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);

  const baseurl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // http://localhost:3000/api/v1/user/allDoc
    const fetchDoctors = async () => {
      const { data } = await axios.get(`${baseurl}/api/v1/user/allDoc`, {
        withCredentials: true,
      });
      setDoctors(data.users || []);
      console.log(data.users);
    };
    fetchDoctors();
  }, [isAuthenticated]);

  return (
    <section className="page doctors">
      <h1>Doctors</h1>

      <div className="banner">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div className="card" key={doctor._id}>
              <img
                src={doctor.docAvatar?.url || "/doctor-placeholder.png"}
                alt="doctor"
              />

              <h4>
                {doctor.firstName} {doctor.lastName}
              </h4>

              <div>
                <p>
                  Department: <span>{doctor.doctorDepartment}</span>
                </p>
                <p>
                  Email: <span>{doctor.email}</span>
                </p>
                <p>
                  Phone: <span>{doctor.phone}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No doctors found</p>
        )}
      </div>
    </section>
  );
};

export default Doctor;
