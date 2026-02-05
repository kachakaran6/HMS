import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseurl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // http://localhost:3000/api/v1/user/allDoc
    // http://localhost:3000/api/v1/doctor/update/:id"
    // http://localhost:3000/api/v1/doctor/delete/:id"
    const fetchDoctors = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(`${baseurl}/api/v1/user/allDoc`, {
          withCredentials: true,
        });

        setDoctors(data.users || []);
      } catch (error) {
        toast.error(
          "Failed to fetch doctors",
          { position: "top-right" },
          error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchDoctors();
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

      toast.success("Doctor deleted successfully", { position: "top-right" });
      setDoctorToDelete(null);
    } catch (error) {
      toast.error(
        "Failed to delete doctor",
        { position: "top-right" },
        error.message,
      );
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

      toast.success("Doctor updated successfully", { position: "top-right" });
      setSelectedDoctor(null);
    } catch (error) {
      toast.error(
        "Failed to update doctor",
        { position: "top-right" },
        error.message,
      );
    }
  };

  const Loader = () => (
    <div className="flex items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
    </div>
  );

  return (
    <section className="space-y-6 bg-slate-50 p-6 rounded-xl">
      <h1 className="text-2xl font-bold text-slate-900">Doctors</h1>
      {loading ? (
        <Loader />
      ) : doctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition p-5 flex flex-col items-center text-center"
            >
              {/* AVATAR */}
              <img
                src={doctor.docAvatar?.url || "/doctor-placeholder.png"}
                alt="doctor"
                className="w-24 h-24 rounded-full object-cover border mb-4"
              />

              {/* NAME */}
              <h4 className="text-lg font-semibold text-slate-900">
                Dr. {doctor.firstName} {doctor.lastName}
              </h4>

              {/* DEPARTMENT BADGE */}
              <span className="mt-1 inline-block rounded-full bg-blue-100 text-blue-700 px-3 py-0.5 text-xs font-medium">
                {doctor.doctorDepartment}
              </span>

              {/* DETAILS */}
              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <p>{doctor.email}</p>
                <p>{doctor.phone}</p>
              </div>

              {/* ACTIONS */}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setSelectedDoctor(doctor)}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
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
        <Dialog open onOpenChange={() => setSelectedDoctor(null)}>
          <DialogContent className="max-w-md bg-white rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-slate-900">
                Update Doctor
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleUpdateDoctor} className="space-y-4">
              {["firstName", "lastName", "email", "phone"].map((field) => (
                <div key={field}>
                  <label className="text-sm text-slate-700 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    className="w-full h-11 rounded-lg border border-slate-300 px-3 focus:border-blue-600 focus:outline-none"
                    value={selectedDoctor[field]}
                    onChange={(e) =>
                      setSelectedDoctor({
                        ...selectedDoctor,
                        [field]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedDoctor(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
