import { render, screen } from "@testing-library/react";
import AuditLogPage from "../AuditLogPage";

describe("AuditLogPage", () => {
  it("shows audit logs", () => {
    render(<AuditLogPage />);
    expect(screen.getByTestId("audit-log")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /audit log/i }),
    ).toBeInTheDocument();
  });
});
