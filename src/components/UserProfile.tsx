import React from "react";

export interface UserProfileProps {
  name: string;
  email: string;
  role: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, email, role }) => {
  return (
    <div className="rounded bg-white p-4 shadow dark:bg-gray-900">
      <h2 className="mb-2 text-xl font-bold">User Profile</h2>
      <div className="mb-1">
        <strong>Name:</strong> {name}
      </div>
      <div className="mb-1">
        <strong>Email:</strong> {email}
      </div>
      <div className="mb-1">
        <strong>Role:</strong> {role}
      </div>
    </div>
  );
};

export default UserProfile;
