import React from "react";

const PendingApprovalPage: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
    <div className="w-full max-w-md space-y-8 text-center">
      <h2 className="mt-6 text-2xl font-bold text-gray-900">
        Account Pending Approval
      </h2>
      <p className="mt-4 text-gray-700" data-cy="pending-approval-msg">
        Your account is pending approval by an administrator. You will receive
        access once your account has been reviewed.
      </p>
    </div>
  </div>
);

export default PendingApprovalPage;
