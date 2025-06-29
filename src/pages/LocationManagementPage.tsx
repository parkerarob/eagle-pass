import { LocationManager } from "../components/LocationManager";

export default function LocationManagementPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 p-4">
      <h1 className="text-2xl font-bold">Location Management</h1>
      <LocationManager />
    </div>
  );
}
