import React from "react";
import UserSettings from "../components/UserSettings";

// Placeholder for user context (replace with real context later)
const mockUser = {
  name: "Test User",
  email: "testuser@school.edu",
};

const UserSettingsPage: React.FC = () => {
  const handleSave = (data: { name: string }) => {
    // TODO: Implement real save logic (e.g., call API)
    // For now, just log

    console.log("Saved user data:", data);
  };

  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <UserSettings
        initialName={mockUser.name}
        initialEmail={mockUser.email}
        onSave={handleSave}
      />
    </div>
  );
};

export default UserSettingsPage;
