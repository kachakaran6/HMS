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

const UserEditDialog = ({ user, onClose, onUpdated }) => {
  const [form, setForm] = useState(null);
  const baseurl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    setForm(user);
  }, [user]);

  if (!form) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${baseurl}/api/v1/user/doctor/update/${form._id}`,
        form,
        { withCredentials: true },
      );

      toast.success("User updated");
      onUpdated(data.user || form);
      onClose();
    } catch {
      toast.error("Failed to update user");
    }
  };

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent
        className="
          max-w-md
          bg-white
          border
          shadow-2xl
          rounded-2xl
          p-0
        "
      >
        {/* HEADER */}
        <DialogHeader className="px-6 py-4 border-b bg-slate-50 rounded-t-2xl">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Edit User
          </DialogTitle>
        </DialogHeader>

        {/* BODY */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-4 text-slate-700"
        >
          <Input
            name="firstName"
            value={form.firstName || ""}
            onChange={handleChange}
            placeholder="First Name"
            className="bg-white"
          />

          <Input
            name="lastName"
            value={form.lastName || ""}
            onChange={handleChange}
            placeholder="Last Name"
            className="bg-white"
          />

          <Input
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            placeholder="Email"
            className="bg-white"
          />

          <Input
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            placeholder="Phone"
            className="bg-white"
          />

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
