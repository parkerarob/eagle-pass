import React from "react";

export interface UserProfileProps {
  displayName: string | null;
  email: string | null;
  role: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  displayName,
  email,
  role,
}) => (
  <div className="rounded-md bg-white p-4 shadow">
    <h2 className="text-lg font-semibold">Profile</h2>
    <p className="mt-2">Name: {displayName}</p>
    <p>Email: {email}</p>
    <p>Role: {role}</p>
  </div>
);

export default UserProfile;
