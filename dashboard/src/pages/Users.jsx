import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { Context } from "../main";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import UserDetailsDialog from "../components/UserDetailsDialog";
import UserEditDialog from "../components/UserEditDialog";
import DeleteUserDialog from "../components/DeleteUserDialog";

const Users = () => {
  const { isAuthenticated } = useContext(Context);
  const baseurl = import.meta.env.VITE_API_BASE_URL;

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${baseurl}/api/v1/user/all`, {
          withCredentials: true,
        });
        setUsers(data.users || []);
      } catch {
        toast.error("Failed to load users", { position: "top-right" });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [isAuthenticated]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = `${u.firstName} ${u.lastName} ${u.email} ${u.phone}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesRole = roleFilter === "all" || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const Loader = () => (
    <div className="flex items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
    </div>
  );

  return (
    <section className="space-y-6 bg-slate-50 p-6 rounded-xl">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
      </div>

      {/* TOP BAR */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl border">
        <Input
          placeholder="Search name, email, phone..."
          className="max-w-sm h-11 border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-11 w-48">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="doctor">Doctor</SelectItem>
            <SelectItem value="patient">Patient</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* TABLE */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-100">
            <TableRow>
              <TableHead className="text-slate-700">Name</TableHead>
              <TableHead className="text-slate-700">Role</TableHead>
              <TableHead className="text-slate-700">Email</TableHead>
              <TableHead className="text-slate-700">Phone</TableHead>
              <TableHead className="text-right text-slate-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              /* 🔄 LOADING STATE */
              <TableRow>
                <TableCell colSpan={5} className="py-20">
                  <div className="flex items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              /* ❌ EMPTY STATE */
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-slate-500 py-10"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              /* ✅ DATA STATE */
              filteredUsers.map((user) => (
                <TableRow
                  key={user._id}
                  className="hover:bg-slate-50 transition"
                >
                  <TableCell className="font-medium text-slate-900">
                    {user.firstName} {user.lastName}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={
                        user.role === "admin"
                          ? "bg-blue-100 text-blue-700"
                          : user.role === "doctor"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-700"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-slate-700">{user.email}</TableCell>

                  <TableCell className="text-slate-700">{user.phone}</TableCell>

                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-300 text-slate-700"
                      onClick={() => setViewUser(user)}
                    >
                      View
                    </Button>

                    <Button
                      size="sm"
                      className="bg-amber-100 text-amber-700 hover:bg-amber-200"
                      onClick={() => setEditUser(user)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => setDeleteUser(user)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODALS */}
      <UserDetailsDialog user={viewUser} onClose={() => setViewUser(null)} />

      <UserEditDialog
        user={editUser}
        onClose={() => setEditUser(null)}
        onUpdated={(updated) =>
          setUsers((prev) =>
            prev.map((u) => (u._id === updated._id ? updated : u)),
          )
        }
      />

      <DeleteUserDialog
        user={deleteUser}
        onClose={() => setDeleteUser(null)}
        onDeleted={(id) => setUsers((prev) => prev.filter((u) => u._id !== id))}
      />
    </section>
  );
};

export default Users;
