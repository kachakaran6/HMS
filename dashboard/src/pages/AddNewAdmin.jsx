import axios from "axios";
import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Context } from "../main";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const AddNewAdmin = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [patientId, setPatientId] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  //   const navigateTo = useNavigate();

  const handleAddNew = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      // http://localhost:3000/api/v1/user/admin/addnew
      const res = await axios.post(
        `${baseURL}/api/v1/user/admin/addnew`,
        {
          firstName,
          lastName,
          email,
          password,
          phone,
          patientId,
          dob,
          gender,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );

      toast.success(res.data.message || "Registered successfully", {
        position: "top-right",
      });
      setIsAuthenticated(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed", {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }

    setDob("");
    setEmail("");
    setFirstName("");
    setGender("");
    setLastName("");
    setPassword("");
    setPatientId("");
    setPhone("");
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="bg-slate-50 p-6 rounded-xl">
      <div className="max-w-2xl bg-white rounded-2xl border shadow-sm p-8">
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Add Administrator
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Enter details to create a new admin account
          </p>
        </div>

        <form onSubmit={handleAddNew} className="space-y-6">
          {/* ================= BASIC INFO ================= */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-700">First Name</label>
                <input
                  type="text"
                  className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3 focus:border-blue-600 focus:outline-none"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-slate-700">Last Name</label>
                <input
                  type="text"
                  className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3 focus:border-blue-600 focus:outline-none"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* ================= CONTACT ================= */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Contact Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-700">Email Address</label>
                <input
                  type="email"
                  className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3 focus:border-blue-600 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3 focus:border-blue-600 focus:outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* ================= ID & PERSONAL ================= */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Personal Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-700">Patient ID</label>
                <input
                  type="text"
                  className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3 focus:border-blue-600 focus:outline-none"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-slate-700">Date of Birth</label>
                <input
                  type="date"
                  className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3 focus:border-blue-600 focus:outline-none"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* ================= SECURITY ================= */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Security
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gender */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm text-slate-700">Gender</label>

                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className=" w-full rounded-lg border border-slate-300 text-sm focus:border-blue-600">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>

                  <SelectContent className="bg-white border shadow-md rounded-lg">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm text-slate-700">Password</label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="h-11 w-full rounded-lg border border-slate-300 px-3 pr-10 text-sm
                     focus:border-blue-600 focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SUBMIT ================= */}
          <div className="pt-6 border-t flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Registering..." : "Register Admin"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddNewAdmin;
