import Hero from "../components/Hero";
import AppointmentForm from "../components/AppointmentForm";

const Appointment = () => {
  return (
    <main>
      <Hero title="Book Appointment" imageurl="/signin.png" />
      <AppointmentForm />
    </main>
  );
};

export default Appointment;
