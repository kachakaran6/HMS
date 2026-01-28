import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { Context } from "../main";
import { toast } from "react-toastify";

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

import UserDetailsDialog from "./UserDetailsDialog";
import UserEditDialog from "./UserEditDialog";
import DeleteUserDialog from "./DeleteUserDialog";

const Users = () => {
  const { isAuthenticated } = useContext(Context);
  const baseurl = import.meta.env.VITE_API_BASE_URL;

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${baseurl}/api/v1/user/all`, {
          withCredentials: true,
        });
        setUsers(data.users || []);
      } catch {
        toast.error("Failed to load users");
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

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>

      {/* TOP BAR */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Search name, email, phone..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted">
                  No users found
                </TableCell>
              </TableRow>
            )}

            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">
                  {user.firstName} {user.lastName}
                </TableCell>

                <TableCell>
                  <Badge variant="secondary">{user.role}</Badge>
                </TableCell>

                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>

                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setViewUser(user)}
                  >
                    View
                  </Button>

                  <Button
                    className="bg-amber-100 text-amber-700 hover:bg-amber-200"
                    size="sm"
                    onClick={() => setEditUser(user)}
                  >
                    Edit
                  </Button>

                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteUser(user)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
