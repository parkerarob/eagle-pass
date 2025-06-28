import React, { useState } from "react";

export interface UserSettingsProps {
  initialName: string;
  initialEmail: string;
  onSave: (data: { name: string }) => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({
  initialName,
  initialEmail,
  onSave,
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }
    setError(null);
    onSave({ name });
  };

  return (
    <div className="mx-auto max-w-md rounded bg-white p-4 shadow dark:bg-gray-900">
      <h2 className="mb-2 text-xl font-bold">User Settings</h2>
      <div className="mb-4">
        <label className="mb-1 block font-medium">Name</label>
        <input
          type="text"
          className="w-full rounded border px-2 py-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-cy="user-settings-name-input"
        />
        {error && (
          <div
            className="mt-1 text-sm text-red-600"
            data-cy="user-settings-error"
          >
            {error}
          </div>
        )}
      </div>
      <div className="mb-4">
        <label className="mb-1 block font-medium">Email</label>
        <input
          type="email"
          className="w-full rounded border bg-gray-100 px-2 py-1 dark:bg-gray-800"
          value={initialEmail}
          disabled
        />
      </div>
      <button
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        onClick={handleSave}
        data-cy="user-settings-save-btn"
      >
        Save
      </button>
    </div>
  );
};

export default UserSettings;
