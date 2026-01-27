import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { toast } from "react-toastify";

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const baseurl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // http://localhost:3000/api/v1/user/allDoc
    // http://localhost:3000/api/v1/doctor/update/:id"
    // http://localhost:3000/api/v1/doctor/delete/:id"
    const fetchDoctors = async () => {
      const { data } = await axios.get(`${baseurl}/api/v1/user/allDoc`, {
        withCredentials: true,
      });
      setDoctors(data.users || []);
      console.log(data.users);
    };
    fetchDoctors();
  }, [isAuthenticated]);

  const confirmDeleteDoctor = async () => {
    try {
      await axios.delete(
        `${baseurl}/api/v1/user/doctor/delete/${doctorToDelete._id}`,
        { withCredentials: true },
      );

      setDoctors((prev) =>
        prev.filter((doc) => doc._id !== doctorToDelete._id),
      );

      toast.success("Doctor deleted successfully");
      setDoctorToDelete(null);
    } catch (error) {
      toast.error("Failed to delete doctor", error.message);
    }
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${baseurl}/api/v1/user/doctor/update/${selectedDoctor._id}`,
        selectedDoctor,
        { withCredentials: true },
      );

      setDoctors((prev) =>
        prev.map((doc) =>
          doc._id === selectedDoctor._id ? selectedDoctor : doc,
        ),
      );

      toast.success("Doctor updated successfully");
      setSelectedDoctor(null);
    } catch (error) {
      toast.error("Failed to update doctor", error.message);
    }
  };

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Doctors</h1>

      {doctors.length > 0 ? (
        <div
          className="
        grid grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-6
      "
        >
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center"
            >
              <img
                src={doctor.docAvatar?.url || "/doctor-placeholder.png"}
                alt="doctor"
                className="w-24 h-24 rounded-full object-cover mb-4 border"
              />

              <h4 className="text-lg font-semibold text-slate-900">
                {doctor.firstName} {doctor.lastName}
              </h4>

              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <p>
                  Department:{" "}
                  <span className="font-medium text-slate-800">
                    {doctor.doctorDepartment}
                  </span>
                </p>
                <p>Email: {doctor.email}</p>
                <p>Phone: {doctor.phone}</p>
              </div>

              {/* ACTIONS */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setSelectedDoctor(doctor)}
                  className="px-4 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => setDoctorToDelete(doctor)}
                  className="px-4 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500">No doctors found</p>
      )}

      {selectedDoctor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Update Doctor</h3>

            <form onSubmit={handleUpdateDoctor} className="space-y-4">
              <input
                className="input"
                value={selectedDoctor.firstName}
                onChange={(e) =>
                  setSelectedDoctor({
                    ...selectedDoctor,
                    firstName: e.target.value,
                  })
                }
              />

              <input
                className="input"
                value={selectedDoctor.lastName}
                onChange={(e) =>
                  setSelectedDoctor({
                    ...selectedDoctor,
                    lastName: e.target.value,
                  })
                }
              />

              <input
                className="input"
                value={selectedDoctor.email}
                onChange={(e) =>
                  setSelectedDoctor({
                    ...selectedDoctor,
                    email: e.target.value,
                  })
                }
              />

              <input
                className="input"
                value={selectedDoctor.phone}
                onChange={(e) =>
                  setSelectedDoctor({
                    ...selectedDoctor,
                    phone: e.target.value,
                  })
                }
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedDoctor(null)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {doctorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Delete Doctor
            </h3>

            <p className="mt-2 text-slate-600 text-sm">
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-800">
                Dr. {doctorToDelete.firstName} {doctorToDelete.lastName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDoctorToDelete(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteDoctor}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Doctor;
