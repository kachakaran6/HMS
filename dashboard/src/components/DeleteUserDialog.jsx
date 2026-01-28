import axios from "axios";
import { toast } from "react-toastify";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const DeleteUserDialog = ({ user, onClose, onDeleted }) => {
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  if (!user) return null;

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseurl}/api/v1/user/doctor/delete/${user._id}`, {
        withCredentials: true,
      });

      toast.success("User deleted");
      onDeleted(user._id);
      onClose();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <AlertDialog open={!!user} onOpenChange={onClose}>
      <AlertDialogContent
        className="
          bg-white
          border
          shadow-2xl
          rounded-2xl
          p-6
          max-w-md
        "
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-slate-900">
            Delete User
          </AlertDialogTitle>

          <AlertDialogDescription className="text-slate-600 mt-2">
            Are you sure you want to delete{" "}
            <span className="font-medium text-slate-900">
              {user.firstName} {user.lastName}
            </span>
            ?
            <br />
            <span className="text-red-600 font-medium">
              This action cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel
            onClick={onClose}
            className="border border-slate-300"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            className="
              bg-red-600
              hover:bg-red-700
              text-white
            "
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
