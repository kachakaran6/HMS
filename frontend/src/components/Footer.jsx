import React from "react";
import { Link } from "react-router-dom";
import { FaLocationArrow, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const hours = [
    { id: 1, day: "Monday", time: "9:00 AM - 11:00 PM" },
    { id: 2, day: "Tuesday", time: "12:00 PM - 12:00 AM" },
    { id: 3, day: "Wednesday", time: "10:00 AM - 10:00 PM" },
    { id: 4, day: "Thursday", time: "9:00 AM - 9:00 PM" },
    { id: 5, day: "Friday", time: "3:00 PM - 9:00 PM" },
    { id: 6, day: "Saturday", time: "9:00 AM - 3:00 PM" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo / About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-xl font-semibold text-white">Acare</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              A modern hospital management system designed to simplify
              appointments, improve patient care, and connect doctors
              seamlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/appointment" className="hover:text-white transition">
                  Appointment
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="text-white font-semibold mb-4">Working Hours</h4>
            <ul className="space-y-2 text-sm">
              {hours.map((item) => (
                <li key={item.id} className="flex justify-between gap-4">
                  <span>{item.day}</span>
                  <span className="text-slate-400">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <FaPhone className="text-blue-500" />
                <span>999-999-9999</span>
              </div>
              <div className="flex items-center gap-3">
                <MdEmail className="text-blue-500" />
                <span>hms-core@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <FaLocationArrow className="text-blue-500" />
                <span>Gujarat, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Acare Hospital Management System. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
