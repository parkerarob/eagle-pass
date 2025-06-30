import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../../components/GroupManager", () => ({
  GroupManager: () => <div data-testid="group-manager" />,
}));

vi.mock("../../services/group", () => ({
  listGroups: vi.fn().mockResolvedValue([]),
  createGroup: vi.fn().mockResolvedValue(undefined),
  deleteGroup: vi.fn().mockResolvedValue(undefined),
}));

import GroupManagementPage from "../GroupManagementPage";

describe("GroupManagementPage", () => {
  it("shows group management", () => {
    render(<GroupManagementPage />);
    expect(screen.getByTestId("group-management")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /group management/i }),
    ).toBeInTheDocument();
  });
});
