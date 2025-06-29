import AdminRoleAssignment from "../components/AdminRoleAssignment";

export default function UserManagementPage() {
  return (
    <div
      className="mx-auto max-w-md space-y-4 p-4"
      data-testid="user-management"
    >
      <h1 className="text-2xl font-bold">User Management</h1>
      <AdminRoleAssignment onAssign={() => {}} />
    </div>
  );
}
