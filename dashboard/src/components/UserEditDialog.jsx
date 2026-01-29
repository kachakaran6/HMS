/* eslint-disable react-hooks/set-state-in-effect */
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserEditDialog = ({ user, onClose, onUpdated }) => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const baseurl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!user) return;
    setForm({
      ...user,
      emailVerified: Boolean(user.emailVerified),
    });
  }, [user]);

  if (!form) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${baseurl}/api/v1/user/user/update/${form._id}`,
        form,
        { withCredentials: true },
      );

      toast.success("User updated successfully");
      onUpdated(data.user || form);
      onClose();
    } catch {
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EMAIL VERIFICATION ACTIONS ================= */

  const sendOTP = async () => {
    try {
      await axios.post(
        `${baseurl}/api/v1/auth/send-otp`,
        { email: form.email },
        { withCredentials: true },
      );
      setOtpSent(true);
      toast.success("OTP sent to email");
    } catch {
      toast.error("Failed to send OTP");
    }
  };

  const manualVerify = (checked) => {
    setForm((prev) => ({
      ...prev,
      emailVerified: checked,
      emailOTP: null,
      emailOTPExpire: null,
    }));
  };

  const verifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    setVerifying(true);
    try {
      await axios.post(
        `${baseurl}/api/v1/auth/verify-otp`,
        {
          email: form.email,
          otp,
        },
        { withCredentials: true },
      );

      toast.success("Email verified successfully");
      setForm((prev) => ({
        ...prev,
        emailVerified: true,
        emailOTP: null,
        emailOTPExpire: null,
      }));
      setOtp("");
      setOtpSent(false);
    } catch {
      toast.error("Invalid or expired OTP");
    } finally {
      setVerifying(false);
    }
  };

  /* =============================================================== */

  return (
    <Dialog key={user?._id} open={!!user} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] bg-slate-50 rounded-2xl p-0 shadow-2xl overflow-hidden">
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b bg-white">
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Super Edit User
          </DialogTitle>
          <p className="text-sm text-slate-500">
            Manage user profile, access level, and verification status
          </p>
        </DialogHeader>

        {/* SCROLLABLE BODY */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-6 space-y-8 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          {/* ================= BASIC INFORMATION ================= */}
          <section className="bg-white rounded-xl border p-5 space-y-4">
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["First Name", "firstName"],
                ["Last Name", "lastName"],
                ["Email", "email"],
                ["Phone", "phone"],
              ].map(([label, name]) => (
                <div key={name}>
                  <Label className="text-sm text-slate-700">{label}</Label>
                  <Input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="h-11 rounded-lg border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                  />
                </div>
              ))}

              <div>
                <Label className="text-sm text-slate-700">Date of Birth</Label>
                <Input
                  type="date"
                  name="dob"
                  value={form.dob?.slice(0, 10)}
                  onChange={handleChange}
                  className="h-11 rounded-lg border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                />
              </div>

              <div>
                <Label className="text-sm text-slate-700">Patient ID</Label>
                <Input
                  name="patientId"
                  value={form.patientId || ""}
                  onChange={handleChange}
                  className="h-11 rounded-lg border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* ================= ROLE & ACCESS ================= */}
          <section className="bg-white rounded-xl border p-5 space-y-4">
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Role & Access
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-slate-700">Gender</Label>
                <Select
                  value={form.gender}
                  onValueChange={(v) => setForm({ ...form, gender: v })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-slate-700">Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => setForm({ ...form, role: v })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="patient">Patient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* ================= EMAIL VERIFICATION ================= */}
          <section className="bg-white rounded-xl border p-5 space-y-4">
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Email Verification
            </h3>

            <div
              className={`rounded-lg p-4 border ${
                form.emailVerified
                  ? "border-green-300 bg-green-50"
                  : "border-amber-200 bg-amber-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Verification Status
                  </p>
                  <p
                    className={`text-xs ${
                      form.emailVerified ? "text-green-700" : "text-amber-700"
                    }`}
                  >
                    {form.emailVerified
                      ? "Email verified successfully"
                      : "Pending verification"}
                  </p>
                </div>

                <Switch
                  checked={form.emailVerified}
                  onCheckedChange={manualVerify}
                />
              </div>

              {!form.emailVerified && (
                <div className="mt-4 space-y-3">
                  {!otpSent ? (
                    <Button
                      type="button"
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={sendOTP}
                    >
                      Send Verification OTP
                    </Button>
                  ) : (
                    <>
                      <Input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="max-w-xs"
                      />

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={verifyOTP}
                          disabled={verifying}
                        >
                          {verifying ? "Verifying..." : "Verify OTP"}
                        </Button>

                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={sendOTP}
                        >
                          Resend
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* ================= FOOTER ================= */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
