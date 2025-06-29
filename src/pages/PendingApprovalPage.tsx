import React from "react";

const PendingApprovalPage: React.FC = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="space-y-4 text-center">
      <h1 className="text-2xl font-bold">Account Pending Approval</h1>
      <p>
        Your account is awaiting administrator approval. Please check back
        later.
      </p>
    </div>
  </div>
);

export default PendingApprovalPage;
