import { GroupManager } from "../components/GroupManager";

export default function GroupManagementPage() {
  return (
    <div
      className="mx-auto max-w-md space-y-4 p-4"
      data-testid="group-management"
    >
      <h1 className="text-2xl font-bold">Group Management</h1>
      <GroupManager />
    </div>
  );
}
