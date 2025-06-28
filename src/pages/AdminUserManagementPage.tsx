import React, { useEffect, useState } from "react";
import { db, collection, getDocs, doc, updateDoc } from "../firebase";

type UserRecord = {
  uid: string;
  email: string;
  displayName?: string;
  status?: string;
  role?: string;
};

const roles = ["student", "teacher", "admin"];

const AdminUserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "users"));
        const list: UserRecord[] = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            uid: docSnap.id,
            email: data.email,
            displayName: data.displayName,
            status: data.status,
            role: data.role,
          });
        });
        setUsers(list);
      } catch {
        setError("Failed to load users");
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleApprove = async (uid: string) => {
    await updateDoc(doc(db, "users", uid), { status: "approved" });
    setUsers((users) =>
      users.map((u) => (u.uid === uid ? { ...u, status: "approved" } : u)),
    );
  };

  const handleRoleChange = async (uid: string, role: string) => {
    await updateDoc(doc(db, "users", uid), { role });
    setUsers((users) => users.map((u) => (u.uid === uid ? { ...u, role } : u)));
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="mx-auto max-w-2xl py-8">
      <h2 className="mb-4 text-2xl font-bold">User Management</h2>
      <table className="min-w-full border bg-white">
        <thead>
          <tr>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.displayName || "-"}</td>
              <td className="border px-4 py-2">{user.status || "unknown"}</td>
              <td className="border px-4 py-2">
                <select
                  value={user.role || ""}
                  onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                  data-cy={`role-select-${user.uid}`}
                >
                  <option value="">Select</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border px-4 py-2">
                {user.status !== "approved" && (
                  <button
                    onClick={() => handleApprove(user.uid)}
                    className="rounded bg-green-600 px-3 py-1 text-white"
                    data-cy={`approve-btn-${user.uid}`}
                  >
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserManagementPage;
