import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Department = () => {
  const departmentsArray = [
    { name: "Pediatrics", imageUrl: "/departments/pedia.jpg" },
    { name: "Orthopedics", imageUrl: "/departments/ortho.jpg" },
    { name: "Cardiology", imageUrl: "/departments/cardio.jpg" },
    { name: "Neurology", imageUrl: "/departments/neuro.jpg" },
    { name: "Oncology", imageUrl: "/departments/onco.jpg" },
    { name: "Radiology", imageUrl: "/departments/radio.jpg" },
    { name: "Physical Therapy", imageUrl: "/departments/therapy.jpg" },
    { name: "Dermatology", imageUrl: "/departments/derma.jpg" },
    { name: "ENT", imageUrl: "/departments/ent.jpg" },
  ];

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1280 }, items: 4 },
    laptop: { breakpoint: { max: 1280, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Our Departments
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive medical specialties designed to provide complete
            healthcare under one roof.
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          responsive={responsive}
          infinite
          autoPlay
          autoPlaySpeed={3500}
          arrows
          removeArrowOnDeviceType={["tablet", "mobile"]}
          containerClass="pb-6"
          itemClass="px-3"
        >
          {departmentsArray.map((dept, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={dept.imageUrl}
                  alt={dept.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-slate-800">
                  {dept.name}
                </h3>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default Department;
