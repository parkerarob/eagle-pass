import { render, screen } from "@testing-library/react";
import React from "react";
import PendingApprovalPage from "./PendingApprovalPage";
import { describe, it, expect } from "vitest";

describe("PendingApprovalPage", () => {
  it("shows pending approval message", () => {
    render(<PendingApprovalPage />);
    const msg = screen.getByText(/pending approval by an administrator/i);
    expect(msg).toBeInTheDocument();
    expect(msg).toHaveAttribute("data-cy", "pending-approval-msg");
  });
});
