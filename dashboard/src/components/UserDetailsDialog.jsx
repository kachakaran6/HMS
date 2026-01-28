import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const UserDetailsDialog = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent
        className="
          max-w-xl
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
            User Details
          </DialogTitle>
        </DialogHeader>

        {/* BODY */}
        <div className="px-6 py-5 space-y-6 text-sm text-slate-700">
          {/* USER BASIC INFO */}
          <div className="flex items-center gap-4">
            <img
              src={user.docAvatar?.url || "/doctor-placeholder.png"}
              alt="user"
              className="w-20 h-20 rounded-full border object-cover bg-white"
            />

            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                {user.firstName} {user.lastName}
              </h3>

              <div className="flex gap-2 mt-1">
                <Badge variant="secondary" className="capitalize">
                  {user.role}
                </Badge>

                {!user.emailVerified && (
                  <Badge variant="destructive">Email not verified</Badge>
                )}
              </div>
            </div>
          </div>

          {/* DETAILS GRID */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 bg-slate-50 p-4 rounded-xl border">
            <Detail label="Email" value={user.email} />
            <Detail label="Phone" value={user.phone} />
            <Detail label="Gender" value={user.gender || "—"} />
            <Detail
              label="Date of Birth"
              value={user.dob ? new Date(user.dob).toLocaleDateString() : "—"}
            />
            <Detail label="Patient ID" value={user.patientId || "—"} />
            <Detail
              label="Created At"
              value={new Date(user.createdAt).toLocaleDateString()}
            />
          </div>

          {/* FOOTER */}
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p className="font-medium text-slate-900 break-all">{value}</p>
  </div>
);

export default UserDetailsDialog;
