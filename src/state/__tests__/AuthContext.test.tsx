import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AuthProvider, useAuth } from "../AuthContext";

function TestComponent() {
  const { user, role } = useAuth();
  return (
    <div>
      <span>{user?.email}</span>
      <span>{role}</span>
    </div>
  );
}

describe("AuthContext", () => {
  it("provides test user in test mode", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("student")).toBeInTheDocument();
  });
});
