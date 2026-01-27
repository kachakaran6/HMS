import React from "react";

const Biography = ({ imageurl }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Image */}
          <div className="flex justify-center">
            <img
              src={imageurl}
              alt="Who we are"
              className="w-full max-w-md rounded-2xl shadow-lg object-cover animate-float"
            />
          </div>

          {/* Content */}
          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Biography
            </p>

            <h3 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900">
              Who We Are
            </h3>

            <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
              <p>
                We are a modern healthcare-focused team committed to simplifying
                hospital management through technology. Our goal is to improve
                patient experience while empowering doctors and administrators.
              </p>

              <p>
                Built in 2024, our platform leverages the power of the
                <span className="font-medium text-slate-800">
                  {" "}
                  MERN Stack
                </span>{" "}
                to deliver a fast, secure, and scalable hospital management
                system.
              </p>

              <p>
                From appointment booking to seamless communication, we focus on
                building solutions that are practical, reliable, and easy to
                use.
              </p>

              <p className="font-medium text-slate-800">
                Coding is fun — and building meaningful products is even better.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Biography;
