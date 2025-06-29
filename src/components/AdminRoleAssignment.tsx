import React, { useState } from "react";

interface Props {
  onAssign: (email: string, role: string) => Promise<void> | void;
}

const AdminRoleAssignment: React.FC<Props> = ({ onAssign }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(email, role);
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <h2 className="text-lg font-semibold">Assign User Role</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="User email"
        className="w-full rounded border p-2"
        required
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full rounded border p-2"
      >
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
      </select>
      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Assign Role
      </button>
    </form>
  );
};

export default AdminRoleAssignment;
