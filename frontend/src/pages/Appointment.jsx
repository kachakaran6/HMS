import React from "react";
import Hero from "../components/Hero";
import AppointmentForm from "../components/AppointmentForm";

const Appointment = () => {
  return (
    <>
      <Hero title={"Book Appointment"} imageurl={"/signin.png"} />
      <AppointmentForm />
    </>
  );
};

export default Appointment;
