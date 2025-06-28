import { render, screen } from "@testing-library/react";
import React from "react";
import AdminUserManagementPage from "./AdminUserManagementPage";
import { describe, it, expect, vi } from "vitest";

// Mock Firestore
vi.mock("../firebase", () => {
  return {
    db: {},
    collection: vi.fn(),
    getDocs: vi.fn(async () => ({
      forEach: (cb: (doc: unknown) => void) => {
        cb({
          id: "user-1",
          data: () => ({
            email: "test1@school.edu",
            displayName: "Test User 1",
            status: "pending",
            role: "student",
          }),
        });
        cb({
          id: "user-2",
          data: () => ({
            email: "test2@school.edu",
            displayName: "Test User 2",
            status: "approved",
            role: "teacher",
          }),
        });
      },
    })),
    doc: vi.fn(),
    updateDoc: vi.fn(),
  };
});

describe("AdminUserManagementPage", () => {
  it("renders user management heading and users", async () => {
    render(<AdminUserManagementPage />);
    expect(await screen.findByText(/user management/i)).toBeInTheDocument();
    expect(await screen.findByText("test1@school.edu")).toBeInTheDocument();
    expect(await screen.findByText("test2@school.edu")).toBeInTheDocument();
  });
});
