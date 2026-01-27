import React from "react";
// import { useNavigate } from "react-router-dom";
const Hero = ({ title, imageurl }) => {
  // const navigateTo = useNavigate();
  // const gotoAppointmnet = () => {
  //   navigateTo("/appointment");
  // };
  return (
    <section className="pb-20 bg-linear-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-center">
          {/* Image Content (mobile first) */}
          <div className="relative flex justify-center order-1 lg:order-2">
            <img
              src={imageurl}
              alt="Healthcare illustration"
              className="
          w-full
          max-w-xs
          sm:max-w-sm
          md:max-w-md
          md:h-[85vh]
          lg:max-w-md
          rounded-2xl
          drop-shadow-xl
          animate-float
        "
            />

            {/* Decorative element */}
            <div className="absolute -z-10 w-56 h-56 sm:w-64 sm:h-64 bg-blue-200/40 rounded-full blur-3xl top-10 right-10"></div>
          </div>

          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <h1
              className="
        text-3xl
        sm:text-4xl
        md:text-5xl
        lg:text-6xl
        font-bold
        text-slate-900
        leading-tight
      "
            >
              {title}
            </h1>

            <p
              className="
        mt-4
        sm:mt-6
        max-w-xl
        mx-auto
        lg:mx-0
        text-base
        sm:text-lg
        text-slate-600
        leading-relaxed
      "
            >
              We provide modern, reliable, and patient-friendly healthcare
              services. Book appointments easily, connect with doctors, and
              manage your health seamlessly through our platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
